const STYLES_MAPPING = {
    primary: "border text-white/95 bg-amber-600 px-2 py-1 rounded-md hover:bg-amber-700",
    "outline-primary": "border border-amber-600 text-black/90 px-1.5 hover:bg-amber-600 hover:text-white/90 rounded-md",
};

const Button = ({ children, className, onClick, variant = "primary" }) => {
    return (
        <button
            onClick={onClick}
            className={`cursor-pointer transition hover:scale-102 ${STYLES_MAPPING[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export { Button };
