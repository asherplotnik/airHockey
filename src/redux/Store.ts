import { combineReducers, createStore } from "redux";
import { SessionReducer } from "./SessionState";

const reducers = combineReducers({ SessionState: SessionReducer });
const store = createStore(reducers);

export default store;
