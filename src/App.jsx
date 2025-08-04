import { BrowserRouter, Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { ViewPage } from "./pages/ViewPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { RingLoader } from "react-spinners";
import { AppContextProvider, useAuthContext } from "./context/AppContext";

const App = () => {
    const { appLoading, isLoggedIn } = useAuthContext();

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
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/view/:productId" element={<ViewPage />} />
                    <Route path="*" element={<NotFoundPage />} />
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
                {/* <Route path="/cart" element={<CartPage />} /> */}
                {/* <Route path="/profile" element={<ProfilePage />} /> */}
                {/* <Route path="/orders" element={<OrdersPage />} /> */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
