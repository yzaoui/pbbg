import * as RxJS from "rxjs";
import * as FarmEndpoint from "./farm";
import { API_ROOT } from "../helper/const";
import authHeader from "../helper/auth-header";
import handleResponse from "../helper/handle-response";
import jsonHeader from "../helper/json-header";

const farmService = {
    getPlots: () => RxJS.from(
        fetch(`${API_ROOT}/api/farm/plots`, {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<FarmEndpoint.PlotsResponse>(res)
        )
    ),
    plant: (req: FarmEndpoint.PlantRequest) => RxJS.from(
        fetch(`${API_ROOT}/api/farm/plant`, {
            method: "POST",
            headers: {...jsonHeader(), ...authHeader()},
            body: JSON.stringify(req)
        }).then(
            res => handleResponse<FarmEndpoint.PlantResponse>(res)
        )
    ),
    harvest: (req: FarmEndpoint.HarvestRequest) => RxJS.from(
        fetch(`${API_ROOT}/api/farm/harvest`, {
            method: "POST",
            headers: {...jsonHeader(), ...authHeader()},
            body: JSON.stringify(req)
        }).then(
            res => handleResponse<FarmEndpoint.HarvestResponse>(res)
        )
    ),
    expand: () => RxJS.from(
        fetch(`${API_ROOT}/api/farm/expand`, {
            method: "POST",
            headers: authHeader(),
        }).then(
            res => handleResponse<FarmEndpoint.ExpandResponse>(res)
        )
    ),
    reorder: (req: FarmEndpoint.ReorderRequest) => RxJS.from(
        fetch(`${API_ROOT}/api/farm/reorder`, {
            method: "POST",
            headers: {...jsonHeader(), ...authHeader()},
            body: JSON.stringify(req)
        }).then(
            res => handleResponse<FarmEndpoint.ReorderResponse>(res)
        )
    )
};

export default farmService;
