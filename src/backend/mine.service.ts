import authHeader from "../helper/auth-header";
import jsonHeader from "../helper/json-header";
import handleResponse from "../helper/handle-response";
import * as MineEndpoint from "./mine";
import * as RxJS from "rxjs";
import { API_ROOT } from "../helper/const";

const mineService = {
    getMine: () => RxJS.from(
        fetch(`${API_ROOT}/api/mine`, {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<MineEndpoint.MineResponse>(res)
        )
    ),
    getMineTypes: () => RxJS.from(
        fetch(`${API_ROOT}/api/mine/types`, {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<MineEndpoint.MineTypesResponse>(res)
        )
    ),
    enterMine: (req: MineEndpoint.MineEnterRequest) => RxJS.from(
        fetch(`${API_ROOT}/api/mine/generate`, {
            method: "POST",
            headers: { ...jsonHeader(), ...authHeader() },
            body: JSON.stringify(req)
        }).then(
            res => handleResponse<MineEndpoint.MineEnterResponse>(res)
        )
    ),
    exitMine: () => RxJS.from(
        fetch(`${API_ROOT}/api/mine/exit`, {
            method: "POST",
            headers: { ...jsonHeader(), ...authHeader() }
        }).then(
            res => handleResponse<MineEndpoint.MineExitResponse>(res)
        )
    ),
    performMineAction: (req: MineEndpoint.MineActionRequest) => RxJS.from(
        fetch(`${API_ROOT}/api/mine/perform`, {
            method: "POST",
            headers: { ...jsonHeader(), ...authHeader() },
            body: JSON.stringify(req)
        }).then(
            res => handleResponse<MineEndpoint.MineActionResponse>(res)
        )
    )
};

export default mineService;
