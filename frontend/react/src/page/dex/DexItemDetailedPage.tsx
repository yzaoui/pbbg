import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { DexItem } from "../../backend/dex";
import dexService from "../../backend/dex.service";
import DexReturnLink from "../../component/dex/DexReturnLink";
import LoadingSpinner from "../../component/LoadingSpinner";
import "./DexDetailedPage.scss";

type State = {
    status: "loading";
} | {
    status: "error";
} | {
    status: "loaded";
    dexItem: DexItem;
};

const DexItemDetailedPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [state, setState] = useState<State>({ status: "loading" });

    if (!id) throw new Error();

    useEffect(() => {
        const subscription = dexService.getItem(id).subscribe({
            next: value => setState({ status: "loaded", dexItem: value.data }),
            error: _err => setState({ status: "error" })
        });

        return () => subscription.unsubscribe();
    }, [id]);

    const getTitle = () => {
        switch (state.status) {
            case "loading": return "Loading… - Item Dex - PBBG";
            case "error": return "Error - Item Dex - PBBG";
            case "loaded": {
                const item = state.dexItem;
                const title = item.type === "discovered" ? `#${item.baseItem.id}: ${item.baseItem.friendlyName}` : `#${item.id}: ???`;
                return `${title} - Item Dex - PBBG`;
            }
        }
    };

    const renderContainer = () => {
        switch (state.status) {
            case "loading": return <div><LoadingSpinner /></div>;
            case "error": return <div>ERROR</div>;
        }

        const item = state.dexItem;

        return <>
            <h2>Sprites</h2>
            <div className="body">
                {item.type === "discovered" ? <>
                    <img className="item-sprite" src={item.baseItem.img16} alt={`${item.baseItem.friendlyName} 16x16 sprite`} />
                    <img className="item-sprite" src={item.baseItem.img32} alt={`${item.baseItem.friendlyName} 32x32 sprite`} />
                    <img className="item-sprite" src={item.baseItem.img64} alt={`${item.baseItem.friendlyName} 64x64 sprite`} />
                </> :
                    <span>???</span>
                }
            </div>
            <h2>Description</h2>
            <div className="body">
                {item.type === "discovered" ?
                    <i>{item.baseItem.description}</i>
                :
                    <span>???</span>
                }
            </div>
        </>;
    };

    return <>
        <title>{getTitle()}</title>
        <DexReturnLink to="/dex/items" label="Return to Item Dex" />
        <div className="detailed-dex">{renderContainer()}</div>
    </>;
};

export default DexItemDetailedPage;
