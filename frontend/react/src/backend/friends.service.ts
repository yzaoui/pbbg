import handleResponse from "../helper/handle-response";
import * as FriendsEndpoint from "./friends";
import * as RxJS from "rxjs";
import { API_ROOT } from "../helper/const";
import authHeader from "../helper/auth-header";
import jsonHeader from "../helper/json-header";

const friendsService = {
    getFriends: () => RxJS.from(
        fetch(`${API_ROOT}/api/friends`, {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<FriendsEndpoint.FriendsResponse>(res)
        )
    ),
    changeFriendship: (action: "add-friend" | "remove-friend" | "accept-request" | "cancel-request", req: FriendsEndpoint.ChangeFriendshipRequest) => RxJS.from(
        fetch(`${API_ROOT}/api/friends/change-friendship?action=${action}`, {
            method: "POST",
            headers: { ...jsonHeader(), ...authHeader() },
            body: JSON.stringify(req)
        }).then(
            res => handleResponse<FriendsEndpoint.ChangeFriendshipResponse>(res)
        )
    )
};

export default friendsService;
