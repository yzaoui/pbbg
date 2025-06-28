import authHeader from "../helper/auth-header";
import jsonHeader from "../helper/json-header";
import handleResponse from "../helper/handle-response";
import * as InventoryEndpoint from "../backend/inventory";
import * as RxJS from "rxjs";
import { API_ROOT } from "../helper/const";

const inventoryService = {
    getInventory: (filter?: "plantable") => {
        const url = new URL(`${API_ROOT}/api/inventory`);

        if (filter !== undefined) url.searchParams.append("filter", filter);

        return RxJS.from(
            fetch(url.toString(), {
                method: "GET",
                headers: authHeader()
            }).then(
                res => handleResponse<InventoryEndpoint.InventoryResponse>(res)
            )
        )
    },
    equipUnequip: (action: "equip" | "unequip", req: InventoryEndpoint.EquipUnequipRequest) => RxJS.from(
        fetch(`${API_ROOT}/api/inventory/equipment?action=${action}`, {
            method: "POST",
            headers: { ...jsonHeader(), ...authHeader() },
            body: JSON.stringify(req)
        }).then(
            res => handleResponse<InventoryEndpoint.InventoryResponse>(res)
        )
    )
};

export default inventoryService;
