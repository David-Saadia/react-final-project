import { startTransition } from "react";
import { useNavigate } from "react-router-dom";

const useGoTo = () => {
    const navigate = useNavigate();
    return (path, options={}) => {
        startTransition(() => {
            navigate(path, options);
        });
    };
};

export default useGoTo;
