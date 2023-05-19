import { isEmpty } from "lodash";

export const transformUserData = (data: any) => {
	if (isEmpty(data)) return [];
	return data.map((tup: any[]) => ({
		cid: tup[0][0],
		lastModified: tup[0][1],
		name: tup[0][2],
		size: tup[0][3],
		type: tup[0][4],
	}));
};
