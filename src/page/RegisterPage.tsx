import React from "react";
import { Link } from "react-router-dom";
import "./LoginRegisterPage.scss";
import RegisterForm from "../component/RegisterForm";
import authenticationService from "./../authentication.service";

interface State {
    submitting: boolean;
    error: boolean;
}

class RegisterPage extends React.Component<{}, State> {
    readonly state: Readonly<State> = {
        submitting: false,
        error: false
    };

    componentDidMount() {
        document.title = "Register - PBBG";
    }

    render() {
        return <>
            <RegisterForm onSubmit={this.handleSubmit} submitting={this.state.submitting} error={this.state.error} />
            <Link to="/login" className="LoginRegisterPage-login-link">Existing user? Log in</Link>
        </>;
    }

    handleSubmit = (username: string, password: string) => {
        this.setState({ submitting: true });

        authenticationService.register(username, password)
            .catch(error => this.setState({ submitting: false, error: true }));
    };
}

export default RegisterPage;
