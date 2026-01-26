import React, { useEffect, useState } from "react";
import { PatchNotes } from "../../backend/about";
import aboutService from "../../backend/about.service";
import { patchNotesToHTML } from "../../helper/patch-notes";
import LoadingSpinner from "../LoadingSpinner";

interface LoadingState {
    status: "loading";
}

interface LoadedState {
    status: "loaded";
    patchNotes: PatchNotes;
}

type State = LoadingState | LoadedState;

const BackendPatchNotesModalBody: React.FC = () => {
    const [state, setState] = useState<State>({ status: "loading" });

    useEffect(() => {
        const subscription = aboutService.getBackendPatchNotes().subscribe(res =>
            setState({ status: "loaded", patchNotes: res.data })
        );

        return () => subscription.unsubscribe();
    }, []);

    return state.status === "loading" ?
        <LoadingSpinner />
    :
        <div dangerouslySetInnerHTML={patchNotesToHTML(state.patchNotes)} />;
};

export default BackendPatchNotesModalBody;
