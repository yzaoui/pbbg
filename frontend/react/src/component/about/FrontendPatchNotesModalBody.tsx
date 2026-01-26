import React, { useEffect, useState } from "react";
import aboutService from "../../backend/about.service";
import LoadingSpinner from "../LoadingSpinner";
import { PatchNotes } from "../../backend/about";
import { patchNotesToHTML } from "../../helper/patch-notes";

interface LoadingState {
    status: "loading";
}

interface LoadedState {
    status: "loaded";
    patchNotes: PatchNotes;
}

type State = LoadingState | LoadedState;

const FrontendPatchNotesModalBody: React.FC = () => {
    const [state, setState] = useState<State>({ status: "loading" });

    useEffect(() => {
        const subscription = aboutService.getFrontendPatchNotes().subscribe(res =>
            setState({ status: "loaded", patchNotes: res })
        );

        return () => subscription.unsubscribe();
    }, []);

    return state.status === "loading" ?
        <LoadingSpinner />
    :
        <div dangerouslySetInnerHTML={patchNotesToHTML(state.patchNotes)} />;
};

export default FrontendPatchNotesModalBody;
