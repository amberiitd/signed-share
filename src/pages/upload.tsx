import { useTheme } from "@emotion/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FC, useContext, useMemo, useRef, useState } from "react";
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

const Upload: FC = () => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const { contract } = useContext(NetworkContext);
	const { account } = useContext(AuthContext);
	const [upload, setUpload] = useState({ progress: 0, loading: false });
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [postUpload, setPostUpload] = useState({ modal: false, hash: "" });
	const progressCallback = (progressData: any) => {
		let percentageDone = 100 - progressData?.total / progressData?.uploaded;
		setUpload((data) => ({ ...data, progress: percentageDone }));
	};
	const uploadFile = async (e: any) => {
		// Push file to lighthouse node
		// Both file and folder are supported by upload function
		setUpload((data) => ({ ...data, loading: true }));
		const output = await lighthouse.upload(
			e,
			"79f5b100.59738c1d4dc94bf587a64a232cbb9c55",
			progressCallback
		);

		await contract?.methods
			.registerCID("Nazish")
			.send({
				from: account?.code,
			})
			.catch((error: any) => {
				console.log(error);
			});

		setUpload((data) => ({ ...data, loading: false }));

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

	return (
		<Box m="20px">
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
			>
				<Header
					title="SHARE"
					subtitle="Upload your files here. Your files are secured."
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
					}}
					onClick={() => {
						fileInputRef.current?.click();
					}}
					disabled={upload.loading}
				>
					{upload.loading ? (
						"Uploading..."
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
					onChange={(e: any) => {
						if (!isEmpty(e.target.files)) uploadFile(e);
					}}
					sx={{ display: "none" }}
				/>
			</Box>
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
								href={`https://gateway.lighthouse.storage/ipfs/${postUpload.hash}`}
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
