import { BrowserRouter, Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { ViewPage } from "./pages/ViewPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { useEffect, useState } from "react";
import { showErrorToast } from "../utils/toastMessageHelper";
import { RingLoader } from "react-spinners";

const App = () => {
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

    if (appLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <RingLoader size={50} />
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage setUser={setUser} />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="*" element={<NotFoundPage user={user} />} />
                </Routes>
            </BrowserRouter>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/view/:productId" element={<ViewPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
