import * as RxJS from "rxjs";
import { API_ROOT, APP_VERSIONS } from "../helper/const";
import authHeader from "../helper/auth-header";
import handleResponse from "../helper/handle-response";
import * as AboutEndpoint from "./about";

const aboutService = {
    getFrontendVersion: () => APP_VERSIONS[0],
    getFrontendPatchNotes: () => RxJS.from(
        // Get all patch note markdown files from /patch-notes directory
        Promise.all(
            [...APP_VERSIONS].reverse().map(ver => fetch((new URL(`../patch-notes/${ver}.md`, import.meta.url)).href).then(res => res.text()))
        )
    ),
    getBackendVersion: () => RxJS.from(
        fetch(`${API_ROOT}/api/about/version`, {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<AboutEndpoint.BackendVersionResponse>(res)
        )
    ),
    getBackendPatchNotes: () => RxJS.from(
        fetch(`${API_ROOT}/api/about/patch-notes`, {
            method: "GET",
            headers: authHeader()
        }).then(
            res => handleResponse<AboutEndpoint.PatchNotesResponse>(res)
        )
    )
};

export default aboutService;
