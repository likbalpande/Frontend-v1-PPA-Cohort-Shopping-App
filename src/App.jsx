import { BrowserRouter, Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { ViewPage } from "./pages/ViewPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { RingLoader } from "react-spinners";
import { useAuthContext } from "./context/AppContext";
import { BasicLayout } from "./pages/BasicLayout";
import { AdminLayout } from "./pages/Admin/AdminLayout";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { AdminOrdersPage } from "./pages/Admin/AdminOrdersPage";
import { AdminFeedbacksPage } from "./pages/Admin/AdminFeedbacksPage";
import { AdminProductsPage } from "./pages/Admin/AdminProductsPage";
import { AdminContextProvider } from "./context/AdminContext";

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
                    <Route element={<BasicLayout />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/view/:productId" element={<ViewPage />} />
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<BasicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/view/:productId" element={<ViewPage />} />
                    {/* <Route path="/cart" element={<CartPage />} /> */}
                    {/* <Route path="/profile" element={<ProfilePage />} /> */}
                    {/* <Route path="/orders" element={<OrdersPage />} /> */}
                </Route>
                <AdminContextProvider>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/orders" element={<AdminOrdersPage />} />
                        <Route path="/admin/products" element={<AdminProductsPage />} />
                        <Route path="/admin/feedbacks" element={<AdminFeedbacksPage />} />
                    </Route>
                </AdminContextProvider>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
