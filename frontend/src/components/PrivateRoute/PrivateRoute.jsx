import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {

    const token =
        localStorage.getItem("token");

    if (!token) {

        return <Navigate to="/login" />;

    }

    try {

        const decoded =
            jwtDecode(token);

        if (
            decoded.exp * 1000 <
            Date.now()
        ) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "usuario"
            );

            return <Navigate to="/login" />;

        }

        return children;

    } catch {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "usuario"
            );

        return <Navigate to="/login" />;

    }

}

export default PrivateRoute