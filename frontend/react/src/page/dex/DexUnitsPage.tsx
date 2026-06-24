import "./DexSubpage.scss";

import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import { DexUnits, MyUnitEnum } from "../../backend/dex";
import dexService from "../../backend/dex.service";
import DexReturnLink from "../../component/dex/DexReturnLink";
import DexUnitEntry from "../../component/dex/DexUnitEntry";
import DexUnknownEntry from "../../component/dex/DexUnknownEntry";
import LoadingSpinner from "../../component/LoadingSpinner";
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

const IndexPage: React.FC = () => {
    const [state, setState] = useState<State>({ status: "loading" });

    useEffect(() => {
        const subscription = dexService.getUnits()
            .subscribe({
                next: value => setState({ status: "loaded", dexUnits: value.data }),
                error: _err => setState({ status: "error" })
            });

        return () => subscription.unsubscribe();
    }, []);

    const renderContainer = () => {
        if (state.status === "loading") return <LoadingSpinner />;
        else if (state.status === "error") return "ERROR";

        const { discoveredUnits, lastUnitId } = state.dexUnits;

        const allEntries: Record<number, MyUnitEnum | null> = {};
        for (let i = 1; i <= lastUnitId; i++) {
            allEntries[i] = discoveredUnits[i] || null;
        }

        return <>
            <title>Unit Dex - PBBG</title>
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

    return <>
        <DexReturnLink to="/dex" label="Return to Dex" />
        <div className="dex-header"><h1>Unit Dex</h1></div>
        <div className="dex-container">{renderContainer()}</div>
    </>;
};

export default DexUnitsPage;
