const express = require("express");
const next = require("next");
const http = require("http");
const session = require("express-session");
const port :any = parseInt(process.env.PORT as string, 10) || 80;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const login_controller = require('./controllers/loginController');
const muter_controller = require('./controllers/muterController');
const BffConst = require('./const');
const auth = require('./modules/twitterPassport');
const passport = auth.passport;
console.log(auth.passport);
export {};

nextApp.prepare().then(() => {
  const app = express();

  app.use(
    session({
      secret: "secret",
      resave: true,
      saveUninitialized: false,
      // trueが推奨だがhttps通信が必須になるのでproiductionのみとする
      cookie: { secure: process.env.NODE_ENV === 'production' }
    })
  )
  //認証のセッションを保存
  app.use(passport.initialize());
  app.use(passport.session());

  // console.log(passport);

  app.get("/login", passport.authenticate('twitter'));

  app.get("/callback", passport.authenticate('twitter',
    {
      successRedirect: '/muter',
      failureRedirect: '/failure',
    })
  );

  app.get("/muter", muter_controller.muter_top);
  app.get("/muted_list", muter_controller.muter_muted_users);

  app.get("*", (req :any, res:any) => {
    return handle(req, res);
  });


  const server = http.createServer(app);
  server.listen(port, (err :any) => {
    if (err) throw err;
    console.log(`>Server is running`);
  });
});
