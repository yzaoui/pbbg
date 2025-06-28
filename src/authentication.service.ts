import { BehaviorSubject } from "rxjs";
import handleResponse from "./helper/handle-response";
import * as LoginRegisterEndpoint from "./backend/loginregister";
import { API_ROOT } from "./helper/const";

const CURRENT_USER_KEY = "currentUser";

const currentUserSubject = new BehaviorSubject(localStorage.getItem(CURRENT_USER_KEY));

const authenticationService = {
    register: (username: string, password: string): Promise<string> => fetchRegisterLogin("register", { username, password }),
    login: (username: string, password: string): Promise<string> => fetchRegisterLogin("login", { username, password }),
    logout: () => {
        localStorage.removeItem(CURRENT_USER_KEY);
        currentUserSubject.next(null);
    },
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() {
        return currentUserSubject.value;
    }
};

const fetchRegisterLogin = (route: "register" | "login", req: LoginRegisterEndpoint.Request) => fetch(`${API_ROOT}/api/${route}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req)
}).then(
    res => handleResponse<LoginRegisterEndpoint.Response>(res)
).then(tokenRes => {
    const token = tokenRes.data.token;

    localStorage.setItem(CURRENT_USER_KEY, token);
    currentUserSubject.next(token);

    return token;
});

export default authenticationService;
