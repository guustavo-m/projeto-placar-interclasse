import {
    Navigate
} from "react-router-dom";

function AdminRoute({
    children
}) {

    const tipo =
        localStorage.getItem(
            "tipo"
        );

    if (
        tipo !== "admin"
    ) {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "tipo"
        );

        return (
            <Navigate
                to="/login"
            />
        );

    }

    return children;

}

export default AdminRoute;