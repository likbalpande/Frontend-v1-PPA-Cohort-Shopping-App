import { createContext, useContext } from "react";
import { useEffect, useState } from "react";
import { showErrorToast } from "../../utils/toastMessageHelper";

const AuthContext = createContext();

const AppContextProvider = ({ children }) => {
    const [appLoading, setAppLoading] = useState(true);
    const [user, setUser] = useState({ isLoggedIn: false });

    const { isLoggedIn } = user;

    const getLoggedInUser = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
                method: "GET",
                credentials: "include",
            });

            if (response.status == 200) {
                const result = await response.json();
                setUser({
                    isLoggedIn: true,
                    ...result.data.user,
                });
            } else {
                showErrorToast("Please login!");
            }
        } catch (err) {
            showErrorToast(`Error during user validation: ${err.message}`);
        } finally {
            setAppLoading(false);
        }
    };

    useEffect(() => {
        getLoggedInUser();
    }, []);

    const handleSetUser = (data) => {
        // add any logic here
        setUser(data);
    };

    const sharedValues = {
        appLoading,
        isLoggedIn,
        user,
        handleSetUser,
    };

    return <AuthContext value={sharedValues}>{children}</AuthContext>;
};

const useAuthContext = () => {
    return useContext(AuthContext);
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthContext, useAuthContext, AppContextProvider };
