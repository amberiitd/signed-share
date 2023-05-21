import { AppDispatchAction } from ".";

interface AppNotification {
	type: "error" | "info" | "warning";
	text: string;
	duration: number;
}

export interface UserData {
	myuploads: any[];
	alluploads: any[];
	myuploadsloaded: boolean;
    alluploadsloaded: boolean;
}

export interface UserDataActionPayload {
	newupload?: string;
	myuploads?: any[];
    alluploads?: any[];
}

const initialState: UserData = {
	myuploads: [],
	alluploads: [],
	myuploadsloaded: false,
    alluploadsloaded: false,
};

export const ADD_TO_MYUPLOADS = "add_to_myuploads";
export const SET_MYUPLOADS = "set_myuploads";
export const SET_ALLUPLOADS = "set_alluploads";
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
				myuploadsloaded: true,
			};
		case SET_ALLUPLOADS:
			return {
				...state,
				alluploads: action.payload.alluploads || [],
				alluploadsloaded: true,
			};
		case UNSET_MYUPLOADS:
			return {
				...state,
				myuploads: [],
				myuploadsloaded: false,
			};
		default:
			return state;
	}
};

export default userDataReducer;
