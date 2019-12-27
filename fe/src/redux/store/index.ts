import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import reducer, { RootState } from '../reducers';

export const initialState :RootState = {
  appName: "",
  basePath: "",
  isMuterMenuOpened: true,
  userInfo :{},
  mutedUsers :[],
  muted :"",
  muteRequestStatus :"initial",
  userRequestStatus :"initial",
  errMessage :"",
  popUpMessage :"",
}

export function initializeStore() {
  return createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunk)),
  )
};
