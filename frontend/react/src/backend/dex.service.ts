import authHeader from "../helper/auth-header";
import handleResponse from "../helper/handle-response";
import * as DexEndpoint from "./dex";
import * as RxJS from "rxjs";

const dexService = {
    getUnits: () => RxJS.from(
        fetch("/api/dex/units", {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<DexEndpoint.UnitsResponse>(res)
        )
    ),
    getUnit: (id: string) => RxJS.from(
        fetch(`/api/dex/units/${id}`, {
            method: "GET",
            headers: authHeader(),
        }).then(
            res => handleResponse<DexEndpoint.UnitIndividualResponse>(res)
        )
    ),
    getItems: () => RxJS.from(
        fetch("/api/dex/items", {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<DexEndpoint.ItemsResponse>(res)
        )
    ),
    getItem: (id: string) => RxJS.from(
        fetch(`/api/dex/items/${id}`, {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<DexEndpoint.ItemIndividualResponse>(res)
        )
    ),
    getPlants: () => RxJS.from(
        fetch("/api/dex/plants", {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<DexEndpoint.PlantsResponse>(res)
        )
    ),
    getPlant: (id: string) => RxJS.from(
        fetch(`/api/dex/plants/${id}`, {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<DexEndpoint.PlantIndividualResponse>(res)
        )
    )
};

export default dexService;
