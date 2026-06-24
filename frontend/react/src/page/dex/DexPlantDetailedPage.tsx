import "./DexDetailedPage.scss";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import dexService from "../../backend/dex.service";
import DexReturnLink from "../../component/dex/DexReturnLink";
import PlantPreview from "../../component/farm/PlantPreview";
import LoadingSpinner from "../../component/LoadingSpinner";
import { BasePlant, basePlantFromJSON, isMaturableBasePlant, secondsToDurationString } from "../../model/farm";

type State = {
    status: "loading";
} | {
    status: "error";
} | {
    status: "loaded";
    basePlant: BasePlant;
};

const DexPlantDetailedPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [state, setState] = useState<State>({ status: "loading" });

    if (!id) throw new Error();

    useEffect(() => {
        const subscription = dexService.getPlant(id).subscribe({
            next: value => setState({ status: "loaded", basePlant: basePlantFromJSON(value.data) }),
            error: _err => setState({ status: "error" })
        });

        return () => subscription.unsubscribe();
    }, [id]);

    const getTitle = () => {
        switch (state.status) {
            case "loading": return "Loading… - Plant Dex - PBBG";
            case "error": return "Error - Plant Dex - PBBG";
            case "loaded": return `#${state.basePlant.id}: ${state.basePlant.name} - Plant Dex - PBBG`;
        }
    };

    const renderContainer = () => {
        switch (state.status) {
            case "loading": return <div><LoadingSpinner /></div>;
            case "error": return <div>ERROR</div>;
        }

        const basePlant = state.basePlant;

        return <>
            <h1>#{basePlant.id}: {basePlant.name}</h1>
            <h2>Sprites</h2>
            <div className="body">
                <PlantPreview basePlant={basePlant} />
            </div>
            <h2>Description</h2>
            <div className="body">
                <i>{basePlant.description}</i>
            </div>
            <h2>Details</h2>
            <div className="body">
                {isMaturableBasePlant(basePlant) ? <>
                    <div>Time to harvest (first time): {secondsToDurationString(basePlant.growingPeriod)}</div>
                    <div>Time to harvest (mature): {secondsToDurationString(basePlant.maturePeriod)}</div>
                </> : <>
                    <div>Time to harvest: {secondsToDurationString(basePlant.growingPeriod)}</div>
                </>}
            </div>
        </>;
    };

    return <>
        <title>{getTitle()}</title>
        <DexReturnLink to="/dex/plants" label="Return to Plant Dex" />
        <div className="detailed-dex">{renderContainer()}</div>
    </>;
};

export default DexPlantDetailedPage;
