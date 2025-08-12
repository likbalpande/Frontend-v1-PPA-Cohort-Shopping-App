import { createContext, useContext, useEffect, useState } from "react";
import { showErrorToast } from "../../utils/toastMessageHelper";

const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
    const [adminInfoLoading, setAdminInfoLoading] = useState(true);
    const [adminUser, setAdminUser] = useState({ isLoggedIn: false });
    const sharedValues = {
        adminInfoLoading,
        adminUser,
    };

    const getLoggedInAdmin = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admins/me`, {
                method: "GET",
                credentials: "include",
            });

            if (response.status == 200) {
                setAdminUser({
                    isLoggedIn: true,
                });
            } else {
                showErrorToast("Permission denied! You are not an Admin!");
            }
        } catch (err) {
            showErrorToast(`Error during user validation: ${err.message}`);
        } finally {
            setAdminInfoLoading(false);
        }
    };

    useEffect(() => {
        getLoggedInAdmin();
    }, []);

    return <AdminContext value={sharedValues}>{children}</AdminContext>;
};

const useAdminContext = () => {
    return useContext(AdminContext);
};

// eslint-disable-next-line react-refresh/only-export-components
export { AdminContext, useAdminContext, AdminContextProvider };
