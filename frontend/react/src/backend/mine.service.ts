import * as RxJS from "rxjs";

import authHeader from "../helper/auth-header";
import handleResponse from "../helper/handle-response";
import jsonHeader from "../helper/json-header";
import * as MineEndpoint from "./mine";

const mineService = {
    getMine: () => RxJS.from(
        fetch("/api/mine", {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<MineEndpoint.MineResponse>(res)
        )
    ),
    getMineTypes: () => RxJS.from(
        fetch("/api/mine/types", {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<MineEndpoint.MineTypesResponse>(res)
        )
    ),
    enterMine: (req: MineEndpoint.MineEnterRequest) => RxJS.from(
        fetch("/api/mine/generate", {
            method: "POST",
            headers: { ...jsonHeader(), ...authHeader() },
            body: JSON.stringify(req)
        }).then(
            res => handleResponse<MineEndpoint.MineEnterResponse>(res)
        )
    ),
    exitMine: () => RxJS.from(
        fetch("/api/mine/exit", {
            method: "POST",
            headers: { ...jsonHeader(), ...authHeader() }
        }).then(
            res => handleResponse<MineEndpoint.MineExitResponse>(res)
        )
    ),
    performMineAction: (req: MineEndpoint.MineActionRequest) => RxJS.from(
        fetch("/api/mine/perform", {
            method: "POST",
            headers: { ...jsonHeader(), ...authHeader() },
            body: JSON.stringify(req)
        }).then(
            res => handleResponse<MineEndpoint.MineActionResponse>(res)
        )
    )
};

export default mineService;
