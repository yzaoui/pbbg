import * as RxJS from "rxjs";
import authHeader from "../helper/auth-header";
import handleResponse from "../helper/handle-response";
import * as BattleEndpoint from "./battle";
import jsonHeader from "../helper/json-header";

const battleService = {
    getBattle: () => RxJS.from(
        fetch("/api/battle/session", {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<BattleEndpoint.BattleResponse>(res)
        )
    ),
    generateBattle: () => RxJS.from(
        fetch("/api/battle/session?action=generate", {
            method: "POST",
            headers: authHeader()
        }).then(
            res => handleResponse<BattleEndpoint.BattleGenerateResponse>(res)
        )
    ),
    allyTurn: (req: BattleEndpoint.BattleAllyTurnRequest) => RxJS.from(
        fetch("/api/battle/allyTurn", {
            method: "POST",
            headers: { ...jsonHeader(), ...authHeader() },
            body: JSON.stringify(req)
        }).then(
            res => handleResponse<BattleEndpoint.BattleAllyTurnResponse>(res)
        )
    ),
    enemyTurn: () => RxJS.from(
        fetch("/api/battle/enemyTurn", {
            method: "POST",
            headers: authHeader()
        }).then(
            res => handleResponse<BattleEndpoint.BattleEnemyTurnResponse>(res)
        )
    )
};

export default battleService;
