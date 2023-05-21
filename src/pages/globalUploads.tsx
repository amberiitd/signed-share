import { useTheme } from "@emotion/react";
import Box from "@mui/material/Box";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { tokens } from "../contexts/theme";
import { UploadTable } from "./upload";
import { NetworkContext } from "../contexts/network";
import { useSelector } from "react-redux";
import { SET_ALLUPLOADS, UserData } from "../state/reducer/userData";
import { useDispatch } from "react-redux";
import { transformAllUploads } from "../util/transformer";
import { PageContext } from "../contexts/page";
import { toast } from "react-toastify";

const GlobalUploads: FC = () => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const { contract } = useContext(NetworkContext);
	const { alluploads, loaded } = useSelector((state: any) => {
		const userData = state.userData as UserData;
		return {
			alluploads: userData.alluploads,
			loaded: userData.alluploadsloaded,
		};
	});
	const { setUserDataQuery } = useContext(PageContext);
	const dispatch = useDispatch();

	useEffect(() => {
		if (loaded) return;
		setUserDataQuery({ loading: true });
		contract?.methods
			.returnData()
			.call()
			.then((data: any) => {
				console.log(data);
				dispatch({
					type: SET_ALLUPLOADS,
					payload: {
						alluploads: transformAllUploads(data).sort(
							(a: any, b: any) => {
								return b.timestamp - a.timestamp;
							}
						),
					},
				});
				setUserDataQuery({ loading: false });
			})
			.catch((error: any) => {
				console.log(error);
				toast.error(error.message);
				setUserDataQuery({ loading: false });
			});
	}, [contract]);
	return (
		<Box m="20px">
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
			>
				<Header
					title="ALL UPLOADS"
					subtitle="Here you can view all uploads by people all around the globe."
				/>
			</Box>
			<UploadTable dataList={alluploads} showOwner/>
		</Box>
	);
};

export default GlobalUploads;
