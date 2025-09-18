import { createContext, useContext } from "react";
import { useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../utils/toastMessageHelper";

const AuthContext = createContext();

const AppContextProvider = ({ children }) => {
    const [appLoading, setAppLoading] = useState(true);
    const [updatingCartState, setUpdatingCartState] = useState(false);
    const [user, setUser] = useState({ isLoggedIn: false });
    const [cart, setCart] = useState([]);
    const [placingOrder, setPlacingOrder] = useState(false);

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

    useEffect(() => {
        if (isLoggedIn) {
            getCartItems();
        } else {
            setCart([]);
        }
    }, [isLoggedIn]);

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
            setUpdatingCartState(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart/`, {
                method: "GET",
                credentials: "include",
            });
            const result = await response.json();
            setCart(result.data.cart);
        } catch (err) {
            showErrorToast(`Error during get cart items: ${err.message}`);
        } finally {
            setUpdatingCartState(false);
        }
    };

    const addToCart = async (productId) => {
        try {
            setUpdatingCartState(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart/${productId}/add`, {
                method: "POST",
                credentials: "include",
            });
            console.log("🟡 : response:", response);
            const result = await response.json();
            if (result.isSuccess) {
                setCart(result.data.cart);
            } else {
                showErrorToast(result.message);
            }
        } catch (err) {
            showErrorToast(`Error during adding product to cart: ${err.message}`);
        } finally {
            setUpdatingCartState(false);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            setUpdatingCartState(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart/${productId}/remove`, {
                method: "POST",
                credentials: "include",
            });
            console.log("🟡 : response:", response);
            const result = await response.json();
            if (result.isSuccess) {
                setCart(result.data.cart);
            } else {
                showErrorToast(result.message);
            }
        } catch (err) {
            showErrorToast(`Error during adding product to cart: ${err.message}`);
        } finally {
            setUpdatingCartState(false);
        }
    };

    const handleSetUser = (data) => {
        // add any logic here
        setUser(data);
    };

    const handlePlaceOrder = async ({ name, address, city, state, contactNumber1, contactNumber2 }) => {
        try {
            setPlacingOrder(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({ name, address, city, state, contactNumber1, contactNumber2 }),
                headers: {
                    "content-type": "application/json",
                },
            });
            console.log("🟡 : response:", response);
            const result = await response.json();
            if (result.isSuccess) {
                showSuccessToast(result.message);
                setCart([]);
                return {
                    paymentSessionId: result.data.paymentDetails.payment_session_id,
                    orderId: result.data.orderId,
                };
            } else {
                showErrorToast(result.message);
                return null;
            }
        } catch (err) {
            showErrorToast(`Error during adding product to cart: ${err.message}`);
            return null;
        } finally {
            setPlacingOrder(false);
        }
    };

    const sharedValues = {
        appLoading,
        isLoggedIn,
        user,
        handleSetUser,
        handleLogout,
        cart,
        addToCart,
        updatingCartState,
        removeFromCart,
        handlePlaceOrder,
        placingOrder,
    };

    return <AuthContext value={sharedValues}>{children}</AuthContext>;
};

const useAuthContext = () => {
    return useContext(AuthContext);
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthContext, useAuthContext, AppContextProvider };
