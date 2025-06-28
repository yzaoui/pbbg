import React from "react";
import styles from "./PatchNotesModal.module.scss";
import classNames from "classnames";
import MicroModal from "react-micro-modal";
import { PatchNotes } from "../../backend/about";
import BackendPatchNotesModalBody from "./BackendPatchNotesModalBody";
import FrontendPatchNotesModalBody from "./FrontendPatchNotesModalBody";

type Props = {
    patchNotesOpen: "backend" | "frontend" | null;
    onClose: () => void;
};

interface LoadingState {
    status: "loading";
}

interface LoadedState {
    status: "loaded";
    patchNotes: PatchNotes;
}

type State = LoadingState | LoadedState;

class PatchNotesModal extends React.Component<Props> {
    readonly state: Readonly<State> = {
        status: "loading"
    };

    render() {
        return <MicroModal
            open={this.props.patchNotesOpen !== null}
            handleClose={this.props.onClose}
            children={handleClose =>
                <div className={styles.PatchNotesModal}>
                    <header>
                        <h1>
                            {this.props.patchNotesOpen === "backend" ?
                                "Server Patch Notes"
                            : this.props.patchNotesOpen === "frontend" ?
                                "Client Patch Notes"
                            : <></>}
                        </h1>
                    </header>
                    <main>
                        {this.props.patchNotesOpen === "backend" ?
                            <BackendPatchNotesModalBody />
                        : this.props.patchNotesOpen === "frontend" ?
                            <FrontendPatchNotesModalBody />
                        : <></>}
                    </main>
                    <footer>
                        <button className={classNames("fancy secondary")} onClick={handleClose}>Close</button>
                    </footer>
                </div>
            }
            overrides={{
                Dialog: {
                    style: { padding: "16px", maxWidth: "600px" }
                }
            }}
        />
    }
}

export default PatchNotesModal;
