import { createContext, FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SET_LOADING } from "../state/reducer/globalState";
import { useDebounce } from "use-debounce";

export const PageContext = createContext<{
    navigationOff: boolean;
    setNavigationOff: React.Dispatch<React.SetStateAction<boolean>>;
	searchText: string;
	setSearchText: React.Dispatch<React.SetStateAction<string>>;
    debouncedSearchText: string;
    userDataQuery: {loading: boolean;};
    setUserDataQuery: React.Dispatch<React.SetStateAction<{loading: boolean;}>>;
}>({ navigationOff: false, setNavigationOff: () => {}, searchText: "", setSearchText: () => {}, userDataQuery: {loading: false}, setUserDataQuery: () => {}, debouncedSearchText: '' });
const PageContextProvider: FC<{ children: any }> = ({ children }) => {
	const [searchText, setSearchText] = useState("");
    const [userDataQuery, setUserDataQuery] = useState<{loading: boolean;}>({loading: false});
    const [navigationOff, setNavigationOff] = useState<boolean>(false);
	const dispatch = useDispatch();
    const [debouncedSearchText, _] = useDebounce(searchText, 500);

    useEffect(() => {
		if (userDataQuery.loading) {
			dispatch({
				type: SET_LOADING,
				payload: {
					loading: true,
				},
			});
		} else {
			dispatch({
				type: SET_LOADING,
				payload: {
					loading: false,
				},
			});
		}
	}, [userDataQuery]);

	return (
		<PageContext.Provider
			value={{ searchText, setSearchText, userDataQuery, setUserDataQuery, navigationOff, setNavigationOff, debouncedSearchText }}
		>
            {children}
        </PageContext.Provider>
	);
};

export default PageContextProvider;
