import React, { ChangeEventHandler, FormEventHandler, useState } from "react";
import "../page/LoginRegisterPage.scss";
import { USERNAME_REGEX, PASSWORD_REGEX } from "../helper/const";
import LoadingButton from "./LoadingButton";

interface Props {
    onSubmit: (username: string, password: string) => void;
    submitting: boolean;
    error: boolean;
}

const RegisterForm: React.FC<Props> = ({ onSubmit, submitting, error }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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
        <h1>Register your account</h1>
        {error && <div>ERROR</div>}
        <input
            type="text"
            required
            placeholder="Username"
            autoComplete="username"
            onChange={handleUsernameChange}
            value={username}
            disabled={submitting}
            pattern={USERNAME_REGEX.pattern}
            title={USERNAME_REGEX.description}
        />
        <input
            type="password"
            required
            placeholder="Password"
            autoComplete="new-password"
            onChange={handlePasswordChange}
            value={password}
            disabled={submitting}
            pattern={PASSWORD_REGEX.pattern}
            title={PASSWORD_REGEX.description}
        />
        <LoadingButton
            type="submit"
            loading={submitting}>
            Register
        </LoadingButton>
    </form>;
};

export default RegisterForm;
