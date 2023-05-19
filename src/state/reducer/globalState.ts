import { AppDispatchAction } from ".";

interface AppNotification{
    type: 'error' | 'info' | 'warning',
    text: string;
    duration: number;
}

export interface GlobalState{
    loading: boolean;
    loadingMsg: string;
    nextNotification: AppNotification;
    progressBar?: {progress: number; show: boolean;}
}

export interface GlobalStateActionPayload{
    loading?: boolean;
    loadingMsg?: string;
    nextNotificationText?: string;
}

const initialState: GlobalState = {
    loading: false,
    loadingMsg: '',
    nextNotification: {
        type: 'info',
        text: '',
        duration: 3000
    },
    progressBar: {
        progress: 0,
        show: false
    }
}

export const SET_LOADING = 'setLoading';
export const SET_NOTIF = 'setNotif';
export const SET_PROGRESS_BAR = 'setProgressBar';


const globalStateReducer: (state: GlobalState, action: AppDispatchAction) => GlobalState = (state= initialState, action: AppDispatchAction) => {
    switch(action.type){
        case SET_LOADING:
            return {...state, ...action.payload}
        case SET_NOTIF:
            return {...state, nextNotification: action.payload}
        case SET_PROGRESS_BAR:
            return {...state, progressBar: action.payload}
        default:
            return state
    }
}

export default globalStateReducer;