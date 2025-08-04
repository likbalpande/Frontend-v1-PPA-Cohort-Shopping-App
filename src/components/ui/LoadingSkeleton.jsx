import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingSkeleton = ({ className }) => {
    return <Skeleton className={className} />;
};

export { LoadingSkeleton };
