import { Link, Outlet, useLocation } from "react-router";

const ROUTES_CONFIG = [
    {
        title: "Dashboard",
        route: "/admin/dashboard",
    },
    {
        title: "Orders",
        route: "/admin/orders",
    },
    {
        title: "Products",
        route: "/admin/products",
    },
    {
        title: "Feedbacks",
        route: "/admin/feedbacks",
    },
];

const AdminLayout = () => {
    const { pathname } = useLocation();

    return (
        <div className="grid grid-cols-[234px_1fr]">
            <div className="flex flex-col gap-5 p-8 bg-amber-200 min-h-screen">
                {ROUTES_CONFIG.map((elem) => {
                    const isCurrentRoute = pathname === elem.route;
                    console.log("🟡 : elem.route:", elem.route);
                    console.log("🟡 : pathname:", pathname);
                    return (
                        <Link
                            className={`
                                text-xl font-bold transition py-1 rounded-md w-fit
                                ${
                                    isCurrentRoute
                                        ? "bg-blue-600 text-white/90 px-3"
                                        : "text-blue-600 hover:text-blue-700 hover:scale-102 cursor-pointer hover:underline"
                                }
                            `}
                            to={elem.route}
                        >
                            {elem.title}
                        </Link>
                    );
                })}
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    );
};

export { AdminLayout };
