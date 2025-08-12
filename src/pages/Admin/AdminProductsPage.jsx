import { useEffect, useState } from "react";
import { useSearchParams } from "react-router"; //useNavigate
import { LoadingSkeleton } from "../../components/ui/LoadingSkeleton";
import { Paginator } from "../../components/Paginator";
import { Button } from "../../components/ui/Button";
import { showErrorToast, showSuccessToast } from "../../../utils/toastMessageHelper";

const LIMIT_PER_PAGE = 50;

const AdminProductsPage = () => {
    const [query] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [editProductId, setEditProductId] = useState("");

    // const navigate = useNavigate();

    const searchText = query.get("text") ?? "";

    const getAllProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/products/?q=${searchText}&limit=${LIMIT_PER_PAGE}&page=${page}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const result = await response.json();

            console.log(result);
            setProducts(result.data.products);
            setTotal(result.data.total);
        } catch (err) {
            alert("Cannot get products", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllProducts();
    }, [searchText, page]);

    // const handleViewProduct = (productId) => {
    //     navigate(`/view/${productId}`);
    // };

    const handleCancelEditing = (e) => {
        e.preventDefault();
        setEditProductId("");
    };

    const updateProduct = async (e) => {
        e.preventDefault();

        const title = e.target.title.value;
        const price = e.target.price.value;
        const quantity = e.target.quantity.value;

        if (title.length < 3) {
            showErrorToast("Title is too short!");
            return;
        }

        if (price <= 1) {
            showErrorToast("Price cannot be < 1");
            return;
        }

        if (quantity <= 0) {
            showErrorToast("Quantity cannot be negative");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admins/products/${editProductId}`, {
                method: "PATCH",
                credentials: "include",
                body: JSON.stringify({
                    title,
                    price,
                    quantity,
                }),
                headers: {
                    "content-type": "application/json",
                },
            });
            if (response.status == 200) {
                showSuccessToast("Product Updated!");
                setEditProductId("");
                getAllProducts();
            } else {
                const result = await response.json();
                showErrorToast(result.message);
            }
        } catch (err) {
            showErrorToast(`Error in updating products: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 flex-1 flex flex-col gap-5 bg-emerald-100">
            {loading &&
                Array(10)
                    .fill("")
                    .map((_, idx) => {
                        return <LoadingSkeleton key={idx} className="h-[200px]" />;
                    })}
            {products.map((elem) => {
                return (
                    <div className="border-1 border-amber-900 rounded-lg p-5 hover:bg-white/40 cursor-pointer hover:scale-102 transition">
                        <div
                            role="button"
                            // onClick={() => handleViewProduct(elem._id)}
                            className="flex "
                        >
                            <div className="w-40 h-40">
                                <img src={elem.images?.[0]} className="w-full" />
                            </div>
                            {editProductId === elem._id ? (
                                <form className="flex flex-col gap-3" onSubmit={updateProduct}>
                                    <div className="flex gap-2">
                                        <label>Title</label>
                                        <input
                                            className="px-1 py-0.5 border rounded-sm"
                                            type="text"
                                            name="title"
                                            defaultValue={elem.title}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <label>Price</label>
                                        <input
                                            defaultValue={elem.price}
                                            className="px-1 py-0.5 border rounded-sm"
                                            type="number"
                                            name="price"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <label>Quantity</label>
                                        <input
                                            className="px-1 py-0.5 border rounded-sm"
                                            type="number"
                                            name="quantity"
                                            defaultValue={elem.quantity}
                                        />
                                    </div>
                                    <Button>Update</Button>
                                    <Button type="button" onClick={handleCancelEditing}>
                                        Cancel
                                    </Button>
                                </form>
                            ) : (
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-orange-600">{elem.title}</h3>
                                    <p>Rs. {elem.price}</p>
                                    <p>In stock: {elem.quantity}</p>
                                </div>
                            )}
                        </div>
                        {editProductId !== elem._id && (
                            <>
                                <Button onClick={() => setEditProductId(elem._id)}>Edit</Button>
                                <Button>Delete</Button>
                            </>
                        )}
                    </div>
                );
            })}
            {products.length === 0 && (
                <div className="py-30">
                    <p className="text-yellow-700 text-xl font-bold text-center">
                        No results found for your search <span className="text-cyan-500 underline">{searchText}</span>
                    </p>
                </div>
            )}
            <div>
                <Paginator limit={LIMIT_PER_PAGE} page={page} total={total} handlePageClick={(val) => setPage(val)} />
            </div>
        </div>
    );
};

export { AdminProductsPage };
