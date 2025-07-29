import { Link } from "react-router";
import { Navbar } from "../components/Navbar";

const NotFoundPage = () => {
    return (
        <div>
            <Navbar />
            <div className="flex flex-col gap-6 items-center justify-center p-10">
                <p className="text-center p-4 text-2xl">Oops... Page Not Found!!</p>
                <Link to="/" className="text-blue-600 underline">
                    Go to HomePage
                </Link>
            </div>
        </div>
    );
};

export { NotFoundPage };
