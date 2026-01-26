import React, { useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";
import classNames from "classnames";
import { Howl } from "howler";
import { Squad } from "../backend/squad";
import squadService from "../backend/squad.service";
import LoadingSpinner from "../component/LoadingSpinner";
import PBBGUnit from "../component/PBBGUnit";
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
};

const SquadPage: React.FC = () => {
    const [state, setState] = useState<State>({ status: "loading" });
    const healRequestRef = useRef<Subscription | null>(null);
    const healingSound = useRef(new Howl({
        src: [healingEffectMP3, healingEffectOGG],
        preload: true
    }));

    useEffect(() => {
        const subscription = squadService.getSquad().subscribe({
            next: value => setState({ status: "loaded", squad: value.data, healing: false }),
            error: _err => setState({ status: "error" })
        });

        return () => {
            subscription.unsubscribe();
            healRequestRef.current?.unsubscribe();
        };
    }, []);

    const handleHealClick = () => {
        if (state.status !== "loaded") return;

        healRequestRef.current?.unsubscribe();

        setState(prevState => {
            if (prevState.status !== "loaded") return prevState;
            return { ...prevState, healing: true };
        });

        healRequestRef.current = squadService.healSquad().subscribe({
            next: value => {
                setState(prevState => {
                    if (prevState.status !== "loaded") return prevState;
                    return { ...prevState, healing: false, squad: value.data };
                });
                healingSound.current.play();
            },
            error: _err => setState({ status: "error" })
        });
    };

    if (state.status === "loading") return <LoadingSpinner />;
    else if (state.status === "error") return <>ERROR</>;

    return <>
        <title>Squad - PBBG</title>
        <button
            className={classNames("fancy", { "loading": state.healing })}
            style={{ alignSelf: "center" }}
            onClick={handleHealClick}
            disabled={state.healing}
        >
            Heal Squad{state.healing ? " (Loading…)" : ""}
        </button>
        {state.squad.units.map(unit => <PBBGUnit key={unit.id} unit={unit} style={{ margin: "4px" }} />)}
    </>;
};

export default SquadPage;
