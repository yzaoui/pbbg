import React from "react";
import { StaticContext } from "react-router";
import { Link, RouteComponentProps } from "react-router-dom";
import * as H from "history";
import "./LoginRegisterPage.scss";
import authenticationService from "./../authentication.service";
import LoginForm, { IncorrectCredentialsError } from "../component/LoginForm";

interface Props extends RouteComponentProps<{}, StaticContext, { error?: IncorrectCredentialsError, destination?: H.Location }> {}

interface State {
    submitting: boolean;
    error?: IncorrectCredentialsError;
}

class LoginPage extends React.Component<Props, State> {
    readonly state: Readonly<State> = {
        submitting: false
    };

    componentDidMount() {
        document.title = "Log in - PBBG";
    }

    render() {
        const error = this.state.error || this.props.location.state?.error;

        return <>
            <LoginForm onSubmit={this.handleSubmit} submitting={this.state.submitting} error={error} />
            <Link to="/register" className="LoginRegisterPage-login-link">New user? Register</Link>
        </>;
    }

    handleSubmit = (username: string, password: string) => {
        this.setState({ submitting: true });

        authenticationService.login(username, password)
            .then(
                token => this.props.history.push({ pathname: this.props.location.state?.destination?.pathname ?? "/" }),
                error => this.setState({ submitting: false, error: new IncorrectCredentialsError(username) })
            );
    };
}

export default LoginPage;
