import { Link } from "react-router";
import { Navbar } from "../components/Navbar";

const NotFoundPage = ({ user }) => {
    const { isLoggedIn } = user;
    return (
        <div>
            <Navbar />
            <div className="flex flex-col gap-6 items-center justify-center p-10">
                <p className="text-center p-4 text-2xl">Oops... Page Not Found!!</p>
                {isLoggedIn ? (
                    <Link to="/" className="text-blue-600 underline">
                        Go to HomePage
                    </Link>
                ) : (
                    <Link to="/login" className="text-blue-600 underline">
                        Go to Login page
                    </Link>
                )}
            </div>
        </div>
    );
};

export { NotFoundPage };
