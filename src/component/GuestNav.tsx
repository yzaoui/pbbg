import React, { ChangeEventHandler, FormEventHandler } from "react";
import "./GuestNav.scss";
import { Link } from "react-router-dom";
import authenticationService from "./../authentication.service";
import history from "./../helper/history";
import * as LoginForm from "./../component/LoginForm";
import { UnregisterCallback } from "history";

interface State {
    submitting: boolean;
    username: string;
    password: string;
    hideLogin: boolean;
}

class GuestNav extends React.Component<{}, State> {
    readonly state: Readonly<State> = {
        submitting: false,
        username: "",
        password: "",
        hideLogin: false
    };

    unlistenHistory?: UnregisterCallback;

    componentDidMount() {
        this.unlistenHistory = history.listen((location) => {
            this.setState({ hideLogin: (location.pathname === "/login" || location.pathname === "/register") });
        });
    }

    componentWillUnmount() {
        this.unlistenHistory && this.unlistenHistory();
    }

    render() {
        return <nav className="sidebar sidebar-guest">
            <Link to="/">Index</Link>
            {!this.state.hideLogin &&
                <form className="sidebar-login-form" onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        required
                        placeholder="Username"
                        autoComplete="username"
                        onChange={this.handleUsernameChange}
                        value={this.state.username}
                        disabled={this.state.submitting}
                    />
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={this.handlePasswordChange}
                        value={this.state.password}
                        disabled={this.state.submitting}
                    />
                    <button type="submit" disabled={this.state.submitting}>Log in</button>
                </form>
            }
        </nav>;
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<State>, snapshot?: any) {
        if (prevState.submitting && !this.state.submitting) {
            this.setState({ username: "", password: "" });
        }
    }

    handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const { username, password } = this.state;

        this.setState({ submitting: true });

        authenticationService.login(username, password)
            .catch(error => {
                this.setState({ submitting: false });
                history.push({ pathname: "/login", state: { error: new LoginForm.IncorrectCredentialsError(username) } });
            });
    };

    handleUsernameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        this.setState({ username: event.target.value });
    };

    handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        this.setState({ password: event.target.value });
    };
}

export default GuestNav;
