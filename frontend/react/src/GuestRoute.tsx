import * as React from "react";
import { Navigate } from "react-router-dom";
import authenticationService from "./authentication.service";

interface GuestRouteProps {
    children: React.ReactNode;
}

/**
 * Wrapper around route elements which redirects a logged-in user to "/".
 */
const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
    return authenticationService.currentUserValue === null ? <>{children}</> : <Navigate to="/" replace />;
};

export default GuestRoute;
