import { combineReducers } from "redux";
import globalStateReducer, { GlobalStateActionPayload } from "./globalState";
import userDataReducer, { UserDataActionPayload } from "./userData";

export interface AppDispatchAction{
    type: string;
    payload: any;
}

const reducers = combineReducers({
    globalState: globalStateReducer,
    userData: userDataReducer
})

export default reducers;
