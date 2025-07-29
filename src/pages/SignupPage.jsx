import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { PuffLoader } from "react-spinners";
import { showErrorToast, showSuccessToast } from "../../utils/toastMessageHelper";

const SignupPage = () => {
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [sendingOTP, setSendingOTP] = useState(false);

    const handleUserSignup = async (e) => {
        try {
            const email = e.target.email.value;
            const otp = e.target.otp.value;
            const password = e.target.password.value;

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
                method: "POST",
                body: JSON.stringify({
                    email,
                    otp,
                    password,
                }),
                headers: {
                    "content-type": "application/json",
                },
            });

            if (response.status == 201) {
                showSuccessToast("Signup Success!");
            } else {
                const result = await response.json();
                showErrorToast(result.message);
            }
        } catch (err) {
            showErrorToast(`Unable to signup: ${err.message}`);
        }
    };

    const handleSendOtp = async (e) => {
        try {
            setSendingOTP(true);

            const email = e.target.email.value;

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/otps`, {
                method: "POST",
                body: JSON.stringify({
                    email,
                }),
                headers: {
                    "content-type": "application/json",
                },
            });

            if (response.status == 201) {
                showSuccessToast("Otp sent to the email!");
                setIsOtpSent(true);
            } else {
                const result = await response.json();
                showErrorToast(result.message);
            }
        } catch (err) {
            console.log("error occurred in handleSendOtp", err.message);
            showErrorToast(`Unable to send OTP: ${err.message}`);
        } finally {
            setSendingOTP(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isOtpSent) {
            handleUserSignup(e);
        } else {
            handleSendOtp(e);
        }
    };

    return (
        <div>
            <Navbar searchBox={false} />
            <div className="flex flex-col gap-6 items-center justify-center p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="border border-amber-700 px-2 py-1 rounded-md read-only:bg-gray-200 read-only:cursor-not-allowed"
                            readOnly={isOtpSent}
                        />
                    </div>
                    {isOtpSent && (
                        <>
                            <div className="flex gap-4 items-center">
                                <label>OTP:</label>
                                <input
                                    type="string"
                                    name="otp"
                                    required
                                    className="border border-amber-700 px-2 py-1 rounded-md"
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
                        </>
                    )}
                    {sendingOTP ? (
                        <div className="flex items-center justify-center p-10">
                            <PuffLoader size="50" />
                        </div>
                    ) : (
                        <>
                            {isOtpSent ? (
                                <button className="self-center tracking-widest border text-white/95 cursor-pointer transition bg-amber-600 px-2 py-1 rounded-md hover:bg-amber-700">
                                    SIGNUP
                                </button>
                            ) : (
                                <button className="self-center tracking-widest border text-white/95 cursor-pointer transition bg-amber-600 px-2 py-1 rounded-md hover:bg-amber-700">
                                    Send OTP
                                </button>
                            )}
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export { SignupPage };
