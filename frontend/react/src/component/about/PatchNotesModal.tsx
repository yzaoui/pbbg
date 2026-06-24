import classNames from "classnames";
import React from "react";
import MicroModal from "react-micro-modal";

import BackendPatchNotesModalBody from "./BackendPatchNotesModalBody";
import FrontendPatchNotesModalBody from "./FrontendPatchNotesModalBody";
import styles from "./PatchNotesModal.module.scss";

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
                style: {
                    padding: 0,
                    maxWidth: "600px",
                    backgroundColor: "var(--color-surface-secondary)",
                    color: "var(--color-text)",
                    border: "2px solid var(--color-border-primary)"
                }
            },
            Overlay: {
                style: {
                    backgroundColor: "var(--color-overlay-dark)"
                }
            }
        }}
    />;
};

export default PatchNotesModal;
