import React, { ChangeEventHandler, CSSProperties, FormEventHandler, useState } from "react";
import "./ChangePasswordForm.scss";
import { PASSWORD_REGEX } from "../../helper/const";
import LoadingSpinner from "../LoadingSpinner";

interface Props {
    onSubmit: (currentPassword: string, newPassword: string, confirmNewPassword: string) => void;
    submitting: boolean;
}

const ChangePasswordForm: React.FC<Props> = ({ onSubmit, submitting }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const handleCurrentPasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => setCurrentPassword(event.target.value);

    const handleNewPasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => setNewPassword(event.target.value);

    const handleConfirmNewPasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => setConfirmNewPassword(event.target.value);

    const readyToSubmit = (): boolean =>
        !submitting &&
        currentPassword !== "" &&
        newPassword !== ""
        && confirmNewPassword === newPassword;

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        onSubmit(currentPassword, newPassword, confirmNewPassword);
    };

    return <form className="ChangePasswordForm" onSubmit={handleSubmit}>
        <fieldset>
            <legend>Change Password</legend>
            <div>
                <label htmlFor="current-password">Current Password:</label>
                <input
                    type="password"
                    id="current-password"
                    autoComplete="current-password"
                    onChange={handleCurrentPasswordChange}
                    value={currentPassword}
                    disabled={submitting}
                    required
                />
            </div>
            <div>
                <label htmlFor="new-password">New Password:</label>
                <input
                    type="password"
                    id="new-password"
                    autoComplete="new-password"
                    onChange={handleNewPasswordChange}
                    value={newPassword}
                    pattern={PASSWORD_REGEX.pattern}
                    title={PASSWORD_REGEX.description}
                    disabled={submitting}
                    required
                />
            </div>
            <div>
                <label htmlFor="confirm-new-password">Confirm New Password:</label>
                <input
                    type="password"
                    id="confirm-new-password"
                    autoComplete="new-password"
                    onChange={handleConfirmNewPasswordChange}
                    value={confirmNewPassword}
                    disabled={submitting}
                    required
                />
            </div>
            <button className="fancy" type="submit" disabled={!readyToSubmit()}>
                <span>Save</span>
                {submitting &&
                    <LoadingSpinner style={loadingStyle} />
                }
            </button>
        </fieldset>
    </form>;
};

const loadingStyle: CSSProperties = {
    width: "14px",
    height: "14px",
    borderWidth: "3px",
    marginLeft: "5px"
};

export default ChangePasswordForm;
