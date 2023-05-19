import { createContext, FC, useContext, useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { useDispatch } from "react-redux";
import { SET_NOTIF } from "../state/reducer/globalState";
import { NetworkContext, WalletProvider } from "./network";
import { Contract, Wallet } from "fuels";
import { networks } from "../constants/network";
import { fuel_abi } from "../constants/abi";

export type Account = { code: string; source: "storage" | "eth" };
export const AuthContext = createContext<{
	prvtKey?: string;
	setPrvtKey: React.Dispatch<React.SetStateAction<string | undefined>>;
	account?: Account;
	setAccount: React.Dispatch<React.SetStateAction<Account | undefined>>;
	ethLogin: (provider?: "metamask" | "fuel") => Promise<void>;
}>({
	setPrvtKey: () => {},
	setAccount: () => {},
	ethLogin: async () => {},
});

const AuthProvider: FC<{ children: any }> = ({ children }) => {
	const { setWallet, wallet, setContract, fuel, selectedNetworkId } =
		useContext(NetworkContext);
	const [prvtKey, setPrvtKey] = useState<string | undefined>();
	const storageAccount = localStorage.getItem("l-earn-account");
	const [account, setAccount] = useState<Account | undefined>(
		storageAccount ? { code: storageAccount, source: "storage" } : undefined
	);
	const dispatch = useDispatch();

	const ethLogin = async (provider: WalletProvider = "metamask") => {
		try {
			(provider === "metamask"
				? window.ethereum.request({
						method: "eth_requestAccounts",
				  })
				: provider === "fuel"
				? window.fuel
						.connect()
						.then(() =>
							window.fuel
								.currentAccount()
								.then((acc: string) => [acc])
						)
				: new Promise<string[]>((resolve, reject) => {})
			)
				.then(async (accounts: string[]) => {
					console.log(accounts);
					if (accounts.length === 0) {
						console.log("no accounts found");
						return null;
					}
					setAccount({ code: accounts[0], source: "eth" });
					setWallet({
						provider,
						api:
							provider === "metamask"
								? window.ethereum
								: window.fuel,
					});
				})
				.catch((err: any) => {
					dispatch({
						type: SET_NOTIF,
						payload: {
							type: "error",
							text: err.message,
						},
					});
					setAccount(undefined);
				});
		} catch (err) {
			throw Error("LoginError: Etherium is not connected");
		}
	};

	useEffect(() => {
		if (account && account.code && account.source !== "storage") {
			localStorage.setItem("l-earn-account", account.code);
		} else if (isEmpty(account?.code)) {
			localStorage.removeItem("l-earn-account");
		}

		if (account?.source !== "storage" && wallet?.provider) {
			localStorage.setItem("l-earn-wallet-provider", wallet.provider);
		} else if (!wallet?.provider) {
			localStorage.removeItem("l-earn-wallet-provider");
		}

		if (account?.code && account.source === "storage" && fuel) {
			try {
				(wallet?.provider === "metamask"
					? window.ethereum.request({
							method: "eth_requestAccounts",
					  })
					: wallet?.provider === "fuel"
					? fuel
							.connect()
							.then(() =>
								window.fuel
									.currentAccount()
									.then((acc: string) => [acc])
							)
					: new Promise<string[]>((resolve, reject) => {})
				)
					.then(async (accounts: string[]) => {
						console.log(accounts);
						if (
							!isEmpty(accounts) &&
							accounts[0] === account.code
						) {
							setAccount({ code: accounts[0], source: "eth" });
						} else {
							console.log("account changed or do not exist");
							setAccount(undefined);
						}
					})
					.catch((err: any) => {
						dispatch({
							type: SET_NOTIF,
							payload: {
								type: "error",
								text: err.message,
							},
						});
						setAccount(undefined);
					});
			} catch (err) {
				throw err;
			}
		}
	}, [account, wallet, fuel]);
	useEffect(() => {
		if (
			account?.code &&
			wallet?.provider === "fuel" &&
			fuel &&
			selectedNetworkId === "fuel0"
		) {
			fuel.getWallet(account.code).then((fuelWallet: any) => {
				console.log("fuel wallet", fuelWallet);
				const id = networks[selectedNetworkId].contractAddress || "";
				const contract = new Contract(id, fuel_abi, fuelWallet);
				console.log("fuel contract", contract);
				setContract(contract);
			});
		}
	}, [account, wallet, fuel, selectedNetworkId]);

	useEffect(() => {
		const handleAccountChange = (accounts: Array<string>) => {
			if (isEmpty(accounts) || accounts[0] !== account?.code) {
				setAccount(undefined);
			}
		};

		window.ethereum.on("accountsChanged", handleAccountChange);
		return () => {
			window.ethereum.removeListener(
				"accountsChanged",
				handleAccountChange
			);
		};
	}, []);

	return (
		<AuthContext.Provider
			value={{
				prvtKey,
				setPrvtKey,
				account,
				setAccount,
				ethLogin,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
