import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";

export default function PublicRoute() {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return null;
    }
    if (isAuthenticated) {
        return (
            <Navigate
                to={ROUTES.DASHBOARD}
                replace
            />
        );
    }

    return <Outlet />;
}