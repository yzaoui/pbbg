import React from "react";
import { RouteComponentProps } from "react-router";
import LoadingSpinner from "../component/LoadingSpinner";
import { Subscription } from "rxjs";
import itemService from "../backend/item.service";
import { ItemDetails, ItemHistoryInfo } from "../backend/item";
import "./ItemPage.scss";
import { Helmet } from "react-helmet";

interface Props extends RouteComponentProps<{ id: string }> {}

type State = {
    status: "loading";
} | {
    status: "error";
} | {
    status: "loaded";
    itemDetails: ItemDetails;
};

class ItemPage extends React.Component<Props, State> {
    readonly state: Readonly<State> = {
        status: "loading"
    };

    request?: Subscription;

    componentDidMount() {
        this.request = itemService.getItem(this.props.match.params.id)
            .subscribe({
                next: value => this.setState({ status: "loaded", itemDetails: value.data }),
                error: err => this.setState({ status: "error" })
            });
    }

    render() {
        switch (this.state.status) {
            case "loading": return <>
                <Helmet title="Loading… - Item - PBBG" />
                <div><LoadingSpinner /></div>
            </>;
            case "error": return <div>ERROR</div>;
        }

        const { item, history, linkedUserInfo } = this.state.itemDetails;

        return <>
            <Helmet title={`${item.baseItem.friendlyName} - Item - PBBG`} />
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
    }
}

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

    return <span className="ItemHistoryEntryDescription">{content}</span>
};

const ItemHistoryEntryDate: React.FC<{ date: number }> = ({ date }) => <span className="ItemHistoryEntryDate">—{(new Date(date * 1000)).toString()}</span>;

export default ItemPage;
