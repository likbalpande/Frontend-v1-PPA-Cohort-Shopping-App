import { Link } from "react-router";
import { Navbar } from "../components/Navbar";

const LoginPage = () => {
    return (
        <div>
            <Navbar searchBox={false} />
            <div className="flex flex-col gap-6 items-center justify-center p-10">
                <p className="text-center p-4 text-2xl">LoginPage</p>
                <Link to="/signup" className="text-blue-600 underline">
                    Signup
                </Link>
            </div>
        </div>
    );
};

export { LoginPage };
