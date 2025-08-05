import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { PuffLoader } from "react-spinners";
import { showErrorToast, showSuccessToast } from "../../utils/toastMessageHelper";
import { Link, useNavigate } from "react-router";
import { useAuthContext } from "../context/AppContext";

const LoginPage = () => {
    const [loggingInUser, setLoggingInUser] = useState(false);
    const { handleSetUser } = useAuthContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoggingInUser(true);
            const email = e.target.email.value;
            const password = e.target.password.value;

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                }),
                headers: {
                    "content-type": "application/json",
                },
                credentials: "include",
            });

            const result = await response.json();

            if (response.status == 200) {
                showSuccessToast("Login Success!");
                handleSetUser({
                    // ...result.data.user,
                    isLoggedIn: true,
                });
                navigate("/");
            } else {
                showErrorToast(result.message);
            }
        } catch (err) {
            showErrorToast(`Unable to login: ${err.message}`);
        } finally {
            setLoggingInUser(false);
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-6 items-center justify-center p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="border border-amber-700 px-2 py-1 rounded-md read-only:bg-gray-200 read-only:cursor-not-allowed"
                        />
                    </div>
                    <div className="flex gap-4 items-center">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="border border-amber-700 px-2 py-1 rounded-md"
                        />
                    </div>

                    {loggingInUser ? (
                        <div className="flex items-center justify-center p-10">
                            <PuffLoader size="50" />
                        </div>
                    ) : (
                        <button className="self-center tracking-widest border text-white/95 cursor-pointer transition bg-amber-600 px-2 py-1 rounded-md hover:bg-amber-700">
                            Login
                        </button>
                    )}
                </form>
            </div>
            <div className="m-4 text-center">
                <Link to="/signup">
                    Don't have an account? <span className="underline text-blue-600">Signup here</span>
                </Link>
            </div>
        </div>
    );
};

export { LoginPage };
