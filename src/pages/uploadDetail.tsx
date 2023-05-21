import { Box, Card, Grid, Link } from "@mui/material";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { useSearchParams } from "react-router-dom";
import { NetworkContext } from "../contexts/network";
import { PageContext } from "../contexts/page";
import { toast } from "react-toastify";
import { useTheme } from "@emotion/react";
import { tokens } from "../contexts/theme";

const UploadDetail: FC = () => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const [searchParams, _] = useSearchParams();
	const cid = useMemo(() => searchParams.get("cid"), [searchParams]);
	const { contract } = useContext(NetworkContext);
	const { setUserDataQuery } = useContext(PageContext);
	const [detail, setDetail] = useState<any>();
	useEffect(() => {
		if (!cid) return;
		setUserDataQuery({ loading: true });
		contract?.methods
			.returnCIDMappedData(cid)
			.call()
			.then((data: any) => {
				console.log(data);
				setDetail({
					user: data[0],
					lastModified: data[1],
					timestamp: data[2],
					name: data[3],
					size: data[4],
					type: data[5],
				});
				setUserDataQuery({ loading: false });
			})
			.catch((error: any) => {
				console.log(error);
				toast.error(error.message);
				setUserDataQuery({ loading: false });
			});
	}, [cid, contract]);
	return (
		<Box m="20px">
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
			>
				<Header
					title="UPLOAD DETAILS"
					subtitle="You can view the upload details here and verify the signature of the uploader."
				/>
			</Box>
			<Card
				sx={{
					padding: 3,
					backgroundColor: colors.primary[400],
					height: "75vh",
				}}
			>
				{detail ? (
					<>
						<Grid container>
							<Grid item xs={4}>
								CID:
							</Grid>
							<Grid item xs={8}>
								<Link
									href={`https://gateway.lighthouse.storage/ipfs/${cid}`}
									color="inherit"
									target="_blank"
								>
									{cid}
								</Link>
							</Grid>
							<Grid item xs={4}>
								User:
							</Grid>
							<Grid item xs={8}>
								{/* https://etherscan.io/address/0xc2c6492ae981d06f4c8710e97b1c9440dafbc4a1 */}

								<Link
									href={`https://filfox.info/en/address/${detail.user}`}
									color="inherit"
									target="_blank"
								>
									{detail.user}
								</Link>
							</Grid>
							<Grid item xs={4}>
								File Name:
							</Grid>
							<Grid item xs={8}>
								{detail.name}
							</Grid>
						</Grid>
						<Box paddingTop={2} height={"calc(100% - 5rem)"}>
							<iframe
								src={`https://gateway.lighthouse.storage/ipfs/${cid}`}
								title="description"
								width={"100%"}
								height={"100%"}
							></iframe>
						</Box>
					</>
				) : (
					<Box padding={2}>No upload exist with this cid: {cid}</Box>
				)}
			</Card>
		</Box>
	);
};

export default UploadDetail;
