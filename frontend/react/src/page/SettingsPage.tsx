import React, { useRef, useState } from "react";
import { Subscription } from "rxjs";

import settingsService from "../backend/settings.service";
import ChangePasswordForm from "../component/settings/ChangePasswordForm";
import VolumeSetting from "../component/settings/VolumeSetting";
import { useTheme } from "../context/ThemeContext";
import { getAvailableThemes, ThemeStyle } from "../styles/themeRegistry";

interface State {
    submittingChangePassword: boolean;
}

const SettingsPage: React.FC = () => {
    const [state, setState] = useState<State>({ submittingChangePassword: false });
    const changePasswordRequestRef = useRef<Subscription | null>(null);
    const { theme, colorScheme, setTheme, toggleColorScheme } = useTheme();

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

        <fieldset>
            <legend>Theme</legend>
            <div>
                <label htmlFor="color-scheme-toggle">Color Scheme:</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
                    <button
                        onClick={toggleColorScheme}
                        className="fancy"
                        style={{ padding: "6px 12px", fontSize: "14px" }}
                        >
                        {colorScheme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                    </button>
                    <span>{colorScheme === "light" ? "Light Mode" : "Dark Mode"}</span>
                </div>
            </div>
            <div style={{ marginTop: "10px" }}>
                <label htmlFor="theme-style-select">Theme Style: </label>
                <select
                    id="theme-style-select"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as ThemeStyle)}
                >
                    {getAvailableThemes().map((themeOption) => (
                        <option
                            key={themeOption.id}
                            value={themeOption.id}
                        >
                            {themeOption.label}
                        </option>
                    ))}
                </select>
            </div>
        </fieldset>

        <ChangePasswordForm onSubmit={handleChangePasswordSubmit} submitting={state.submittingChangePassword} />
        <VolumeSetting />
    </>;
};

export default SettingsPage;
