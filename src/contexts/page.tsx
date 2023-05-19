import { createContext, FC, useState } from "react";

export const PageContext = createContext<{
	searchText: string;
	setSearchText: React.Dispatch<React.SetStateAction<string>>;
    userDataQuery: {loading: boolean;};
    setUserDataQuery: React.Dispatch<React.SetStateAction<{loading: boolean;}>>;
}>({ searchText: "", setSearchText: () => {}, userDataQuery: {loading: false}, setUserDataQuery: () => {} });
const PageContextProvider: FC<{ children: any }> = ({ children }) => {
	const [searchText, setSearchText] = useState("");
    const [userDataQuery, setUserDataQuery] = useState<{loading: boolean;}>({loading: false});
	return (
		<PageContext.Provider
			value={{ searchText, setSearchText, userDataQuery, setUserDataQuery }}
		>
            {children}
        </PageContext.Provider>
	);
};

export default PageContextProvider;
