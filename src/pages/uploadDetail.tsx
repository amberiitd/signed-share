import { Box } from "@mui/material";
import { FC } from "react";
import Header from "../components/Header";

const UploadDetail: FC = () => {
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
		</Box>
	);
};

export default UploadDetail;
