import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function ProtectedRoute({ children, allowedRole }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null;

    if (!user) return <Navigate to ="/login" />;

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/" />;
    }

    return children;
}