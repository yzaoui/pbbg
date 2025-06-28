import * as RxJS from "rxjs";
import { API_ROOT } from "../helper/const";
import authHeader from "../helper/auth-header";
import handleResponse from "../helper/handle-response";
import * as MarketEndpoint from "./market";
import jsonHeader from "../helper/json-header";

const marketService = {
    getMarkets: () => RxJS.from(
        fetch(`${API_ROOT}/api/market`, {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<MarketEndpoint.MarketResponse>(res)
        )
    ),
    buy: (req: MarketEndpoint.BuyRequest) => RxJS.from(
        fetch(`${API_ROOT}/api/market/buy`, {
            method: "POST",
            headers: { ...jsonHeader(), ...authHeader() },
            body: JSON.stringify(req)
        }).then(
            res => handleResponse<MarketEndpoint.BuyResponse>(res)
        )
    ),
    sell: (req: MarketEndpoint.SellRequest) => RxJS.from(
        fetch(`${API_ROOT}/api/market/sell`, {
            method: "POST",
            headers: { ...jsonHeader(), ...authHeader() },
            body: JSON.stringify(req)
        }).then(
            res => handleResponse<MarketEndpoint.SellResponse>(res)
        )
    )
};

export default marketService;
