import "./DexSubpage.scss";

import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import { DexPlants } from "../../backend/dex";
import dexService from "../../backend/dex.service";
import DexPlantEntry from "../../component/dex/DexPlantEntry";
import DexReturnLink from "../../component/dex/DexReturnLink";
import DexUnknownEntry from "../../component/dex/DexUnknownEntry";
import LoadingSpinner from "../../component/LoadingSpinner";
import { BasePlant } from "../../model/farm";
import DexPlantDetailedPage from "./DexPlantDetailedPage";

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

const IndexPage: React.FC = () => {
    const [state, setState] = useState<State>({ status: "loading" });

    useEffect(() => {
        const subscription = dexService.getPlants()
            .subscribe({
                next: value => setState({ status: "loaded", dexPlants: value.data }),
                error: _err => setState({ status: "error" })
            });

        return () => subscription.unsubscribe();
    }, []);

    const renderContainer = () => {
        if (state.status === "loading") return <LoadingSpinner />;
        else if (state.status === "error") return "ERROR";

        const { discoveredPlants, lastPlantId } = state.dexPlants;

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

    return <>
        <DexReturnLink to="/dex" label="Return to Dex" />
        <div className="dex-header"><h1>Plant Dex</h1></div>
        <div className="dex-container">{renderContainer()}</div>
    </>;
};

export default DexPlantsPage;
