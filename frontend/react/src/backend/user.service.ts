import handleResponse from "../helper/handle-response";
import * as UserEndpoint from "./user";
import * as RxJS from "rxjs";
import authHeader from "../helper/auth-header";

const userService = {
    getUserProfile: (userId: string) => RxJS.from(
        fetch(`/api/user/${userId}`, {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<UserEndpoint.UserResponse>(res)
        )
    ),
    searchUser: (text: string) => RxJS.from(
        fetch(`/api/user/search?${new URLSearchParams({ text: text })}`, {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<UserEndpoint.UserSearchResponse>(res)
        )
    )
};

export default userService;
