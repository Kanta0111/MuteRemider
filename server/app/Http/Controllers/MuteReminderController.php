<?php

namespace App\Http\Controllers;

require_once(__DIR__ . '/../../../vendor/autoload.php');
require_once(__DIR__ . '/../../modules/createTwitterConnection.php');
require_once(__DIR__ . '/../../modules/summarizeTwitterObjects.php');

use Log;
use Illuminate\Http\Request;
use Abraham\TwitterOAuth\TwitterOAuth;
use App\Users;
use App\MutedUsers;

class MuteReminderController extends Controller
{
  public function user_info()
  {
    // Log::debug($_GET);
    $oauth_token = $_GET['twitter_token'];
    $oauth_token_secret = $_GET['twitter_token_secret'];

    //TwitterOAuthのインスタンスを生成する
    $objTwitterConnection = createTwitterConnectionWithToken($oauth_token, $oauth_token_secret);
    // エラー配列が返却されて入ればそれがレスポンスになる
    if(! checkTwitterConnection($objTwitterConnection)) {
        return response()->json($objTwitterConnection);
    }

    $params = [
      'include_entities' => false,
      'skip_status'      => true,
      'include_email'    => false
    ];

    $authorized_user_info = $objTwitterConnection->get('account/verify_credentials', $params);
    $summarized_user_info = summarizeUserInfo($authorized_user_info);

    // ユーザーIDをクッキーに保存
    session([config('pg-const.SESSION_TW_USERINFO') => $summarized_user_info]);

    //利用経験のないユーザーの情報を格納する
    if (Users::isUserExists($summarized_user_info["screen_name"])) {
      Users::createUser($summarized_user_info["user_id"], $summarized_user_info["screen_name"]);
    }
      return response()->json($summarized_user_info);
  }

    public function list_api(Request $request)
    {
        //Log::debug($_GET);
        $oauth_token = $_GET['twitter_token'];
        $oauth_token_secret = $_GET['twitter_token_secret'];
        $objTwitterConnection = createTwitterConnectionWithToken($oauth_token, $oauth_token_secret);

        $tweets_params = ['count' => 20];

        // ミュートユーザーの情報を取得し、不要な情報を削る
        $muted_users = $objTwitterConnection->get('mutes/users/list', $tweets_params);
        $simple_users_array = summarizeMutedUsersInfo($muted_users);

        // エラー配列が返還されていた場合はそれをレスポンスとして返却
        if (count($simple_users_array)) {
            if (array_key_exists("code", $simple_users_array[0])) {
                return response()->json($simple_users_array);
            }
        } else {
            // レコード0の場合はnodataを１番上に入れたエラー配列を返す
            $nodata_error = [
                [
                    "code" => 901,
                    "message" => "ミュートしているユーザーが存在しません。\r\n" .
                        "ミュート機能を有効活用しましょう。",
                ]
            ];
            return response()->json($nodata_error);
        };

        //ミュートユーザーの情報をDBに格納
        Mutedusers::createMuterUserList($_GET["user_id"], $simple_users_array);

        $return_array = [];
        // ミュートユーザーごとのツイートを取得し、不要な情報を削る
        foreach ($simple_users_array as $muted_user) {
            $users_tweets_params = [
                'user_id' => $muted_user["user_id"],
                'count' => 20,
                'exclude_replies' => true, // リプライは含まない
                'include_rts' => false, //リツイートは含まない
                "tweet_mode" => "extended",
            ];
            $user_tweets = $objTwitterConnection->get('statuses/user_timeline', $users_tweets_params);
            // ユーザーごとの配列になるようにデータを格納
            $return_array[] = [
                "muted_user" => $muted_user,
                "tweets_info" => summarizeTweetsInfo($user_tweets)
            ];
        }
        return response()->json($return_array);
    }

    public function unmute($screen_name) {
        //TwitterOAuthのインスタンスを生成する
        $oauth_token = $_GET['twitter_token'];
        $oauth_token_secret = $_GET['twitter_token_secret'];
        $objTwitterConnection = createTwitterConnectionWithToken($oauth_token, $oauth_token_secret);

        $unmute_params = ['screen_name' => $screen_name];

        $response = $objTwitterConnection->post('mutes/users/destroy', $unmute_params);
        $summarized_response = summarizeToggleMuteResponce($response);

        return response()->json($summarized_response);
    }

    public function mute($screen_name) {
        //TwitterOAuthのインスタンスを生成する
        $oauth_token = $_GET['twitter_token'];
        $oauth_token_secret = $_GET['twitter_token_secret'];
        $objTwitterConnection = createTwitterConnectionWithToken($oauth_token, $oauth_token_secret);

        $mute_params = ['screen_name' => $screen_name];

        $response = $objTwitterConnection->post('mutes/users/create', $mute_params);
        $summarized_response = summarizeToggleMuteResponce($response);

        return response()->json($summarized_response);
    }
}
