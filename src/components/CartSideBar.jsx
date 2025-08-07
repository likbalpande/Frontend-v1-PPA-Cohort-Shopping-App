import { ClipLoader } from "react-spinners";
import { useAuthContext } from "../context/AppContext";
import { Button } from "./ui/Button";
import { useNavigate } from "react-router";
import { useState } from "react";

const CartSideBar = () => {
    const [address, setAddress] = useState("");
    const { cart, addToCart, updatingCartState, removeFromCart, handleCheckout } = useAuthContext();
    const navigate = useNavigate();

    const handleViewProduct = (productId) => {
        navigate(`/view/${productId}`);
    };

    return (
        <div className="bg-gray-200">
            {cart.map((cartItem) => {
                return (
                    <div
                        className="p-4 border-1  cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => {
                            handleViewProduct(cartItem.product._id);
                        }}
                    >
                        <img src={cartItem.product.images?.[0]} alt={cartItem.product.title} className="w-full" />
                        <p className="text-center">Rs. {cartItem.product.price}</p>
                        {cartItem.product.quantity < cartItem.cartQuantity && (
                            <p className="text-center mb-2 py-2 bg-yellow-300 text-red-600 rounded-md">Out of stock!</p>
                        )}
                        <div className="flex gap-3 items-center justify-center">
                            <Button
                                disabled={updatingCartState}
                                variant="outline-primary"
                                onClick={() => {
                                    removeFromCart(cartItem.product._id);
                                }}
                            >
                                -
                            </Button>
                            {updatingCartState ? <ClipLoader /> : <p>{cartItem.cartQuantity}</p>}
                            <Button
                                variant="outline-primary"
                                onClick={() => {
                                    addToCart(cartItem.product._id);
                                }}
                                disabled={updatingCartState}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                );
            })}
            <div className="flex flex-col gap-3 items-center justify-center h-30">
                <textarea
                    className="border-1 rounded-md px-1 py-0.5"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    cols={15}
                />
                <Button disabled={address.length <= 0} onClick={() => handleCheckout(address)}>
                    Checkout
                </Button>
            </div>
        </div>
    );
};

export { CartSideBar };
