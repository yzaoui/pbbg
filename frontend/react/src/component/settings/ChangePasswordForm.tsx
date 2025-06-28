import React, { ChangeEventHandler, CSSProperties, FormEventHandler } from "react";
import "./ChangePasswordForm.scss"
import { PASSWORD_REGEX } from "../../helper/const";
import LoadingSpinner from "../LoadingSpinner";

interface Props {
    onSubmit: (currentPassword: string, newPassword: string, confirmNewPassword: string) => void;
    submitting: boolean;
}

interface State {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

class ChangePasswordForm extends React.Component<Props, State> {
    readonly state: Readonly<State> = {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    };

    render() {
        return <form className="ChangePasswordForm" onSubmit={this.handleSubmit}>
            <fieldset>
                <legend>Change Password</legend>
                <div>
                    <label htmlFor="current-password">Current Password:</label>
                    <input
                        type="password"
                        id="current-password"
                        autoComplete="current-password"
                        onChange={this.handleCurrentPasswordChange}
                        value={this.state.currentPassword}
                        disabled={this.props.submitting}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="new-password">New Password:</label>
                    <input
                        type="password"
                        id="new-password"
                        autoComplete="new-password"
                        onChange={this.handleNewPasswordChange}
                        value={this.state.newPassword}
                        pattern={PASSWORD_REGEX.pattern}
                        title={PASSWORD_REGEX.description}
                        disabled={this.props.submitting}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirm-new-password">Confirm New Password:</label>
                    <input
                        type="password"
                        id="confirm-new-password"
                        autoComplete="new-password"
                        onChange={this.handleConfirmNewPasswordChange}
                        value={this.state.confirmNewPassword}
                        disabled={this.props.submitting}
                        required
                    />
                </div>
                <button className="fancy" type="submit" disabled={!this.readyToSubmit()}>
                    <span>Save</span>
                    {this.props.submitting &&
                        <LoadingSpinner style={loadingStyle} />
                    }
                </button>
            </fieldset>
        </form>;
    }

    handleCurrentPasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => this.setState({ currentPassword: event.target.value });

    handleNewPasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => this.setState({ newPassword: event.target.value });

    handleConfirmNewPasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => this.setState({ confirmNewPassword: event.target.value });

    readyToSubmit = (): boolean =>
        !this.props.submitting &&
        this.state.currentPassword !== "" &&
        this.state.newPassword !== ""
        && this.state.confirmNewPassword === this.state.newPassword;

    handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.state.currentPassword, this.state.newPassword, this.state.confirmNewPassword);
    };
}

const loadingStyle: CSSProperties = {
    width: "14px",
    height: "14px",
    borderWidth: "3px",
    marginLeft: "5px"
};

export default ChangePasswordForm;
