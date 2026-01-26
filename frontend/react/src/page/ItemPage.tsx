import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../component/LoadingSpinner";
import itemService from "../backend/item.service";
import { ItemDetails, ItemHistoryInfo } from "../backend/item";
import "./ItemPage.scss";

type State = {
    status: "loading";
} | {
    status: "error";
} | {
    status: "loaded";
    itemDetails: ItemDetails;
};

const ItemPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [state, setState] = useState<State>({ status: "loading" });

    if (!id) throw new Error();

    useEffect(() => {
        const subscription = itemService.getItem(id).subscribe({
            next: value => setState({ status: "loaded", itemDetails: value.data }),
            error: _err => setState({ status: "error" })
        });

        return () => subscription.unsubscribe();
    }, [id]);

    const getTitle = () => {
        switch (state.status) {
            case "loading": return "Loading… - Item - PBBG";
            case "error": return "Error - Item - PBBG";
            case "loaded": return `${state.itemDetails.item.baseItem.friendlyName} - Item - PBBG`;
        }
    };

    switch (state.status) {
        case "loading": return <>
            <title>{getTitle()}</title>
            <div><LoadingSpinner /></div>
        </>;
        case "error": return <>
            <title>{getTitle()}</title>
            <div>ERROR</div>
        </>;
    }

    const { item, history, linkedUserInfo } = state.itemDetails;

    return <>
        <title>{getTitle()}</title>
        <div className="ItemPage">
            <div>
                <h2>{item.baseItem.friendlyName}</h2>
                <img src={item.baseItem.img64} alt={item.baseItem.friendlyName + " sprite"} />
            </div>
            <div>
                <h4>History</h4>
                <ol>
                    {history
                        .sort((a, b) => b.date - a.date) // Sort by descending
                        .map((entry, index) =>
                                <li key={index}>
                                    <ItemHistoryEntryDescription info={entry.info} userDetails={linkedUserInfo} />
                                    <ItemHistoryEntryDate date={entry.date} />
                                </li>
                        )
                    }
                </ol>
            </div>
        </div>
    </>;
};

const ItemHistoryEntryDescription: React.FC<{ info: ItemHistoryInfo, userDetails: Record<number, string> }> = ({ info, userDetails }) => {
    let content: JSX.Element;

    switch (info.type) {
        case "created-user":
            content = <>Created with <a href={`/user/${info.userId}`}>{userDetails[info.userId]}</a></>;
            break;
        case "created-market":
            content = <>Created in market</>;
            break;
        case "first-mined":
            content = <>Mined by <a href={`/user/${info.userId}`}>{userDetails[info.userId]}</a></>;
            break;
        case "first-harvested":
            content = <>Harvested by <a href={`/user/${info.userId}`}>{userDetails[info.userId]}</a></>;
            break;
        default:
            throw Error();
    }

    return <span className="ItemHistoryEntryDescription">{content}</span>;
};

const ItemHistoryEntryDate: React.FC<{ date: number }> = ({ date }) => <span className="ItemHistoryEntryDate">—{(new Date(date * 1000)).toString()}</span>;

export default ItemPage;
