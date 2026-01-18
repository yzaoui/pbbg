import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import authenticationService from "./authentication.service";

interface MemberRouteProps {
    children: React.ReactNode;
}

/**
 * Wrapper around route elements which redirects a guest user to "/login", passing in the target destination.
 */
const MemberRoute: React.FC<MemberRouteProps> = ({ children }) => {
    const location = useLocation();
    return authenticationService.currentUserValue !== null ? <>{children}</> : <Navigate to="/login" state={{ destination: location }} replace />;
};

export default MemberRoute;
