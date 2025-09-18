import { useState } from "react";
import { showErrorToast, showSuccessToast } from "../../utils/toastMessageHelper";
import { Button } from "../components/ui/Button";
import { useAuthContext } from "../context/AppContext";
import { load } from "@cashfreepayments/cashfree-js";
import { useNavigate } from "react-router";

const PaymentPage = () => {
    const [loading, setLoading] = useState(false);
    const { cart, handlePlaceOrder } = useAuthContext();
    const [paymentSessionId, setPaymentSessionId] = useState("");
    const [orderId, setOrderId] = useState("");
    const navigate = useNavigate();

    const getOrderPaymentDetails = async (orderId) => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}/payment-status`, {
                method: "GET",
                credentials: "include",
            });
            const result = await response.json();
            if (response.status == 200) {
                showSuccessToast("Payment Details Fetched");
            } else {
                showErrorToast(result.message);
            }
        } catch (err) {
            showErrorToast(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        let currentPaymentSessionId = paymentSessionId;
        let currentOrderId = orderId;

        if (currentPaymentSessionId === "") {
            const name = e.target.name.value;
            const address = e.target.address.value;
            const city = e.target.city.value;
            const state = e.target.state.value;
            const contactNumber1 = e.target.contactNumber1.value;
            const contactNumber2 = e.target.contactNumber2.value;

            console.log(name, address, city, state, contactNumber1, contactNumber2);
            try {
                setLoading(true);
                const { paymentSessionId: pId, orderId } = await handlePlaceOrder({
                    name,
                    address,
                    city,
                    state,
                    contactNumber1,
                    contactNumber2,
                });
                currentPaymentSessionId = pId;
                currentOrderId = orderId;
                console.log("🟡 : paymentSessionId:", currentPaymentSessionId);
                setPaymentSessionId(currentPaymentSessionId);
                setOrderId(currentOrderId);
            } catch {
                console.log("error");
            } finally {
                setLoading(false);
            }
        }

        let cashfree;

        try {
            setLoading(true);
            var initializeSDK = async function () {
                cashfree = await load({
                    mode: "sandbox",
                });
            };

            await initializeSDK();
        } catch {
            console.log("error");
        } finally {
            setLoading(false);
        }

        let checkoutOptions = {
            paymentSessionId: currentPaymentSessionId,
            redirectTarget: "_modal",
        };

        cashfree.checkout(checkoutOptions).then(async (result) => {
            if (result.error) {
                // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
                console.log("User has closed the popup or there is some payment error, Check for Payment Status");
                console.log(result.error);
                showErrorToast("Payment failed! Please try again!");
            }
            if (result.redirect) {
                // This will be true when the payment redirection page couldn't be opened in the same window
                // This is an exceptional case only when the page is opened inside an inAppBrowser
                // In this case the customer will be redirected to return url once payment is completed
                console.log("Payment will be redirected");
            }
            if (result.paymentDetails) {
                // This will be called whenever the payment is completed irrespective of transaction status
                console.log("Payment has been completed, Check for Payment Status");
                console.log(result.paymentDetails.paymentMessage);
                showSuccessToast("Payment succeed!");
                await getOrderPaymentDetails(currentOrderId);
                navigate("/orders");
            }
        });
    };

    return (
        <div className="flex items-center justify-center p-8">
            <form className="flex flex-col gap-4 max-w-[600px]" onSubmit={handlePayment}>
                <div className="flex gap-3 items-center">
                    <label>Name:</label>
                    <input className="px-1 py-0.5 rounded-md border" text="text" name="name" required />
                </div>
                <div className="flex gap-3 items-center">
                    <label>Address:</label>
                    <textarea className="px-1 py-0.5 rounded-md border" text="text" name="address" required />
                </div>
                <div className="flex gap-3 items-center">
                    <label>City:</label>
                    <input className="px-1 py-0.5 rounded-md border" text="text" name="city" required />
                </div>
                <div className="flex gap-3 items-center">
                    <label>State:</label>
                    <input className="px-1 py-0.5 rounded-md border" text="text" name="state" required />
                </div>
                <div className="flex gap-3 items-center">
                    <label>Contact Number:</label>
                    <input className="px-1 py-0.5 rounded-md border" text="text" name="contactNumber1" required />
                </div>
                <div className="flex gap-3 items-center">
                    <label>Alternate Contact Number:</label>
                    <input className="px-1 py-0.5 rounded-md border" text="text" name="contactNumber2" required />
                </div>
                <div>
                    {cart.map((cartItem) => {
                        return (
                            <div className="p-4 flex gap-3 items-center border-1 cursor-pointer hover:bg-gray-100 transition">
                                <img
                                    src={cartItem.product.images?.[0]}
                                    alt={cartItem.product.title}
                                    className="w-[100px] h-[100px] border border-gray-200"
                                />
                                <p className="text-center">Rs. {cartItem.product.price}</p>
                                {cartItem.product.quantity < cartItem.cartQuantity && (
                                    <p className="text-center mb-2 py-2 bg-yellow-300 text-red-600 rounded-md">
                                        Out of stock!
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
                <Button disabled={loading}>Proceed to payment</Button>
            </form>
        </div>
    );
};

export { PaymentPage };
