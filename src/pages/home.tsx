import { useTheme } from "@emotion/react";
import Box from "@mui/material/Box";
import { FC, useMemo, useState } from "react";
import Header from "../components/Header";
import { tokens } from "../contexts/theme";

const HomePage: FC = () => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);

	return (
		<Box m="20px">
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
			>
				<Header
					title="DASHBOARD"
					subtitle="Welcome to your dashboard"
				/>
			</Box>
		</Box>
	);
};

export default HomePage;
