import React, { ChangeEventHandler, FormEventHandler, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authenticationService from "./../authentication.service";
import * as LoginForm from "./../component/LoginForm";
import styles from "./GuestNav.module.scss";

const GuestNav: React.FC = () => {
    const [submitting, setSubmitting] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const hideLogin = location.pathname === "/login" || location.pathname === "/register";

    useEffect(() => {
        if (!submitting) {
            setUsername("");
            setPassword("");
        }
    }, [submitting]);

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        setSubmitting(true);

        authenticationService.login(username, password)
            .catch(error => {
                setSubmitting(false);
                navigate("/login", { state: { error: new LoginForm.IncorrectCredentialsError(username) } });
            });
    };

    const handleUsernameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setPassword(event.target.value);
    };

    return <nav className="sidebar sidebar-guest">
        <Link to="/">Index</Link>
        {!hideLogin &&
            <form className={styles["sidebar-login-form"]} onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    required
                    placeholder="Username"
                    autoComplete="username"
                    onChange={handleUsernameChange}
                    value={username}
                    disabled={submitting}
                />
                <input
                    type="password"
                    name="password"
                    required
                    placeholder="Password"
                    autoComplete="current-password"
                    onChange={handlePasswordChange}
                    value={password}
                    disabled={submitting}
                />
                <button type="submit" disabled={submitting}>Log in</button>
            </form>
        }
    </nav>;
};

export default GuestNav;
