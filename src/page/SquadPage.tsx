import React from "react";
import { Squad } from "../backend/squad";
import squadService from "../backend/squad.service";
import { Subscription } from "rxjs";
import LoadingSpinner from "../component/LoadingSpinner";
import PBBGUnit from "../component/PBBGUnit";
import classNames from "classnames";
import { Howl } from "howler";
// @ts-ignore
import healingEffectMP3 from "../audio/healing_effect.mp3";
// @ts-ignore
import healingEffectOGG from "../audio/healing_effect.ogg";

type State = {
    status: "loading";
} | {
    status: "error";
} | {
    status: "loaded";
    squad: Squad;
    healing: boolean;
}

class SquadPage extends React.Component<{}, State> {
    readonly state: Readonly<State> = {
        status: "loading",
    };

    request?: Subscription;

    healingSound = new Howl({
        src: [healingEffectMP3, healingEffectOGG],
        preload: true
    });

    componentDidMount() {
        document.title = "Squad - PBBG";

        this.request = squadService.getSquad().subscribe({
            next: value => this.setState({ status: "loaded", squad: value.data, healing: false }),
            error: err => this.setState({ status: "error" })
        });
    }

    componentWillUnmount() {
        this.request && this.request.unsubscribe();
    }

    render() {
        if (this.state.status === "loading") return <LoadingSpinner />;
        else if (this.state.status === "error") return "ERROR";

        return <>
            <button
                className={classNames("fancy", { "loading": this.state.healing })}
                style={{ alignSelf: "center" }}
                onClick={this.handleHealClick}
                disabled={this.state.healing}
            >
                Heal Squad{this.state.healing ? " (Loading…)" : ""}
            </button>
            {this.state.squad.units.map(unit => <PBBGUnit key={unit.id} unit={unit} style={{ margin: "4px" }} />)}
        </>;
    }

    handleHealClick = () => {
        if (this.state.status !== "loaded") throw Error();
        this.setState({ ...this.state, healing: true });

        this.request = squadService.healSquad().subscribe({
            next: value => {
                if (this.state.status !== "loaded") throw Error();

                this.setState({ ...this.state, healing: false, squad: value.data });
                this.healingSound.play();
            },
            error: err => this.setState({ status: "error" })
        });
    };
}

export default SquadPage;
