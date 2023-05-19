import { useTheme } from "@emotion/react";
import { Box, Button, styled } from "@mui/material";
import Zoom from "@mui/material/Zoom";
import { isEmpty } from "lodash";
import { FC, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tokens } from "../contexts/theme";
import { GlobalState, SET_NOTIF } from "../state/reducer/globalState";
import CloseIcon from "@mui/icons-material/Close";

const OverlayNotifStyled = styled("div")(({ theme }) => ({
	zIndex: 11,
	position: "fixed",
	left: "0px",
	top: theme.spacing(8),
	width: "100%",
}));

const AppNotification: FC = () => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const notification = useSelector(
		(state: any) => (state.globalState as GlobalState).nextNotification
	);
	const [timer, setTimer] = useState<NodeJS.Timeout | undefined>();
	const dispatch = useDispatch();
	useEffect(() => {
		if (!isEmpty(notification.text)) {
			if (timer) {
				clearTimeout(timer);
			}
			setTimer(
				setTimeout(() => {
					dispatch({
						type: SET_NOTIF,
						payload: {
							text: "",
						},
					});
				}, notification.duration || 3000)
			);
		} else {
			setTimer(undefined);
		}
	}, [notification]);
	return (
		<Zoom in={true} style={{ zIndex: 1400 }}>
			<OverlayNotifStyled role="presentation">
				{notification.text && (
					<Box
						padding="10px"
						display="flex"
						sx={{ backgroundColor: colors.blueAccent[400] }}
					>
						<div className="f-90 ms-2">{notification.text}</div>
						<Button
							sx={{
								marginLeft: "auto",
								backgroundColor: colors.greenAccent[400],
							}}
							variant="contained"
							onClick={() => {
								dispatch({
									type: SET_NOTIF,
									payload: {
										text: "",
									},
								});
							}}
						>
							<CloseIcon />
						</Button>
					</Box>
				)}
			</OverlayNotifStyled>
		</Zoom>
	);
};

export default AppNotification;
