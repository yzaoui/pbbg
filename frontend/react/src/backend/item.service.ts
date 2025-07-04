import handleResponse from "../helper/handle-response";
import * as RxJS from "rxjs";
import * as ItemEndpoint from "./item";

const itemService = {
    getItem: (itemId: string) => RxJS.from(
        fetch(`/api/item/${itemId}`, {
            method: "GET",
        }).then(
            res => handleResponse<ItemEndpoint.ItemResponse>(res)
        )
    )
};

export default itemService;
