import React from "react";
import { MyUnitEnum } from "../../backend/dex";
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
    unitEnum: MyUnitEnum;
};

class DexUnitDetailedPage extends React.Component<Props, State> {
    readonly state: Readonly<State> = {
        status: "loading"
    };

    request?: Subscription;

    componentDidMount() {
        this.request = dexService.getUnit(this.props.match.params.id)
            .subscribe({
                next: value => this.setState({ status: "loaded", unitEnum: value.data }),
                error: err => this.setState({ status: "error" })
            });
    }

    componentWillUnmount() {
        this.request && this.request.unsubscribe();
    }

    render() {
        return <>
            <DexReturnLink to="/dex/units" label="Return to Unit Dex" />
            <div className="detailed-dex">{this.renderContainer()}</div>
        </>;
    }

    renderContainer = () => {
        switch (this.state.status) {
            case "loading": return <>
                <Helmet title="Loading… - Unit Dex - PBBG" />
                <div><LoadingSpinner /></div>
            </>;
            case "error": return <div>ERROR</div>;
        }

        const unit = this.state.unitEnum;

        return <>
            <Helmet title={`#${unit.id}: ${unit.friendlyName} - Unit Dex - PBBG`} />
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
}

export default DexUnitDetailedPage;
