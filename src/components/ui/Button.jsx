const Button = ({ children, className, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`
            border text-white/95 cursor-pointer transition bg-amber-600 px-2 py-1 rounded-md hover:bg-amber-700
            ${className}
            `}
        >
            {children}
        </button>
    );
};

export { Button };
