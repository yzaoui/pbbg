export interface Success<T> {
    status: "success";
    data: T;
}

export interface Fail {
    status: "fail";
    data: any;
}

export interface Error {
    status: "error";
    message: string;
    code?: number;
    data?: any;
}

export type Response<T> = Success<T> | Fail | Error;

export const isSuccess = <T> (res: Response<T>): res is Success<T> => res.status === "success";
export const isFail = <T> (res: Response<T>): res is Fail => res.status === "fail";
export const isError = <T> (res: Response<T>): res is Error => res.status === "error";
