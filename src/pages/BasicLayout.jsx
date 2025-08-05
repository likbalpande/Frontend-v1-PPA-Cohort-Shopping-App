import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { useAuthContext } from "../context/AppContext";
import { Button } from "../components/ui/Button";

const BasicLayout = () => {
    const { cart, addToCart } = useAuthContext();
    console.log("re-rendered -- BasicLayout");
    const isCartEmpty = cart.length === 0;
    return (
        <div className={`grid ${isCartEmpty ? "grid-cols-1" : "grid-cols-[1fr_175px]"} min-h-screen`}>
            <div>
                <Navbar />
                <Outlet />
            </div>
            {!isCartEmpty && (
                <div className="bg-gray-200">
                    {cart.map((cartItem) => {
                        return (
                            <div className="p-4 border-1">
                                <img
                                    src={cartItem.product.images?.[0]}
                                    alt={cartItem.product.title}
                                    className="w-full"
                                />
                                <p className="text-center">Rs. {cartItem.product.price}</p>
                                <div className="flex gap-3 items-center justify-center">
                                    <Button variant="outline-primary">-</Button>
                                    <p>{cartItem.cartQuantity}</p>
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => {
                                            addToCart(cartItem.product._id);
                                        }}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export { BasicLayout };
