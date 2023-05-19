import { AppDispatchAction } from ".";

interface AppNotification {
	type: "error" | "info" | "warning";
	text: string;
	duration: number;
}

export interface UserData {
	myuploads: any[];
    loaded: boolean;
}

export interface UserDataActionPayload {
	newupload?: string;
    myuploads?: any[];
}

const initialState: UserData = {
	myuploads: [],
    loaded: false
};

export const ADD_TO_MYUPLOADS = "add_to_myuploads";
export const SET_MYUPLOADS = "set_myuploads";
export const UNSET_MYUPLOADS = "unset_myuploads";

const userDataReducer: (
	state: UserData,
	action: { type: string; payload: UserDataActionPayload }
) => UserData = (
	state = initialState,
	action: { type: string; payload: UserDataActionPayload }
) => {
	switch (action.type) {
		case ADD_TO_MYUPLOADS:
			return {
				...state,
				myuploads: [action.payload.newupload, ...state.myuploads],
			};
        case SET_MYUPLOADS: 
            return {
                ...state,
                myuploads: action.payload.myuploads || [],
                loaded: true
            }
        case UNSET_MYUPLOADS:
            return {
                ...state,
                myuploads:  [],
                loading: false
            }
		default:
			return state;
	}
};

export default userDataReducer;
