import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import authenticationService from "./authentication.service";
import { LocationState } from "./page/LoginPage";

interface MemberRouteProps {
    children: React.ReactNode;
}

/**
 * Wrapper around route elements which redirects a guest user to "/login", passing in the target destination.
 */
const MemberRoute: React.FC<MemberRouteProps> = ({ children }) => {
    const location = useLocation();
    return authenticationService.currentUserValue !== null ? 
        <>{children}</> 
    : 
        <Navigate to="/login" state={{ pathnameOnLogin: location.pathname } satisfies LocationState} replace />;
};

export default MemberRoute;
