const Paginator = ({ total, page, limit, handlePageClick }) => {
    const totalPages = Math.ceil(total / limit);

    const dummyArray = new Array(totalPages).fill("hi");

    return (
        <div className="flex gap-x-4 gap-y-2 flex-wrap">
            {dummyArray.map((elem, idx) => {
                const selected = idx + 1 == page;
                return (
                    <button
                        className={`px-2 py-1 border-1 rounded-md text-sm cursor-pointer ${
                            selected ? "bg-gray-400" : "bg-gray-200"
                        } hover:bg-gray-300 transition`}
                        key={idx}
                        onClick={() => {
                            handlePageClick(idx + 1);
                        }}
                    >
                        {idx + 1}
                    </button>
                );
            })}
        </div>
    );
};

export { Paginator };
