import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { BaseItem, DexItems } from "../../backend/dex";
import dexService from "../../backend/dex.service";
import DexItemEntry from "../../component/dex/DexItemEntry";
import DexReturnLink from "../../component/dex/DexReturnLink";
import DexUnknownEntry from "../../component/dex/DexUnknownEntry";
import LoadingSpinner from "../../component/LoadingSpinner";
import DexItemDetailedPage from "./DexItemDetailedPage";
import "./DexSubpage.scss";

const DexItemsPage: React.FC = () => <Routes>
    <Route path="/" element={<IndexPage />} />
    <Route path="/:id" element={<DexItemDetailedPage />} />
</Routes>;

type State = {
    status: "loading";
} | {
    status: "error";
} | {
    status: "loaded";
    dexItems: DexItems;
};

const IndexPage: React.FC = () => {
    const [state, setState] = useState<State>({ status: "loading" });

    useEffect(() => {
        const subscription = dexService.getItems()
            .subscribe({
                next: value => setState({ status: "loaded", dexItems: value.data }),
                error: _err => setState({ status: "error" })
            });

        return () => subscription.unsubscribe();
    }, []);

    const renderContainer = () => {
        if (state.status === "loading") return <LoadingSpinner />;
        else if (state.status === "error") return "ERROR";

        const { discoveredItems, lastItemId } = state.dexItems;

        if (Object.entries(discoveredItems).length === 0) return "No items discovered yet.";

        const allEntries: Record<number, BaseItem | null> = {};
        for (let i = 1; i <= lastItemId; i++) {
            allEntries[i] = discoveredItems[i] || null;
        }

        return <>
            <title>Item Dex - PBBG</title>
            <ol className="dex">
                {Object.entries(allEntries)
                    .map(([id, item]) => (item !== null) ? <DexItemEntry key={id} id={id} item={item} /> : <DexUnknownEntry key={id} id={id} />)
                }
            </ol>
        </>;
    };

    return <>
        <DexReturnLink to="/dex" label="Return to Dex"/>
        <div className="dex-header"><h1>Item Dex</h1></div>
        <div className="dex-container">{renderContainer()}</div>
    </>;
};

export default DexItemsPage;
