import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { useAuthContext } from "../context/AppContext";
import { CartSideBar } from "../components/CartSideBar";

const BasicLayout = () => {
    const { cart } = useAuthContext();
    console.log("re-rendered -- BasicLayout");
    const isCartEmpty = cart.length === 0;
    return (
        <div className={`grid ${isCartEmpty ? "grid-cols-1" : "grid-cols-[1fr_175px]"} min-h-screen`}>
            <div className="h-screen overflow-scroll">
                <Navbar />
                <Outlet />
            </div>
            {!isCartEmpty && (
                <div className="h-screen overflow-scroll">
                    <CartSideBar />
                </div>
            )}
        </div>
    );
};

export { BasicLayout };
