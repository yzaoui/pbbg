import React, { ChangeEventHandler, FormEventHandler } from "react";
import "../page/LoginRegisterPage.scss";
import LoadingButton from "./LoadingButton";

interface Props {
    onSubmit: (username: string, password: string) => void;
    submitting: boolean;
    error?: IncorrectCredentialsError;
}

interface State {
    username: string;
    password: string;
}

class LoginForm extends React.Component<Props, State> {
    readonly state: Readonly<State> = {
        username: (this.props.error && this.props.error.username) || "",
        password: ""
    };

    render() {
        return <form onSubmit={this.handleSubmit} className="LoginRegisterPage-form">
            <h1>Log in to PBBG</h1>
            {this.props.error && <div>ERROR</div>}
            <input
                type="text"
                required
                autoFocus
                placeholder="Username"
                autoComplete="username"
                onChange={this.handleUsernameChange}
                value={this.state.username}
                disabled={this.props.submitting}
            />
            <input
                type="password"
                required
                placeholder="Password"
                autoComplete="current-password"
                onChange={this.handlePasswordChange}
                value={this.state.password}
                disabled={this.props.submitting}
            />
            <LoadingButton
                type="submit"
                loading={this.props.submitting}>
                Log in
            </LoadingButton>
        </form>;
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (prevProps.error !== this.props.error) this.setState({ username: this.props.error!!.username, password: "" });
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

export class IncorrectCredentialsError {
    username: string;

    constructor(username: string) {
        this.username = username;
    }
}

export default LoginForm;
