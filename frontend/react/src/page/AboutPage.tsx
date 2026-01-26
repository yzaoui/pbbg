import React, { CSSProperties, useEffect, useState } from "react";
import aboutService from "../backend/about.service";
import LoadingSpinner from "../component/LoadingSpinner";
import PatchNotesModal from "../component/about/PatchNotesModal";
import "./AboutPage.scss";

interface LoadingState {
    status: "loading";
}

interface LoadedState {
    status: "loaded";
    backendVersion: string;
}

type State = (LoadingState | LoadedState) & {
    patchNotesOpen: "backend" | "frontend" | null;
};

const AboutPage: React.FC = () => {
    const [state, setState] = useState<State>({ status: "loading", patchNotesOpen: null });

    useEffect(() => {
        const subscription = aboutService.getBackendVersion().subscribe(res =>
            setState({
                status: "loaded",
                backendVersion: res.data,
                patchNotesOpen: null
            }));

        return () => subscription.unsubscribe();
    }, []);

    const backendVersion = () => {
        switch (state.status) {
            case "loading":
                return <LoadingSpinner style={loadingStyle} />;
            case "loaded":
                return <span className="version">{state.backendVersion}</span>;
        }
    };

    const handleFrontendPatchNotesOpen = () => {
        setState(prev => ({ ...prev, patchNotesOpen: "frontend" }));
    };

    const handleBackendPatchNotesOpen = () => {
        setState(prev => ({ ...prev, patchNotesOpen: "backend" }));
    };

    const handlePatchNotesClose = () => {
        setState(prev => ({ ...prev, patchNotesOpen: null }));
    };

    return <div className="AboutPage">
        <title>About - PBBG</title>
        <table>
            <tbody>
                <tr>
                    <td>
                        Client version:
                    </td>
                    <td className="version">
                        {aboutService.getFrontendVersion()}
                    </td>
                    <td>
                        <button onClick={handleFrontendPatchNotesOpen}>Patch notes</button>
                    </td>
                </tr>
                <tr>
                    <td>
                        Server version:
                    </td>
                    <td className="version">
                        {backendVersion()}
                    </td>
                    <td>
                        <button onClick={handleBackendPatchNotesOpen}>Patch notes</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <PatchNotesModal patchNotesOpen={state.patchNotesOpen} onClose={handlePatchNotesClose} />
    </div>;
};

const loadingStyle: CSSProperties = {
    width: "18px",
    height: "18px",
    borderWidth: "4px"
};

export default AboutPage;
