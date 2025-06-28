import React from "react";
import { DexItem } from "../../backend/dex";
import { RouteComponentProps } from "react-router-dom";
import "./DexDetailedPage.scss";
import LoadingSpinner from "../../component/LoadingSpinner";
import { Subscription } from "rxjs";
import dexService from "../../backend/dex.service";
import DexReturnLink from "../../component/dex/DexReturnLink";
import { Helmet } from "react-helmet";

interface Props extends RouteComponentProps<{ id: string }> {}

type State = {
    status: "loading";
} | {
    status: "error";
} | {
    status: "loaded";
    dexItem: DexItem;
};

class DexItemDetailedPage extends React.Component<Props, State> {
    readonly state: Readonly<State> = {
        status: "loading"
    };

    request?: Subscription;

    componentDidMount() {
        this.request = dexService.getItem(this.props.match.params.id)
            .subscribe({
                next: value => this.setState({ status: "loaded", dexItem: value.data }),
                error: err => this.setState({ status: "error" })
            });
    }

    componentWillUnmount() {
        this.request && this.request.unsubscribe();
    }

    render() {
        return <>
            <DexReturnLink to="/dex/items" label="Return to Item Dex" />
            <div className="detailed-dex">{this.renderContainer()}</div>
        </>;
    }

    renderContainer = () => {
        switch (this.state.status) {
            case "loading": return <>
                <Helmet title="Loading… - Item Dex - PBBG" />
                <div><LoadingSpinner /></div>
            </>;
            case "error": return <div>ERROR</div>;
        }

        const item = this.state.dexItem;

        const title = item.type === "discovered" ? `#${item.baseItem.id}: ${item.baseItem.friendlyName}` : `#${item.id}: ???`;

        return <>
            <Helmet title={`${title} - Item Dex - PBBG`} />
            <h1>{title}</h1>
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
}

export default DexItemDetailedPage;
