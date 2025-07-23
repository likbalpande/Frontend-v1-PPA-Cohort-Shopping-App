import { Link, useNavigate } from "react-router";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";

const Navbar = () => {
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate(`/search?text=${searchText}`);
    };

    return (
        <div className="flex px-6 py-4 bg-amber-200 justify-between items-center">
            <div className="text-xl font-bold text-purple-800">My Shopping App</div>
            <div className="flex gap-4 items-center">
                {/* controlled input / component */}
                <input
                    className="px-2 py-1 border-1 border-amber-900 rounded-lg"
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                    }}
                />
                <button
                    onClick={handleSearch}
                    className="px-2 py-1 bg-amber-700 text-white rounded-lg cursor-pointer transition hover:bg-amber-800"
                >
                    Search
                </button>
            </div>
            <div className="flex gap-4 items-center">
                <Link to="/" className="text-blue-700 underline">
                    Home
                </Link>
                <Link to="/login" className="text-blue-700 underline">
                    Login
                </Link>
                <div className="p-[6px] border-1 border-transparent rounded-full bg-amber-700 text-white text-xl hover:border-1 hover:bg-transparent hover:text-amber-800 hover:border-amber-800 cursor-pointer">
                    <IoMenu />
                </div>
            </div>
        </div>
    );
};

export { Navbar };
