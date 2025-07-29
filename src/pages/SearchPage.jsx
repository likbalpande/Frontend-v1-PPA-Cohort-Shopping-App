import { useSearchParams } from "react-router";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { Paginator } from "../components/Paginator";

const LIMIT_PER_PAGE = 10;

const SearchPage = () => {
    const [query] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const searchText = query.get("text");

    const getAllProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/v1/products/?q=${searchText}&limit=${LIMIT_PER_PAGE}&page=${page}`,
                {
                    method: "GET",
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
                                    <div className="border-1 border-amber-900 rounded-lg p-5 flex">
                                        <div className="w-40 h-40">
                                            <img src={elem.images?.[0]} className="w-full" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-orange-600">{elem.title}</h3>
                                            <p>Rs. {elem.price}</p>
                                            <p>In stock: {elem.quantity}</p>
                                        </div>
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
                            <div>
                                <Paginator
                                    limit={LIMIT_PER_PAGE}
                                    page={page}
                                    total={total}
                                    handlePageClick={(val) => setPage(val)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export { SearchPage };
