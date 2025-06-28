import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./DexDetailedPage.scss";
import LoadingSpinner from "../../component/LoadingSpinner";
import { Subscription } from "rxjs";
import dexService from "../../backend/dex.service";
import DexReturnLink from "../../component/dex/DexReturnLink";
import { BasePlant, basePlantFromJSON, isMaturableBasePlant, secondsToDurationString } from "../../model/farm";
import PlantPreview from "../../component/farm/PlantPreview";

interface Props extends RouteComponentProps<{ id: string }> {}

type State = {
    status: "loading";
} | {
    status: "error";
} | {
    status: "loaded";
    basePlant: BasePlant;
};

class DexPlantDetailedPage extends React.Component<Props, State> {
    readonly state: Readonly<State> = {
        status: "loading"
    };

    request?: Subscription;

    componentDidMount() {
        this.request = dexService.getPlant(this.props.match.params.id)
            .subscribe({
                next: value => this.setState({ status: "loaded", basePlant: basePlantFromJSON(value.data) }),
                error: err => this.setState({ status: "error" })
            });
    }

    componentWillUnmount() {
        this.request && this.request.unsubscribe();
    }

    render() {
        return <>
            <DexReturnLink to="/dex/plants" label="Return to Plant Dex" />
            <div className="detailed-dex">{this.renderContainer()}</div>
        </>;
    }

    renderContainer = () => {
        switch (this.state.status) {
            case "loading": return <>
                <Helmet title="Loading… - Plant Dex - PBBG" />
                <div><LoadingSpinner /></div>
            </>;
            case "error": return <div>ERROR</div>;
        }

        const basePlant = this.state.basePlant;

        return <>
            <Helmet title={`#${basePlant.id}: ${basePlant.name} - Plant Dex - PBBG`} />
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
}

export default DexPlantDetailedPage;
