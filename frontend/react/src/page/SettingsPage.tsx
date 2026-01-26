import React, { useRef, useState } from "react";
import { Subscription } from "rxjs";
import ChangePasswordForm from "../component/settings/ChangePasswordForm";
import VolumeSetting from "../component/settings/VolumeSetting";
import settingsService from "../backend/settings.service";

interface State {
    submittingChangePassword: boolean;
}

const SettingsPage: React.FC = () => {
    const [state, setState] = useState<State>({ submittingChangePassword: false });
    const changePasswordRequestRef = useRef<Subscription | null>(null);

    const handleChangePasswordSubmit = (currentPassword: string, newPassword: string, confirmNewPassword: string) => {
        changePasswordRequestRef.current?.unsubscribe();
        setState({ submittingChangePassword: true });

        changePasswordRequestRef.current = settingsService.changePassword({ currentPassword, newPassword, confirmNewPassword })
            .subscribe({
                next: _value => setState({ submittingChangePassword: false }),
                error: _err => setState({ submittingChangePassword: false })
            });
    };

    return <>
        <title>Settings - PBBG</title>
        <ChangePasswordForm onSubmit={handleChangePasswordSubmit} submitting={state.submittingChangePassword} />
        <VolumeSetting />
    </>;
};

export default SettingsPage;
