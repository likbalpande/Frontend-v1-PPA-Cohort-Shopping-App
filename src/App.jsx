import { BrowserRouter, Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { ViewPage } from "./pages/ViewPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { useState } from "react";

const App = () => {
    const [user, setUser] = useState({ isLoggedIn: false });

    const { isLoggedIn } = user;

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
