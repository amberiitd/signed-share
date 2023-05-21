import { isEmpty } from "lodash";

export const transformUserData: (data: any) => any[] = (data: any) => {
	if (isEmpty(data)) return [];
	return data.map((tup: any[]) => ({
		cid: tup[0],
		lastModified: tup[1],
        timestamp: tup[2],
		name: tup[3],
		size: tup[4],
		type: tup[5],
	}));
};

export const transformAllUploads: (data: any) => any[] = (data: any) => {
	if (isEmpty(data)) return [];
	return (data as Array<Array<any>>).flat().map((tup: any[]) => ({
		cid: tup[0],
		lastModified: tup[1],
        timestamp: tup[2],
		name: tup[3],
		size: tup[4],
		type: tup[5],
        user: tup[6]
	}));
};
