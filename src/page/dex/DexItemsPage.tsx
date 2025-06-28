import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Subscription } from "rxjs";
import "./DexSubpage.scss";
import LoadingSpinner from "../../component/LoadingSpinner";
import { BaseItem, DexItems } from "../../backend/dex";
import DexItemEntry from "../../component/dex/DexItemEntry";
import dexService from "../../backend/dex.service";
import DexUnknownEntry from "../../component/dex/DexUnknownEntry";
import DexReturnLink from "../../component/dex/DexReturnLink";
import DexItemDetailedPage from "./DexItemDetailedPage";

const DexItemsPage: React.FC<RouteComponentProps> = ({ match }) => <>
    <Route path={match.url + "/"} exact component={IndexPage} />
    <Route path={match.url + "/:id"} component={DexItemDetailedPage} />
</>;

type State = {
    status: "loading";
} | {
    status: "error";
} | {
    status: "loaded";
    dexItems: DexItems;
}

class IndexPage extends React.Component<RouteComponentProps, State> {
    readonly state: Readonly<State> = {
        status: "loading"
    };

    request?: Subscription;

    componentDidMount() {
        this.request = dexService.getItems()
            .subscribe({
                next: value => this.setState({ status: "loaded", dexItems: value.data }),
                error: err => this.setState({ status: "error" })
            });
    }

    componentWillUnmount() {
        this.request && this.request.unsubscribe();
    }

    render() {
        return <>
            <DexReturnLink to="/dex" label="Return to Dex"/>
            <div className="dex-header"><h1>Item Dex</h1></div>
            <div className="dex-container">{this.renderContainer()}</div>
        </>;
    }

    renderContainer = () => {
        if (this.state.status === "loading") return <LoadingSpinner />;
        else if (this.state.status === "error") return "ERROR";

        const { discoveredItems, lastItemId } = this.state.dexItems;

        if (Object.entries(discoveredItems).length === 0) return "No items discovered yet.";

        const allEntries: Record<number, BaseItem | null> = {};
        for (let i = 1; i <= lastItemId; i++) {
            allEntries[i] = discoveredItems[i] || null;
        }

        return <>
            <Helmet title="Item Dex - PBBG" />
            <ol className="dex">
                {Object.entries(allEntries)
                    .map(([id, item]) => (item !== null) ? <DexItemEntry key={id} id={id} item={item} /> : <DexUnknownEntry key={id} id={id} />)
                }
            </ol>
        </>;
    };
}

export default DexItemsPage;
