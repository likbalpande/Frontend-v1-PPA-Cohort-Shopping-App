import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { useNavigate, useParams } from "react-router";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { Button } from "../components/ui/Button";
import { showSuccessToast } from "../../utils/toastMessageHelper";
import { useAuthContext } from "../context/AppContext";

const ViewPage = () => {
    const [loading, setLoading] = useState(false);
    const [productInfo, setProductInfo] = useState({});
    const { isLoggedIn } = useAuthContext();
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
    }, []);

    const handleAddToCart = () => {
        if (isLoggedIn) {
            // add to cart logic
            showSuccessToast("Product added to cart!");
        } else {
            // redirect him to login page
            navigate("/login");
        }
    };

    return (
        <div>
            <Navbar />
            {loading ? (
                <div className="w-100 h-75 rounded-xl m-auto">
                    <LoadingSkeleton className="h-full" />
                </div>
            ) : (
                <div>
                    <p className="text-center p-4 text-2xl">ViewPage</p>
                    <div>{JSON.stringify(productInfo, null, 4)}</div>
                    <div className="flex justify-center p-6">
                        <Button onClick={handleAddToCart}>Add To Cart</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export { ViewPage };
