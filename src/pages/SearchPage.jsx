import { useSearchParams } from "react-router";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

const SearchPage = () => {
    const [query] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);

    const searchText = query.get("text");

    const getAllProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3900/api/v1/products/?q=${searchText}`, {
                method: "GET",
            });
            const result = await response.json();

            console.log(result);
            setProducts(result.data.products);
        } catch (err) {
            alert("Cannot get products", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllProducts();
    }, [searchText]);

    return (
        <div>
            <Navbar />
            <div>
                {loading ? (
                    <div className="fixed top-1/2 left-1/2 -translate-1/2">
                        <BeatLoader size={20} />
                    </div>
                ) : (
                    <div className="flex">
                        <div className="w-50 bg-blue-100"></div>
                        <div className="p-8 flex-1 flex flex-col gap-5 bg-emerald-100">
                            {products.map((elem) => {
                                return (
                                    <div className="border-1 border-amber-900 rounded-lg p-5">
                                        <h3 className="text-xl font-bold text-orange-600">{elem.title}</h3>
                                        <img src={elem.images?.[0]} />
                                        <p>Rs. {elem.price}</p>
                                        <p>In stock: {elem.quantity}</p>
                                    </div>
                                );
                            })}
                            {products.length === 0 && (
                                <div className="py-30">
                                    <p className="text-yellow-700 text-xl font-bold text-center">
                                        No results found for your search{" "}
                                        <span className="text-cyan-500 underline">{searchText}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export { SearchPage };
