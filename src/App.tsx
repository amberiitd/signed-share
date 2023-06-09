import { ThemeProvider } from "@emotion/react";
import { Box, CssBaseline } from "@mui/material";
import { ProSidebarProvider } from "react-pro-sidebar";
import {
	BrowserRouter,
	Navigate,
	Route,
	Routes,
	useNavigate,
	useParams,
} from "react-router-dom";
import "./App.css";
import AppNavBar from "./components/AppNavBar/AppNavBar";
import AppSideBar from "./components/AppSideBar/AppSideBar";
import AuthProvider, { AuthContext } from "./contexts/auth";
import { ColorModeContext, useMode } from "./contexts/theme";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import NetworkProvider, { NetworkContext } from "./contexts/network";
import { useContext, useEffect, useState } from "react";
import PageContextProvider, { PageContext } from "./contexts/page";
import AppNotification from "./components/AppNotification";
import { Provider, useSelector } from "react-redux";
import { store } from "./state/store";
import { useDispatch } from "react-redux";
import { SET_LOADING, SET_NOTIF } from "./state/reducer/globalState";
import OverlayLoader from "./components/OverlayLoader";
import Upload from "./pages/upload";
import { ToastContainer, toast } from "react-toastify";
import { SET_MYUPLOADS, UNSET_MYUPLOADS, UserData } from "./state/reducer/userData";
import { transformUserData } from "./util/transformer";
import UploadDetail from "./pages/uploadDetail";
import GlobalUploads from "./pages/globalUploads";

function App() {
	const { theme, toggleColorMode } = useMode();
	return (
		<ColorModeContext.Provider value={{ toggleColorMode }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Provider store={store}>
					<ProSidebarProvider>
						<NetworkProvider>
							<AuthProvider>
								<PageContextProvider>
									<BrowserRouter>
										<Routes>
											<Route
												path="/login"
												element={<LoginPage />}
											/>
											<Route
												path="/:path1/*"
												element={
													<div className="app">
														<AppSideBar />
														<Main />
													</div>
												}
											/>
											<Route
												path="*"
												element={
													<Navigate to="/login" />
												}
											/>
										</Routes>
									</BrowserRouter>
									<OverlayLoader />
									<AppNotification />
								</PageContextProvider>
							</AuthProvider>
						</NetworkProvider>
					</ProSidebarProvider>
					<ToastContainer theme={theme.palette.mode} />
				</Provider>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

const Main = () => {
	const { account } = useContext(AuthContext);
	const { setContract, setWallet } =
		useContext(NetworkContext);
	const navigate = useNavigate();
	const { path1 } = useParams();
	const dispatch = useDispatch();
	const { setUserDataQuery } = useContext(PageContext);

	useEffect(() => {
		if (!account?.code) {
			setContract(undefined);
			setWallet(undefined);
			dispatch({
				type: UNSET_MYUPLOADS,
				payload: {},
			});
			navigate("/login");
			return;
		}
	}, [account]);

	const onUserDataCallFailure = (error: any) => {
		dispatch({
			type: SET_NOTIF,
			payload: {
				type: "error",
				text: error.message,
			},
		});
		setUserDataQuery({ loading: false });
	};

	return (
		<main className="content">
			<AppNavBar search profile />
			{
				<>
					{path1 === "app" ? (
						<HomePage />
					) : path1 === "share" ? (
						<Upload />
					) : path1 === "uploads" ? (
						<GlobalUploads />
					) : path1 === "more" ? (
						<HomePage />
					) : path1 === "upload-detail" ? (
						<UploadDetail />
					) : path1 === "notfound" ? (
						<div>Not found</div>
					) : (
						<Navigate to="/notfound" />
					)}
					{/* <PushChatSupport /> */}
				</>
			}
		</main>
	);
};

export default App;
