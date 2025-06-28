import authHeader from "../helper/auth-header";
import handleResponse from "../helper/handle-response";
import * as UserStatsEndpoint from "./user-stats";
import * as RxJS from "rxjs";
import { API_ROOT } from "../helper/const";

const userStatsService = {
    get: () => RxJS.from(
        fetch(`${API_ROOT}/api/user-stats`, {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<UserStatsEndpoint.UserStatsResponse>(res)
        )
    )
};

export default userStatsService;
