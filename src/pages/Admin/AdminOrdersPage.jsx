import { useEffect, useState } from "react";
import { showErrorToast } from "../../../utils/toastMessageHelper";
import { format } from "date-fns";

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);

    const getAllOrders = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admins/orders`, {
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

    useEffect(() => {
        getAllOrders();
    }, []);
    return (
        <div className="p-6">
            <p className="text-2xl font-bold tracking-wide text-pink-500 underline mx-auto my-6">Admin Orders Page</p>
            <div className="flex flex-col gap-5">
                {orders.map(({ _id, address, createdAt, products, user }) => {
                    return (
                        <div key={_id} className="border border-amber-600 bg-amber-100 rounded-lg p-6">
                            <p>Order Id: {_id}</p>
                            <p>Address to deliver: {address}</p>
                            <p>Order Placed At: {format(createdAt, "PPpp")}</p>
                            <p>User Email: {user.email}</p>
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
                })}
            </div>
        </div>
    );
};

export { AdminOrdersPage };
