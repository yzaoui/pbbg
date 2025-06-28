import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom"
import authenticationService from "./authentication.service"

/**
 * Wrapper around React.Route which redirects a guest user to "/login", passing in the target destination.
 */
const MemberRoute: React.FC<RouteProps> = ({ component: Component, ...rest }) => {
    if (!Component) return null;
    return <Route
        {...rest}
        render={props =>
            authenticationService.currentUserValue !== null ? <Component {...props} /> : <Redirect to={{ pathname: "/login", state: { destination: props.location } }} />
        }
    />;
};

export default MemberRoute;
