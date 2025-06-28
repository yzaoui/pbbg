import React from "react";
import ChangePasswordForm from "../component/settings/ChangePasswordForm";
import VolumeSetting from "../component/settings/VolumeSetting";
import settingsService from "../backend/settings.service";

interface State {
    submittingChangePassword: boolean;
}

class SettingsPage extends React.Component<{}, State> {
    readonly state: Readonly<State> = {
        submittingChangePassword: false
    };

    componentDidMount() {
        document.title = "Settings - PBBG";
    }

    render() {
        return <>
            <ChangePasswordForm onSubmit={this.handleChangePasswordSubmit} submitting={this.state.submittingChangePassword} />
            <VolumeSetting />
        </>;
    }

    handleChangePasswordSubmit = (currentPassword: string, newPassword: string, confirmNewPassword: string) => {
        this.setState({ submittingChangePassword: true });

        settingsService.changePassword( { currentPassword, newPassword, confirmNewPassword })
            .subscribe({
                next: value => this.setState({ submittingChangePassword: false }),
                error: err => this.setState({ submittingChangePassword: false })
            });
    };
}

export default SettingsPage;
