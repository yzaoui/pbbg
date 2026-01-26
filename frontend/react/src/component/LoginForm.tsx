import React, { ChangeEventHandler, FormEventHandler, useEffect, useState } from "react";
import "../page/LoginRegisterPage.scss";
import LoadingButton from "./LoadingButton";

interface Props {
    onSubmit: (username: string, password: string) => void;
    submitting: boolean;
    error?: IncorrectCredentialsError;
}

const LoginForm: React.FC<Props> = ({ onSubmit, submitting, error }) => {
    const [username, setUsername] = useState((error && error.username) || "");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (error) {
            setUsername(error.username);
            setPassword("");
        }
    }, [error]);

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        onSubmit(username, password);
    };

    const handleUsernameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setPassword(event.target.value);
    };

    return <form onSubmit={handleSubmit} className="LoginRegisterPage-form">
        <h1>Log in to PBBG</h1>
        {error && <div>ERROR</div>}
        <input
            type="text"
            required
            autoFocus
            placeholder="Username"
            autoComplete="username"
            onChange={handleUsernameChange}
            value={username}
            disabled={submitting}
        />
        <input
            type="password"
            required
            placeholder="Password"
            autoComplete="current-password"
            onChange={handlePasswordChange}
            value={password}
            disabled={submitting}
        />
        <LoadingButton
            type="submit"
            loading={submitting}>
            Log in
        </LoadingButton>
    </form>;
};

export class IncorrectCredentialsError {
    username: string;

    constructor(username: string) {
        this.username = username;
    }
}

export default LoginForm;
