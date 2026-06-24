import "./DexDetailedPage.scss";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import { MyUnitEnum } from "../../backend/dex";
import dexService from "../../backend/dex.service";
import DexReturnLink from "../../component/dex/DexReturnLink";
import LoadingSpinner from "../../component/LoadingSpinner";

type State = {
    status: "loading";
} | {
    status: "error";
} | {
    status: "loaded";
    unitEnum: MyUnitEnum;
};

const DexUnitDetailedPage: React.FC = () => {
    const params = useParams<{ id: string }>();
    const [state, setState] = useState<State>({ status: "loading" });

    if (!params.id) {
        throw new Error("DexUnitDetailedPage requires id parameter");
    }
    const id = params.id;

    useEffect(() => {
        const subscription = dexService.getUnit(id).subscribe({
            next: value => setState({ status: "loaded", unitEnum: value.data }),
            error: _err => setState({ status: "error" })
        });

        return () => subscription.unsubscribe();
    }, [id]);

    const getTitle = () => {
        switch (state.status) {
            case "loading": return "Loading… - Unit Dex - PBBG";
            case "error": return "Error - Unit Dex - PBBG";
            case "loaded": return `#${state.unitEnum.id}: ${state.unitEnum.friendlyName} - Unit Dex - PBBG`;
        }
    };

    const renderContainer = () => {
        switch (state.status) {
            case "loading": return <div><LoadingSpinner /></div>;
            case "error": return <div>ERROR</div>;
        }

        const unit = state.unitEnum;

        return <>
            <h1>#{unit.id}: {unit.friendlyName}</h1>
            <h2>Sprites</h2>
            <div className="body">
                <img src={unit.iconURL} alt={`${unit.friendlyName}'s icon`} />
                <img src={unit.fullURL} alt={`${unit.friendlyName}'s full sprite`} />
            </div>
            <h2>Description</h2>
            <div className="body">
                <i>{unit.description}</i>
            </div>
            <h2>Base Stats</h2>
            <div className="body">
                <table>
                    <thead>
                        <tr>
                            <th>HP</th>
                            <th>ATK</th>
                            <th>DEF</th>
                            <th>INT</th>
                            <th>RES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{unit.baseHP}</td>
                            <td>{unit.baseAtk}</td>
                            <td>{unit.baseDef}</td>
                            <td>{unit.baseInt}</td>
                            <td>{unit.baseRes}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>;
    };

    return <>
        <title>{getTitle()}</title>
        <DexReturnLink to="/dex/units" label="Return to Unit Dex" />
        <div className="detailed-dex">{renderContainer()}</div>
    </>;
};

export default DexUnitDetailedPage;
