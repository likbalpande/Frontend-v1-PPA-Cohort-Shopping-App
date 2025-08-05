import { createContext, useContext } from "react";
import { useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../utils/toastMessageHelper";

const AuthContext = createContext();

const AppContextProvider = ({ children }) => {
    const [appLoading, setAppLoading] = useState(true);
    const [addingProductToCart, setAddingProductToCart] = useState(false);
    const [user, setUser] = useState({ isLoggedIn: false });
    const [cart, setCart] = useState([]);

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
        getCartItems();
    }, []);

    const handleLogout = async () => {
        try {
            setAppLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
                method: "GET",
                credentials: "include",
            });

            if (response.status == 200) {
                showSuccessToast("You are now logged out!");
                setUser({ isLoggedIn: false });
            } else {
                const data = await response.json();
                showErrorToast(data.message);
            }
        } catch (err) {
            showErrorToast(`Error during user validation: ${err.message}`);
        } finally {
            setAppLoading(false);
        }
    };

    const getCartItems = async () => {
        try {
            setAddingProductToCart(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart/`, {
                method: "GET",
                credentials: "include",
            });
            const result = await response.json();
            setCart(result.data.cart);
        } catch (err) {
            showErrorToast(`Error during get cart items: ${err.message}`);
        } finally {
            setAddingProductToCart(false);
        }
    };

    const addToCart = async (productId) => {
        try {
            setAddingProductToCart(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart/${productId}`, {
                method: "POST",
                credentials: "include",
            });
            console.log("🟡 : response:", response);
            await getCartItems();
        } catch (err) {
            showErrorToast(`Error during adding product to cart: ${err.message}`);
        } finally {
            setAddingProductToCart(false);
        }
    };

    // const removeFromCart = (...) => {
    //     setCart(...)
    // }

    const handleSetUser = (data) => {
        // add any logic here
        setUser(data);
    };

    const sharedValues = {
        appLoading,
        isLoggedIn,
        user,
        handleSetUser,
        handleLogout,
        cart,
        addToCart,
        addingProductToCart,
    };

    return <AuthContext value={sharedValues}>{children}</AuthContext>;
};

const useAuthContext = () => {
    return useContext(AuthContext);
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthContext, useAuthContext, AppContextProvider };
