import React, { CSSProperties } from "react";
import "./AboutPage.scss";
import aboutService from "../backend/about.service";
import { Subscription } from "rxjs";
import LoadingSpinner from "../component/LoadingSpinner";
import PatchNotesModal from "../component/about/PatchNotesModal";

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

class AboutPage extends React.Component<{}, State> {
    readonly state: Readonly<State> = {
        status: "loading",
        patchNotesOpen: null
    };

    private request: Subscription | null = null;

    componentDidMount() {
        document.title = "Farm - PBBG";

        this.request = aboutService.getBackendVersion().subscribe(res =>
            this.setState({
                status: "loaded",
                backendVersion: res.data,
                patchNotesOpen: null
            }));
    }

    componentWillUnmount() {
        this.request?.unsubscribe();
    }

    render() {
        return <div className="AboutPage">
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
                            <button onClick={this.handleFrontendPatchNotesOpen}>Patch notes</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Server version:
                        </td>
                        <td className="version">
                            {this.backendVersion()}
                        </td>
                        <td>
                            <button onClick={this.handleBackendPatchNotesOpen}>Patch notes</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <PatchNotesModal patchNotesOpen={this.state.patchNotesOpen} onClose={this.handlePatchNotesClose} />
        </div>;
    }

    private backendVersion = () => {
        switch (this.state.status) {
            case "loading":
                return <LoadingSpinner style={loadingStyle} />;
            case "loaded":
                return <span className="version">{this.state.backendVersion}</span>;
        }
    }

    private handleFrontendPatchNotesOpen = () => {
        this.setState({ patchNotesOpen: "frontend" });
    }

    private handleBackendPatchNotesOpen = () => {
        this.setState({ patchNotesOpen: "backend" });
    }

    private handlePatchNotesClose = () => {
        this.setState({ patchNotesOpen: null });
    }
}

const loadingStyle: CSSProperties = {
    width: "18px",
    height: "18px",
    borderWidth: "4px"
};

export default AboutPage;
