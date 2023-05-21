import { useTheme } from "@emotion/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import { tokens } from "../contexts/theme";
import Input from "@mui/material/Input";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import lighthouse from "@lighthouse-web3/sdk";
import { isEmpty } from "lodash";
import { Modal, Typography } from "@mui/material";
import ModalHeader, { style } from "../components/ModalHeader";
import Link from "@mui/material/Link";
import { NetworkContext } from "../contexts/network";
import { AuthContext } from "../contexts/auth";
import { toast } from "react-toastify";
import moment from "moment";
import { PageContext } from "../contexts/page";
import { useSelector } from "react-redux";
import {
	ADD_TO_MYUPLOADS,
	SET_MYUPLOADS,
	UserData,
} from "../state/reducer/userData";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import TextCopy from "../components/TextCopy";
import { transformUserData } from "../util/transformer";

const Upload: FC = () => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const { contract } = useContext(NetworkContext);
	const { account } = useContext(AuthContext);
	const [upload, setUpload] = useState({ progress: 0, status: "upload" });
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [postUpload, setPostUpload] = useState({ modal: false, hash: "" });
	const progressCallback = (progressData: any) => {
		let percentageDone = 100 - progressData?.total / progressData?.uploaded;
		setUpload((data) => ({ ...data, progress: percentageDone }));
	};
	const { setNavigationOff, setUserDataQuery } = useContext(PageContext);
	const myuploads = useSelector(
		(state: any) => (state.userData as UserData).myuploads
	);
	const initLoaded = useSelector(
		(state: any) => (state.userData as UserData).myuploadsloaded
	);
	const dispatch = useDispatch();

	const uploadFile = async (e: any) => {
		// Push file to lighthouse node
		// Both file and folder are supported by upload function
		setUpload((data) => ({ ...data, status: "uploading" }));
		setNavigationOff(true);
		const output = await lighthouse.upload(
			e,
			"79f5b100.59738c1d4dc94bf587a64a232cbb9c55",
			progressCallback
		);
		setUpload((data) => ({ ...data, status: "signing" }));

		let lastModified;
		try {
			lastModified = Math.ceil(e.target.files[0].lastModified / 1000);
		} catch (error) {
			lastModified = moment().unix();
		} finally {
			if (Number.isNaN(lastModified)) {
				lastModified = moment().unix();
			}
		}

		await contract?.methods
			.registerCID(
				output.data.Hash,
				lastModified,
				e.target.files[0].name,
				e.target.files[0].size || 0,
				e.target.files[0].type || ""
			)
			.send({
				from: account?.code,
			})
			.catch((error: any) => {
				console.log(error);
			});

		setNavigationOff(false);
		dispatch({
			type: ADD_TO_MYUPLOADS,
			payload: {
				newupload: {
					cid: output.data.Hash,
					lastModified,
					timestamp: moment().unix(),
					name: e.target.files[0].name,
					size: e.target.files[0].size || 0,
					type: e.target.files[0].type || "",
				},
			},
		});
		setUpload((data) => ({ ...data, status: "upload" }));

		// console.log("File Status:", output);
		/*
          output:
            data: {
              Name: "filename.txt",
              Size: 88000,
              Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w"
            }
          Note: Hash in response is CID.
        */

		// console.log(
		// 	"Visit at https://gateway.lighthouse.storage/ipfs/" +
		// 		output.data.Hash
		// );
		setPostUpload({ modal: true, hash: output.data.Hash });
	};

	useEffect(() => {
		if (initLoaded) return;
		setUserDataQuery({ loading: true });
		contract?.methods
			.returnIndividualUploaderData()
			.call({
				from: account?.code,
			})
			.then((data: any) => {
				console.log(data);
				dispatch({
					type: SET_MYUPLOADS,
					payload: {
						myuploads: transformUserData(data).sort(
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
					title="SHARE"
					subtitle="Upload and view your files here. Your files are secured."
				/>
			</Box>
			<Box>
				<Button
					variant="contained"
					sx={{
						"&:hover": {
							backgroundColor: colors.blueAccent[800],
						},
						display: "flex",
						alignItems: "center",
						margin: "40px 0 0 0",
						padding: "10px 20px 10px 20px",
						borderRadius: "10px",
						backgroundColor: colors.primary[400],
						color: colors.primary[100],
						fontWeight: 600,
					}}
					onClick={() => {
						fileInputRef.current?.click();
					}}
					disabled={upload.status !== "upload"}
				>
					{upload.status === "uploading" ? (
						"Uploading..."
					) : upload.status === "signing" ? (
						"Signing..."
					) : (
						<>
							<AddOutlinedIcon sx={{ marginRight: 2 }} />
							Upload
						</>
					)}
				</Button>
				{/* <Button
					variant="contained"
					onClick={async () => {
						await contract?.methods
							.registerCID("Nazish")
							.send({
								from: account?.code,
							})
							.catch((error: any) => {
								console.log(error);
							});
					}}
				>
					{" "}
					Call Contract{" "}
				</Button> */}
				<Input
					inputRef={fileInputRef}
					type="file"
					onChange={async (e: any) => {
						if (!isEmpty(e.target.files)) {
							if (e.target.files.length > 1) {
								toast.error(
									"Multiple file selection not allowed"
								);
								return;
							}
							await uploadFile(e);
							// toast.info(
							//     "File selected "+ e.target.files[0].name
							// );
							e.target.value = null;
						}
					}}
					sx={{ display: "none" }}
				/>
			</Box>
			<UploadTable dataList={myuploads} />
			<Modal
				open={postUpload.modal}
				aria-labelledby="parent-modal-title"
				aria-describedby="parent-modal-description"
			>
				<Box sx={{ ...style, backgroundColor: colors.blueAccent[800] }}>
					<ModalHeader
						title="Upload Successful &#x1F601;"
						subtitle=""
						onCancel={() =>
							setPostUpload((data) => ({ ...data, modal: false }))
						}
					/>
					<Box sx={{ px: 4, py: 3 }}>
						<Typography>
							<Link
								href={`${window.location.origin}/upload-detail?cid=${postUpload.hash}`}
								color="inherit"
								target="_blank"
							>
								Click here
							</Link>{" "}
							to view your upload.
						</Typography>
					</Box>
				</Box>
			</Modal>
		</Box>
	);
};

export default Upload;

const RowRender: FC<{ row: any }> = ({ row }) => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const [hovered, setHovered] = useState(false);
	return (
		<TableRow
			sx={{
				"&:last-child td, &:last-child th": {
					border: 0,
				},
				"&:hover": {
					backgroundColor: colors.primary[900],
				},
			}}
			onMouseEnter={() => {
				setHovered(true);
			}}
			onMouseLeave={() => {
				setHovered(false);
			}}
		>
			<TableCell component="th" scope="row" sx={{ height: "4em" }}>
				<Link
					href={`${window.location.origin}/upload-detail?cid=${row.cid}`}
					sx={{
						color: colors.primary[100],
						marginRight: 2,
					}}
					target="_blank"
				>
					{row.cid}
				</Link>
				{
					<TextCopy
						text={`${window.location.origin}/upload-detail?cid=${row.cid}`}
						hidden={!hovered}
					/>
				}
			</TableCell>
			<TableCell align="right">{row.name}</TableCell>
			<TableCell align="right">
				{moment.unix(row.timestamp).format("DD MMM YYYY HH:mm:SS")}
			</TableCell>
			<TableCell align="right">{row.size} kb</TableCell>
			<TableCell align="right">{row.type}</TableCell>
		</TableRow>
	);
};

export const UploadTable: FC<{ dataList: any[] }> = ({ dataList }) => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const { debouncedSearchText } = useContext(PageContext);

	const filteredUpload = useMemo(() => {
		const lower = debouncedSearchText.toLowerCase();
		return dataList.filter(
			(up) =>
				up.cid.toLowerCase().startsWith(lower) ||
				up.name.toLowerCase().startsWith(lower)
		);
	}, [dataList, debouncedSearchText]);

	return (
		<TableContainer
			component={Paper}
			sx={{ marginTop: 3, backgroundColor: colors.primary[400] }}
		>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell sx={{ fontWeight: 600 }}>CID</TableCell>
						<TableCell align="right" sx={{ fontWeight: 600 }}>
							Name
						</TableCell>
						<TableCell align="right" sx={{ fontWeight: 600 }}>
							Upoaded At
						</TableCell>
						<TableCell align="right" sx={{ fontWeight: 600 }}>
							Size
						</TableCell>
						<TableCell align="right" sx={{ fontWeight: 600 }}>
							Type
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{filteredUpload.map((row, index) => (
						<RowRender key={row.name + index} row={row} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
