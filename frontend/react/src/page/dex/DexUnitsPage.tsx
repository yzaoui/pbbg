import React from "react";
import { Helmet } from "react-helmet-async";
import { Route, Routes } from "react-router-dom";
import { Subscription } from "rxjs";
import { DexUnits, MyUnitEnum } from "../../backend/dex";
import dexService from "../../backend/dex.service";
import DexReturnLink from "../../component/dex/DexReturnLink";
import DexUnitEntry from "../../component/dex/DexUnitEntry";
import DexUnknownEntry from "../../component/dex/DexUnknownEntry";
import LoadingSpinner from "../../component/LoadingSpinner";
import "./DexSubpage.scss";
import DexUnitDetailedPage from "./DexUnitDetailedPage";

const DexUnitsPage: React.FC = () => <Routes>
    <Route path="/" element={<IndexPage />} />
    <Route path="/:id" element={<DexUnitDetailedPage />} />
</Routes>;

type State = {
    status: "loading";
} | {
    status: "error";
} | {
    status: "loaded";
    dexUnits: DexUnits;
};

class IndexPage extends React.Component<{}, State> {
    readonly state: Readonly<State> = {
        status: "loading"
    };

    request?: Subscription;

    componentDidMount() {
        this.request = dexService.getUnits()
            .subscribe({
                next: value => this.setState({ status: "loaded", dexUnits: value.data }),
                error: err => this.setState({ status: "error" })
            });
    }

    componentWillUnmount() {
        this.request && this.request.unsubscribe();
    }

    render() {
        return <>
            <DexReturnLink to="/dex" label="Return to Dex" />
            <div className="dex-header"><h1>Unit Dex</h1></div>
            <div className="dex-container">{this.renderContainer()}</div>
        </>;
    }

    renderContainer = () => {
        if (this.state.status === "loading") return <LoadingSpinner />;
        else if (this.state.status === "error") return "ERROR";

        const { discoveredUnits, lastUnitId } = this.state.dexUnits;

        const allEntries: Record<number, MyUnitEnum | null> = {};
        for (let i = 1; i <= lastUnitId; i++) {
            allEntries[i] = discoveredUnits[i] || null;
        }

        return <>
            <Helmet title="Unit Dex - PBBG" />
            <ol className="dex">
                {Object.entries(allEntries)
                    .map(([id, unit]) => (unit !== null) ?
                        <DexUnitEntry key={id} id={id} unit={unit} />
                    :
                        <DexUnknownEntry key={id} id={id} />
                    )}
            </ol>
        </>;
    };
}

export default DexUnitsPage;
