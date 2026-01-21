import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginRegisterPage.scss";
import RegisterForm from "../component/RegisterForm";
import authenticationService from "./../authentication.service";

interface State {
    submitting: boolean;
    error: boolean;
}

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [state, setState] = useState<State>({ submitting: false, error: false });

    // If already logged in, redirect to home
    useEffect(() => {
        if (authenticationService.currentUserValue !== null) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    const handleSubmit = (username: string, password: string) => {
        setState({ submitting: true, error: false });

        authenticationService.register(username, password)
            .catch(_error => setState({ submitting: false, error: true }));
    };

    return <>
        <title>Register - PBBG</title>
        <RegisterForm onSubmit={handleSubmit} submitting={state.submitting} error={state.error} />
        <Link to="/login" className="LoginRegisterPage-login-link">Existing user? Log in</Link>
    </>;
};

export default RegisterPage;
