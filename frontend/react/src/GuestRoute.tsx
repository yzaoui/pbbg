import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom"
import authenticationService from "./authentication.service"

/**
 * Wrapper around React.Route which redirects a logged-in user to "/".
 */
const GuestRoute: React.FC<RouteProps> = ({ component: Component, ...rest }) => {
    if (!Component) return null;
    return <Route
        {...rest}
        render={props =>
            authenticationService.currentUserValue === null ? <Component {...props} /> : <Redirect to="/" />
        }
    />;
};

export default GuestRoute;
