import { combineReducers } from 'redux';

import TwAppsConst from '../TwAppsConst';

const userInfo = (state = {}, action) => {
  switch (action.type) {
  case TwAppsConst.ACTION_CHANGE_USER_INFO:
    return action.userInfo;
  default:
    return state;
  }
};

const mutedUsers = (state = [], action) => {
  switch (action.type) {
  case TwAppsConst.ACTION_CHANGE_MUTED_USERS:
    return action.mutedUsers;
  default:
    return state;
  }
};

export default combineReducers({
  userInfo,
  mutedUsers,
});