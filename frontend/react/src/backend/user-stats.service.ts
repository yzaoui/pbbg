import * as RxJS from "rxjs";

import authHeader from "../helper/auth-header";
import handleResponse from "../helper/handle-response";
import * as UserStatsEndpoint from "./user-stats";

const userStatsService = {
    get: () => RxJS.from(
        fetch("/api/user-stats", {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<UserStatsEndpoint.UserStatsResponse>(res)
        )
    )
};

export default userStatsService;
