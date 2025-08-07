import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { Button } from "../components/ui/Button";
import { useAuthContext } from "../context/AppContext";
import { ClipLoader } from "react-spinners";

const ViewPage = () => {
    console.log("re-rendered -- ViewPage");
    const [loading, setLoading] = useState(false);
    const [productInfo, setProductInfo] = useState({});
    const { isLoggedIn, addToCart, cart, updatingCartState, removeFromCart } = useAuthContext();
    const { productId } = useParams();
    const navigate = useNavigate();

    const getProductInfo = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products/view/${productId}`, {
                method: "GET",
                credentials: "include",
            });

            const result = await response.json();

            setProductInfo(result.data.product);
        } catch (err) {
            alert("Cannot get products", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProductInfo();
    }, [productId]);

    const handleAddToCart = () => {
        if (isLoggedIn) {
            // add to cart logic
            addToCart(productInfo._id);
        } else {
            // redirect him to login page
            navigate("/login");
        }
    };

    const handleRemoveFromCart = () => {
        if (isLoggedIn) {
            // add to cart logic
            removeFromCart(productInfo._id);
        } else {
            // redirect him to login page
            navigate("/login");
        }
    };

    const currentItem = cart.find((elem) => elem.product._id === productId);
    console.log("🟡 : currentItem:", currentItem);

    return (
        <div>
            {loading ? (
                <div className="w-100 h-75 rounded-xl m-auto">
                    <LoadingSkeleton className="h-full" />
                </div>
            ) : (
                <div>
                    <p className="text-center p-4 text-2xl">{productInfo.title}</p>
                    <p className="text-center p-4 text-2xl">Rs. {productInfo.price}</p>
                    <p className="text-center p-4 text-2xl">Quantity: {productInfo.quantity}</p>
                    <p className="text-center p-4 text-2xl">{productInfo.title}</p>
                    <div className="flex gap-6 flex-wrap items-center justify-center">
                        {productInfo.images?.map((imgUrl) => {
                            return <img src={imgUrl} className="h-50 w-50" />;
                        })}
                    </div>
                    {updatingCartState ? (
                        <ClipLoader />
                    ) : (
                        <div className="flex justify-center p-6">
                            {currentItem ? (
                                <>
                                    <div className="flex gap-3 items-center justify-center">
                                        <Button variant="outline-primary" onClick={handleRemoveFromCart}>
                                            -
                                        </Button>
                                        <p>{currentItem.cartQuantity}</p>
                                        <Button variant="outline-primary" onClick={handleAddToCart}>
                                            +
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <Button onClick={handleAddToCart}>Add To Cart</Button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export { ViewPage };
