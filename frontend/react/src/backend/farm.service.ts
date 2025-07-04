import * as RxJS from "rxjs";
import * as FarmEndpoint from "./farm";
import authHeader from "../helper/auth-header";
import handleResponse from "../helper/handle-response";
import jsonHeader from "../helper/json-header";

const farmService = {
    getPlots: () => RxJS.from(
        fetch("/api/farm/plots", {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<FarmEndpoint.PlotsResponse>(res)
        )
    ),
    plant: (req: FarmEndpoint.PlantRequest) => RxJS.from(
        fetch("/api/farm/plant", {
            method: "POST",
            headers: {...jsonHeader(), ...authHeader()},
            body: JSON.stringify(req)
        }).then(
            res => handleResponse<FarmEndpoint.PlantResponse>(res)
        )
    ),
    harvest: (req: FarmEndpoint.HarvestRequest) => RxJS.from(
        fetch("/api/farm/harvest", {
            method: "POST",
            headers: {...jsonHeader(), ...authHeader()},
            body: JSON.stringify(req)
        }).then(
            res => handleResponse<FarmEndpoint.HarvestResponse>(res)
        )
    ),
    expand: () => RxJS.from(
        fetch("/api/farm/expand", {
            method: "POST",
            headers: authHeader(),
        }).then(
            res => handleResponse<FarmEndpoint.ExpandResponse>(res)
        )
    ),
    reorder: (req: FarmEndpoint.ReorderRequest) => RxJS.from(
        fetch("/api/farm/reorder", {
            method: "POST",
            headers: {...jsonHeader(), ...authHeader()},
            body: JSON.stringify(req)
        }).then(
            res => handleResponse<FarmEndpoint.ReorderResponse>(res)
        )
    )
};

export default farmService;
