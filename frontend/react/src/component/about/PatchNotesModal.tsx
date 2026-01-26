import React from "react";
import classNames from "classnames";
import MicroModal from "react-micro-modal";
import styles from "./PatchNotesModal.module.scss";
import BackendPatchNotesModalBody from "./BackendPatchNotesModalBody";
import FrontendPatchNotesModalBody from "./FrontendPatchNotesModalBody";

type Props = {
    patchNotesOpen: "backend" | "frontend" | null;
    onClose: () => void;
};

const PatchNotesModal: React.FC<Props> = ({ patchNotesOpen, onClose }) => {
    return <MicroModal
        open={patchNotesOpen !== null}
        handleClose={onClose}
        children={handleClose =>
            <div className={styles.PatchNotesModal}>
                <header>
                    <h1>
                        {patchNotesOpen === "backend" ?
                            "Server Patch Notes"
                        : patchNotesOpen === "frontend" ?
                            "Client Patch Notes"
                        : <></>}
                    </h1>
                </header>
                <main>
                    {patchNotesOpen === "backend" ?
                        <BackendPatchNotesModalBody />
                    : patchNotesOpen === "frontend" ?
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
    />;
};

export default PatchNotesModal;
