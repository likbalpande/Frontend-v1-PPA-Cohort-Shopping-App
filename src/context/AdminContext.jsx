import { createContext, useContext } from "react";

const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
    const sharedValues = {};

    return <AdminContext value={sharedValues}>{children}</AdminContext>;
};

const useAdminContext = () => {
    return useContext(AdminContext);
};

// eslint-disable-next-line react-refresh/only-export-components
export { AdminContext, useAdminContext, AdminContextProvider };
