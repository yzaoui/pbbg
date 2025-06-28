import authHeader from "../helper/auth-header";
import handleResponse from "../helper/handle-response";
import * as SquadEndpoint from "./squad";
import * as RxJS from "rxjs";
import { API_ROOT } from "../helper/const";

const squadService = {
    getSquad: () => RxJS.from(
        fetch(`${API_ROOT}/api/squad`, {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<SquadEndpoint.SquadResponse>(res)
        )
    ),
    healSquad: () => RxJS.from(
        fetch(`${API_ROOT}/api/squad/heal`, {
            method: "POST",
            headers: authHeader()
        }).then(
            res => handleResponse<SquadEndpoint.SquadResponse>(res)
        )
    )
};

export default squadService;
