import { AppDispatchAction } from ".";

interface AppNotification {
	type: "error" | "info" | "warning";
	text: string;
	duration: number;
}

export interface UserData {
	courses: string[];
	progressStatus: { [key: string]: any };
}

export interface UserDataActionPayload {
	courseId?: string;
	moduleId?: string;
	lectureId?: string;
	status?: "not_yet_started" | "in_progress" | "completed";
	completedDuration?: { minute: number; second: number };
	courses?: string[];
	progressStatus?: any;
    score?: {points: number, total: number}
}

const initialState: UserData = {
	courses: [],
	progressStatus: {},
};

export const UPDATE_LECTURE_STATUS = "update_lecture_status";
export const SET_USER_DATA = "set_use_data";
export const ADD_COURSE = "add_course";
export const COMPLETE_MODULE = "complete_module";
export const UPDATE_QUIZ_SCORE = "update_quiz_score";

const userDataReducer: (
	state: UserData,
	action: { type: string; payload: UserDataActionPayload }
) => UserData = (
	state = initialState,
	action: { type: string; payload: UserDataActionPayload }
) => {
	switch (action.type) {
		case UPDATE_LECTURE_STATUS:
			if (
				action.payload.courseId !== undefined &&
				action.payload.moduleId !== undefined &&
				action.payload.lectureId !== undefined
			) {
				let courseProgress =
					state.progressStatus[action.payload.courseId] || {};
				let module = courseProgress[action.payload.moduleId] || {};
				let lecture = courseProgress[action.payload.lectureId] || {};
				lecture = {
					...lecture,
					status: action.payload.status,
					completedDuration: action.payload.completedDuration,
				};
				module[action.payload.lectureId] = lecture;
				courseProgress[action.payload.moduleId] = module;
				state.progressStatus[action.payload.courseId] = courseProgress;
				return { ...state };
			}
			return state;
		case SET_USER_DATA:
			return {
				...state,
				courses: action.payload.courses || state.courses,
				progressStatus:
					{...state.progressStatus, ...(action.payload.progressStatus || state.progressStatus)},
			};
		case ADD_COURSE:
			return {
				...state,
				courses: [...state.courses, ...(action.payload.courses || [])],
			};
		case COMPLETE_MODULE:
            if (
				action.payload.courseId !== undefined &&
				action.payload.moduleId !== undefined
			) {
				let courseProgress =
					state.progressStatus[action.payload.courseId] || {};
				let module = courseProgress[action.payload.moduleId] || {};
                module.completed = true;
				courseProgress[action.payload.moduleId] = module;
				state.progressStatus[action.payload.courseId] = courseProgress;
				return { ...state };
			}
			return {
				...state,
				courses: state.courses.concat(action.payload.courses || []),
			};
        case UPDATE_QUIZ_SCORE:
            if (
                action.payload.courseId !== undefined &&
                action.payload.moduleId !== undefined
            ) {
                let courseProgress =
                    state.progressStatus[action.payload.courseId] || {};
                let module = courseProgress[action.payload.moduleId] || {};
                module.score = action.payload.score;
                courseProgress[action.payload.moduleId] = module;
                state.progressStatus[action.payload.courseId] = courseProgress;
                return { ...state };
            }
            return {
                ...state,
                courses: state.courses.concat(action.payload.courses || []),
            };
		default:
			return state;
	}
};

export default userDataReducer;
