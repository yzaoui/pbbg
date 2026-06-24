import "./LoginRegisterPage.scss";

import React, { useEffect, useState } from "react";
import { Link, Location, useLocation, useNavigate } from "react-router-dom";

import LoginForm, { IncorrectCredentialsError } from "../component/LoginForm";
import authenticationService from "./../authentication.service";

export interface LocationState {
    error?: IncorrectCredentialsError;
    pathnameOnLogin?: string;
}

interface State {
    submitting: boolean;
    error?: IncorrectCredentialsError;
}

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location: Location<LocationState | null> = useLocation();
    const [state, setState] = useState<State>({ submitting: false });

    // If already logged in, redirect to home page
    useEffect(() => {
        if (authenticationService.currentUserValue !== null) {
            navigate("/", { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = (username: string, password: string) => {
        setState({ submitting: true });

        authenticationService.login(username, password)
            .then(
                _token => navigate(location.state?.pathnameOnLogin ?? "/", { replace: true }),
                _error => setState({ submitting: false, error: new IncorrectCredentialsError(username) })
            );
    };

    const error = state.error || location.state?.error;

    return <>
        <title>Log in - PBBG</title>
        <LoginForm onSubmit={handleSubmit} submitting={state.submitting} error={error} />
        <Link to="/register" className="LoginRegisterPage-login-link">New user? Register</Link>
    </>;
};

export default LoginPage;
