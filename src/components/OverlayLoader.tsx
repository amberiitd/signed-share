// ** MUI Imports
import Zoom from "@mui/material/Zoom";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { FC, useEffect, useMemo, useState } from "react";
import { Fab } from "@mui/material";
import { SET_LOADING } from "../state/reducer/globalState";
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from "@emotion/react";
import { tokens } from "../contexts/theme";

const OverlayLoaderStyled = styled("div")(({ theme }) => ({
	zIndex: 11,
	position: "fixed",
	left: "50%",
	top: theme.spacing(9),
}));

const OverlayLoader: FC = () => {
    const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const globalState = useSelector((state: any) => state.globalState);
	const dispatch = useDispatch();
	const [timer, setTimer] = useState<NodeJS.Timeout>();
	//   useEffect(() => {
	//     if (globalState.loading) {
	//       if (timer) {
	//         clearTimeout(timer)
	//       }
	//       setTimer(
	//         setTimeout(() => {
	//           dispatch({
	//             type: SET_LOADING,
	//             payload: {
	//               loading: false
	//             }
	//           })
	//         }, 5000)
	//       )
	//     }
	//   }, [globalState])

	// ** Props
	return (
		<Zoom in={globalState.loading}>
			<OverlayLoaderStyled role="presentation" >
				<Fab size="small" aria-label="overlay refresh">
					<CircularProgress sx={{padding: 1}}/>
				</Fab>
			</OverlayLoaderStyled>
		</Zoom>
	);
};

export default OverlayLoader;
