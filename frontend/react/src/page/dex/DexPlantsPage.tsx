import React from "react";
import { Route, Routes } from "react-router-dom";
import { Subscription } from "rxjs";
import { DexPlants } from "../../backend/dex";
import dexService from "../../backend/dex.service";
import DexPlantEntry from "../../component/dex/DexPlantEntry";
import DexReturnLink from "../../component/dex/DexReturnLink";
import DexUnknownEntry from "../../component/dex/DexUnknownEntry";
import LoadingSpinner from "../../component/LoadingSpinner";
import { BasePlant } from "../../model/farm";
import DexPlantDetailedPage from "./DexPlantDetailedPage";
import "./DexSubpage.scss";

const DexPlantsPage: React.FC = () => <>
    <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/:id" element={<DexPlantDetailedPage />} />
    </Routes>
</>;

type State = {
    status: "loading";
} | {
    status: "error";
} | {
    status: "loaded";
    dexPlants: DexPlants;
};

class IndexPage extends React.Component<{}, State> {
    readonly state: Readonly<State> = {
        status: "loading"
    };

    request?: Subscription;

    componentDidMount() {
        this.request = dexService.getPlants()
            .subscribe({
                next: value => this.setState({ status: "loaded", dexPlants: value.data }),
                error: err => this.setState({ status: "error" })
            });
    }

    componentWillUnmount() {
        this.request && this.request.unsubscribe();
    }

    render() {
        return <>
            <DexReturnLink to="/dex" label="Return to Dex" />
            <div className="dex-header"><h1>Plant Dex</h1></div>
            <div className="dex-container">{this.renderContainer()}</div>
        </>;
    }

    renderContainer = () => {
        if (this.state.status === "loading") return <LoadingSpinner />;
        else if (this.state.status === "error") return "ERROR";

        const { discoveredPlants, lastPlantId } = this.state.dexPlants;

        const allEntries: Record<number, BasePlant | null> = {};
        for (let i = 1; i <= lastPlantId; i++) {
            allEntries[i] = discoveredPlants[i] || null;
        }

        return <>
            <title>Plant Dex - PBBG</title>
            <ol className="dex">
                {Object.entries(allEntries)
                    .map(([id, plant]) => (plant !== null) ?
                        <DexPlantEntry key={id} id={id} plant={plant} />
                    :
                        <DexUnknownEntry key={id} id={id} />
                    )}
            </ol>
        </>;
    };
}

export default DexPlantsPage;
