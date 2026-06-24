import React, { useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";

import { Battle as BattleData, BattleReward, MappedUnitEffects } from "../backend/battle";
import battleService from "../backend/battle.service";
import Battle from "../component/battle/Battle";
import LoadingButton from "../component/LoadingButton";
import LoadingSpinner from "../component/LoadingSpinner";

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

const BattlePage: React.FC = () => {
    const [state, setState] = useState<State>({ status: "loading" });
    const battleRequestRef = useRef<Subscription>(null);

    const stateInitialInBattle = (battle: BattleData): InBattleState => ({
        status: "in battle",
        battle: battle,
        performingAction: false,
        effectsList: [],
        reward: null
    });

    useEffect(() => {
        const subscription = battleService.getBattle().subscribe({
            next: value => setState(value.data !== null ? stateInitialInBattle(value.data) : { status: "no battle" }),
            error: _err => setState({ status: "error" })
        });

        return () => {
            subscription.unsubscribe();
            battleRequestRef.current?.unsubscribe();
        };
    }, []);

    const handleGenerateBattleClick = () => {
        battleRequestRef.current?.unsubscribe();
        setState({ status: "generating battle" });

        battleRequestRef.current = battleService.generateBattle().subscribe({
            next: value => setState(stateInitialInBattle(value.data)),
            error: _err => setState({ status: "error" })
        });
    };

    const handleAllyTurn = (targetUnitId: number) => {
        if (state.status !== "in battle") return;

        battleRequestRef.current?.unsubscribe();

        setState(prevState => {
            if (prevState.status !== "in battle") return prevState;
            return { ...prevState, performingAction: true };
        });

        battleRequestRef.current = battleService.allyTurn({ targetUnitId }).subscribe({
            next: value => {
                setState(prevState => {
                    if (prevState.status !== "in battle") return prevState;
                    return {
                        ...prevState,
                        battle: value.data.battle,
                        performingAction: false,
                        effectsList: prevState.effectsList.concat(value.data.unitEffects),
                        reward: value.data.reward
                    };
                });
            },
            error: _err => setState({ status: "error" })
        });
    };

    const handleEnemyTurn = () => {
        if (state.status !== "in battle") return;

        battleRequestRef.current?.unsubscribe();

        setState(prevState => {
            if (prevState.status !== "in battle") return prevState;
            return { ...prevState, performingAction: true };
        });

        battleRequestRef.current = battleService.enemyTurn().subscribe({
            next: value => {
                setState(prevState => {
                    if (prevState.status !== "in battle") return prevState;
                    return {
                        ...prevState,
                        battle: value.data.battle,
                        performingAction: false,
                        effectsList: prevState.effectsList.concat(value.data.unitEffects),
                        reward: value.data.reward
                    };
                });
            },
            error: _err => setState({ status: "error" })
        });
    };

    return <>
        <title>Battle - PBBG</title>
        {(() => {
            switch (state.status) {
                case "loading":
                    return <LoadingSpinner style={{ alignSelf: "center" }} />;
                case "error":
                    return <>ERROR</>;
                case "no battle":
                    return <button className="fancy" style={{ alignSelf: "center" }} onClick={handleGenerateBattleClick}>
                        <span>Generate battle</span>
                    </button>;
                case "generating battle":
                    return <LoadingButton loading={true} style={{ alignSelf: "center" }}>Generating battle…</LoadingButton>;
                case "in battle":
                    return <Battle
                        battle={state.battle}
                        performingAction={state.performingAction}
                        onAllyTurn={handleAllyTurn}
                        onEnemyTurn={handleEnemyTurn}
                        effects={state.effectsList}
                        reward={state.reward}
                    />;
            }
        })()}
    </>;
};

export default BattlePage;
