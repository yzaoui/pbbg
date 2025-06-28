import React from "react";
import { Subscription } from "rxjs";
import LoadingSpinner from "../component/LoadingSpinner";
import battleService from "../backend/battle.service";
import { Battle as BattleData, BattleReward, MappedUnitEffects } from "../backend/battle";
import Battle from "../component/battle/Battle";
import LoadingButton from "../component/LoadingButton";

interface LoadingState {
    status: "loading";
}

interface InBattleState {
    status: "in battle";
    battle: BattleData;
    performingAction: boolean;
    effectsList: MappedUnitEffects[];
    reward: BattleReward | null;
}

interface NoBattleState {
    status: "no battle";
}

interface GeneratingBattleState {
    status: "generating battle";
}

interface ErrorState {
    status: "error";
}

type State = LoadingState | InBattleState | NoBattleState | GeneratingBattleState | ErrorState;

class BattlePage extends React.Component<{}, State> {
    readonly state: Readonly<State> = {
        status: "loading"
    };

    request?: Subscription;

    componentDidMount() {
        document.title = "Battle - PBBG";

        this.request = battleService.getBattle()
            .subscribe({
                next: value => this.setState(value.data !== null ? this.stateInitialInBattle(value.data) : { status: "no battle" }),
                error: err => this.setState({ status: "error" })
            });
    }

    componentWillUnmount() {
        this.request && this.request.unsubscribe();
    }

    render() {
        switch (this.state.status) {
            case "loading":
                return <LoadingSpinner style={{ alignSelf: "center" }} />;
            case "error":
                return <>ERROR</>;
            case "no battle":
                return <button className="fancy" style={{ alignSelf: "center" }} onClick={this.handleGenerateBattleClick}>
                    <span>Generate battle</span>
                </button>;
            case "generating battle":
                return <LoadingButton loading={true} style={{ alignSelf: "center" }}>Generating battle…</LoadingButton>;
            case "in battle":
                return <Battle
                    battle={this.state.battle}
                    performingAction={this.state.performingAction}
                    onAllyTurn={this.handleAllyTurn}
                    onEnemyTurn={this.handleEnemyTurn}
                    effects={this.state.effectsList}
                    reward={this.state.reward}
                />;
        }
    }

    stateInitialInBattle = (battle: BattleData): InBattleState => ({
        status: "in battle",
        battle: battle,
        performingAction: false,
        effectsList: [],
        reward: null
    });

    handleGenerateBattleClick = () => {
        this.setState({ status: "generating battle" });

        this.request = battleService.generateBattle()
            .subscribe({
                next: value => this.setState(this.stateInitialInBattle(value.data)),
                error: err => this.setState({ status: "error" })
            });
    };

    handleAllyTurn = (targetUnitId: number) => {
        if (this.state.status !== "in battle") throw Error();

        this.setState({ ...this.state, performingAction: true });

        this.request = battleService.allyTurn({ targetUnitId })
            .subscribe({
                next: value => {
                    if (this.state.status !== "in battle") throw Error();

                    this.setState({ ...this.state,
                        battle: value.data.battle,
                        performingAction: false,
                        effectsList: this.state.effectsList.concat(value.data.unitEffects),
                        reward: value.data.reward
                    });
                },
                error: err => this.setState({ status: "error" })
            });
    };

    handleEnemyTurn = () => {
        if (this.state.status !== "in battle") throw Error();

        this.setState({ ...this.state, performingAction: true });

        this.request = battleService.enemyTurn()
            .subscribe({
                next: value => {
                    if (this.state.status !== "in battle") throw Error();

                    this.setState({ ...this.state,
                        battle: value.data.battle,
                        performingAction: false,
                        effectsList: this.state.effectsList.concat(value.data.unitEffects),
                        reward: value.data.reward
                    });
                },
                error: err => this.setState({ status: "error" })
            });
    };
}

export default BattlePage;
