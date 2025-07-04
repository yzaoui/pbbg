import * as RxJS from "rxjs";
import authHeader from "../helper/auth-header";
import handleResponse from "../helper/handle-response";
import * as SettingsEndpoint from "./settings";
import jsonHeader from "../helper/json-header";

const settingsService = {
    changePassword: (req: SettingsEndpoint.ChangePasswordRequest) => RxJS.from(
        fetch("/api/settings/change-password", {
            method: "POST",
            headers: { ...jsonHeader(), ...authHeader() },
            body: JSON.stringify(req)
        }).then(
            res => handleResponse<SettingsEndpoint.ChangePasswordResponse>(res)
        )
    )
};

export default settingsService;
