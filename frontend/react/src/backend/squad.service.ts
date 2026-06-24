import * as RxJS from "rxjs";

import authHeader from "../helper/auth-header";
import handleResponse from "../helper/handle-response";
import * as SquadEndpoint from "./squad";

const squadService = {
    getSquad: () => RxJS.from(
        fetch("/api/squad", {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<SquadEndpoint.SquadResponse>(res)
        )
    ),
    healSquad: () => RxJS.from(
        fetch("/api/squad/heal", {
            method: "POST",
            headers: authHeader()
        }).then(
            res => handleResponse<SquadEndpoint.SquadResponse>(res)
        )
    )
};

export default squadService;
