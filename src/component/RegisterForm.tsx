import React, { ChangeEventHandler, FormEventHandler } from "react";
import "../page/LoginRegisterPage.scss";
import { USERNAME_REGEX, PASSWORD_REGEX } from "../helper/const";
import LoadingButton from "./LoadingButton";

interface Props {
    onSubmit: (username: string, password: string) => void;
    submitting: boolean;
    error: boolean;
}

interface State {
    username: string;
    password: string;
}

class RegisterForm extends React.Component<Props, State> {
    readonly state: Readonly<State> = {
        username: "",
        password: ""
    };

    render() {
        return <form onSubmit={this.handleSubmit} className="LoginRegisterPage-form">
            <h1>Register your account</h1>
            {this.props.error && <div>ERROR</div>}
            <input
                type="text"
                required
                placeholder="Username"
                autoComplete="username"
                onChange={this.handleUsernameChange}
                value={this.state.username}
                disabled={this.props.submitting}
                pattern={USERNAME_REGEX.pattern}
                title={USERNAME_REGEX.description}
            />
            <input
                type="password"
                required
                placeholder="Password"
                autoComplete="new-password"
                onChange={this.handlePasswordChange}
                value={this.state.password}
                disabled={this.props.submitting}
                pattern={PASSWORD_REGEX.pattern}
                title={PASSWORD_REGEX.description}
            />
            <LoadingButton
                type="submit"
                loading={this.props.submitting}>
                Register
            </LoadingButton>
        </form>;
    }

    handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.state.username, this.state.password);
    };

    handleUsernameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        this.setState({ username: event.target.value });
    };

    handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        this.setState({ password: event.target.value });
    };
}

export default RegisterForm;
