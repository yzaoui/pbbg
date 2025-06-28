import authenticationService from "../authentication.service";
import * as JSend from "./../JSend";

/**
 * Handles responses by either passing along the successful and JSON-parsed response,
 * or rejects the promise and optionally log out when 401 or 403.
 */
const handleResponse = <T> (res: Response): Promise<JSend.Success<T>> => res
    .text()
    .then(text => {
        if (res.ok) {
            return JSON.parse(text);
        } else {
            if (res.status === 401 || res.status === 403) {
                authenticationService.logout();
                window.location.reload();
            }

            return Promise.reject();
        }
    });

export default handleResponse;
