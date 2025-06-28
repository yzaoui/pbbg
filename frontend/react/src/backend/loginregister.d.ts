/**
 * For /login and /register APIs.
 */

export interface Request {
    username: string;
    password: string;
}

export interface Response {
    token: string;
}
