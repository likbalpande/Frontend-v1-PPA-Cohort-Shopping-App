import { useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../utils/toastMessageHelper";
import { format } from "date-fns";
import { Button } from "../components/ui/Button";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);

    const getAllOrders = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders`, {
                method: "GET",
                credentials: "include",
            });
            const result = await response.json();
            if (response.status == 200) {
                setOrders(result.data.orders);
            } else {
                showErrorToast(result.message);
            }
        } catch (err) {
            showErrorToast(err.message);
        }
    };

    const getOrderPaymentDetails = async (orderId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}/payment-status`, {
                method: "GET",
                credentials: "include",
            });
            const result = await response.json();
            if (response.status == 200) {
                showSuccessToast("Payment Details Fetched");
                getAllOrders();
            } else {
                showErrorToast(result.message);
            }
        } catch (err) {
            showErrorToast(err.message);
        }
    };

    useEffect(() => {
        getAllOrders();
    }, []);

    return (
        <div className="p-6">
            <p className="text-2xl font-bold tracking-wide text-pink-500 underline mx-auto my-6">Your Orders</p>
            <div className="flex flex-col gap-5">
                {orders.map(
                    ({ _id, address, createdAt, products, user, contactNumbers, orderStatus, paymentStatus }) => {
                        return (
                            <div key={_id} className="border border-amber-600 bg-amber-100 rounded-lg p-6">
                                <p>Order Id: {_id}</p>
                                <p>Address to deliver: {address}</p>
                                <p>Contact Numbers: {contactNumbers.join(", ")}</p>
                                <p>Order Placed At: {format(createdAt, "PPpp")}</p>
                                <p>User Email: {user.email}</p>
                                <p className="py-2 flex gap-3 items-center">
                                    <span>Payment Status:</span>
                                    <span className="p-1 rounded-sm bg-cyan-300">{paymentStatus}</span>
                                    <Button onClick={() => getOrderPaymentDetails(_id)}>Refresh</Button>
                                </p>
                                <p className="py-2">
                                    Order Status: <span className="p-1 rounded-sm bg-cyan-300">{orderStatus}</span>
                                </p>
                                <div className="bg-amber-200 p-4 rounded-md flex flex-wrap gap-4">
                                    {products.map(({ _id: itemId, cartQuantity, price, product }) => {
                                        return (
                                            <div key={itemId} className="border border-b-amber-900 rounded-md p-4">
                                                <p>Quantity: {cartQuantity}</p>
                                                <p>Price: {price}</p>
                                                <p>Product Id: {product}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    }
                )}
            </div>
        </div>
    );
};

export { OrdersPage };
