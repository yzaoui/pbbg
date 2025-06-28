import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Subscription } from "rxjs";
import "./DexSubpage.scss";
import LoadingSpinner from "../../component/LoadingSpinner";
import dexService from "../../backend/dex.service";
import DexPlantEntry from "../../component/dex/DexPlantEntry";
import DexPlantDetailedPage from "./DexPlantDetailedPage";
import DexReturnLink from "../../component/dex/DexReturnLink";
import { DexPlants } from "../../backend/dex";
import { BasePlant } from "../../model/farm";
import DexUnknownEntry from "../../component/dex/DexUnknownEntry";

const DexPlantsPage: React.FC<RouteComponentProps> = ({ match }) => <>
    <Route path={match.url + "/"} exact component={IndexPage} />
    <Route path={match.url + "/:id"} component={DexPlantDetailedPage} />
</>;

type State = {
    status: "loading";
} | {
    status: "error";
} | {
    status: "loaded";
    dexPlants: DexPlants;
};

class IndexPage extends React.Component<RouteComponentProps, State> {
    readonly state: Readonly<State> = {
        status: "loading"
    };

    request?: Subscription;

    componentDidMount() {
        this.request = dexService.getPlants()
            .subscribe({
                next: value => this.setState({ status: "loaded", dexPlants: value.data }),
                error: err => this.setState({ status: "error" })
            });
    }

    componentWillUnmount() {
        this.request && this.request.unsubscribe();
    }

    render() {
        return <>
            <DexReturnLink to="/dex" label="Return to Dex" />
            <div className="dex-header"><h1>Plant Dex</h1></div>
            <div className="dex-container">{this.renderContainer()}</div>
        </>;
    }

    renderContainer = () => {
        if (this.state.status === "loading") return <LoadingSpinner />;
        else if (this.state.status === "error") return "ERROR";

        const { discoveredPlants, lastPlantId } = this.state.dexPlants;

        const allEntries: Record<number, BasePlant | null> = {};
        for (let i = 1; i <= lastPlantId; i++) {
            allEntries[i] = discoveredPlants[i] || null;
        }

        return <>
            <Helmet title="Plant Dex - PBBG" />
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
}

export default DexPlantsPage;
