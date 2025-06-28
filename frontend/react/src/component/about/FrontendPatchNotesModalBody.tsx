import React from "react";
import { Subscription } from "rxjs";
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

class FrontendPatchNotesModalBody extends React.Component<{}, State> {
    readonly state: Readonly<State> = {
        status: "loading"
    };

    private request: Subscription | null = null;

    componentDidMount() {
        this.request = aboutService.getFrontendPatchNotes().subscribe(res =>
            this.setState({ status: "loaded", patchNotes: res })
        );
    }

    componentWillUnmount() {
        this.request?.unsubscribe();
    }

    render() {
        return this.state.status === "loading" ?
            <LoadingSpinner />
        :
            <div dangerouslySetInnerHTML={patchNotesToHTML(this.state.patchNotes)} />;
    }
}

export default FrontendPatchNotesModalBody;
