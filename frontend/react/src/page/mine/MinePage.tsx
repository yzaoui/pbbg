import { Howl } from "howler";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { Link, Location, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Subscription } from "rxjs";

import exitMineMP3 from "../../audio/enter_mine.mp3";
import exitMineOGG from "../../audio/enter_mine.ogg";
import levelUpMP3 from "../../audio/level-up.mp3";
import levelUpOGG from "../../audio/level-up.ogg";
import pickaxe1MP3 from "../../audio/pickaxe1.mp3";
import pickaxe1OGG from "../../audio/pickaxe1.ogg";
import pickaxe2MP3 from "../../audio/pickaxe2.mp3";
import pickaxe2OGG from "../../audio/pickaxe2.ogg";
import pickaxe3MP3 from "../../audio/pickaxe3.mp3";
import pickaxe3OGG from "../../audio/pickaxe3.ogg";
import pickaxe4MP3 from "../../audio/pickaxe4.mp3";
import pickaxe4OGG from "../../audio/pickaxe4.ogg";
import { InventoryEntry, Point } from "../../backend/inventory";
import inventoryService from "../../backend/inventory.service";
import { LevelUp, Mine as MineData, MinedItemResult } from "../../backend/mine";
import mineService from "../../backend/mine.service";
import { LevelProgress } from "../../backend/user-stats";
import userStatsService from "../../backend/user-stats.service";
import InventoryItem from "../../component/inventory/InventoryItem";
import LevelInfo from "../../component/LevelInfo";
import LoadingButton from "../../component/LoadingButton";
import LoadingSpinner from "../../component/LoadingSpinner";
import Mine from "../../component/mine/Mine";
import MineLog from "../../component/mine/MineLog";
import MineListPage from "./MineListPage";

const MinePage: React.FC = () => <Routes>
    <Route path="/" element={<IndexPage />} />
    <Route path="/list" element={<MineListPage />} />
</Routes>;

type State = {
    status: "initial loading";
} | {
    status: "error";
} | {
    status: "loaded" | "exiting";
    mine: MineData;
    miningLvl: "loading" | LevelProgress;
    pickaxe: "loading" | InventoryEntry | null;
    submittingAction: Point | null;
    results: (MinedItemResult | LevelUp)[];
} | {
    status: "exited";
    mine: MineData;
    miningLvl: "loading" | LevelProgress;
    pickaxe: "loading" | InventoryEntry | null;
    results: (MinedItemResult | LevelUp)[];
};

export interface LocationState {
    mine: MineData;
}

const IndexPage: React.FC = () => {
    const navigate = useNavigate();
    const location: Location<LocationState | null> = useLocation();
    const [state, setState] = useState<State>({ status: "initial loading" });

    const pickaxeSounds = useRef([
        new Howl({ src: [pickaxe1MP3, pickaxe1OGG], preload: true }),
        new Howl({ src: [pickaxe2MP3, pickaxe2OGG], preload: true }),
        new Howl({ src: [pickaxe3MP3, pickaxe3OGG], preload: true }),
        new Howl({ src: [pickaxe4MP3, pickaxe4OGG], preload: true })
    ]);
    const lastPickaxeSoundIndex = useRef(-1);
    const levelUpSound = useRef(new Howl({ src: [levelUpMP3, levelUpOGG], preload: true }));
    const exitSound = useRef(new Howl({ src: [exitMineMP3, exitMineOGG], preload: true }));
    const mineActionRequestRef = useRef<Subscription | null>(null);

    const setMineStateAndStartLoadingOtherState = (mineData: MineData) => {
        setState({ status: "loaded", mine: mineData, miningLvl: "loading", pickaxe: "loading", submittingAction: null, results: [] });
        loadMiningLevel();
        loadPickaxe();
    };

    const loadMine = () => {
        const subscription = mineService.getMine().subscribe({
            next: value => {
                if (value.data === null) {
                    navigate("/mine/list");
                    return;
                }
                setMineStateAndStartLoadingOtherState(value.data);
            },
            error: _err => setState({ status: "error" })
        });
        return () => subscription.unsubscribe();
    };

    const loadMiningLevel = () => {
        const subscription = userStatsService.get().subscribe({
            next: value => {
                const miningLvl = value.data.mining;
                setState(prevState => {
                    if (prevState.status !== "loaded" && prevState.status !== "exiting") return prevState;
                    return { ...prevState, miningLvl };
                });
            },
            error: _err => setState({ status: "error" })
        });
        return () => subscription.unsubscribe();
    };

    const loadPickaxe = () => {
        const subscription = inventoryService.getInventory().subscribe({
            next: value => {
                const pickaxe = value.data.equipment.pickaxe;
                setState(prevState => {
                    if (prevState.status !== "loaded" && prevState.status !== "exiting") return prevState;
                    return { ...prevState, pickaxe };
                });
            },
            error: _err => setState({ status: "error" })
        });
        return () => subscription.unsubscribe();
    };

    // User may have come from mine list, so check if location contains mine to avoid having to fetch it again
    useEffect(() => {
        if (location.state !== null) {
            navigate(location.pathname, { replace: true });
             
            setMineStateAndStartLoadingOtherState(location.state.mine);
            return;
        }

        loadMine();

        return () => mineActionRequestRef.current?.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const performMineAction = (x: number, y: number) => {
        if (state.status !== "loaded") return;

        mineActionRequestRef.current?.unsubscribe();

        setState(prevState => {
            if (prevState.status !== "loaded") return prevState;
            return { ...prevState, submittingAction: { x, y } };
        });

        mineActionRequestRef.current = mineService.performMineAction({ x, y }).subscribe({
            next: value => {
                playPickaxeSound();

                if (value.data.levelUps.length > 0) {
                    levelUpSound.current.play();
                }

                setState(prevState => {
                    if (prevState.status !== "loaded") return prevState;
                    return {
                        ...prevState,
                        mine: value.data.mine,
                        miningLvl: value.data.miningLvl,
                        submittingAction: null,
                        results: prevState.results.concat(value.data.minedItemResults).concat(value.data.levelUps)
                    };
                });
            },
            error: _err => setState({ status: "error" })
        });
    };

    const exitMine = () => {
        mineActionRequestRef.current?.unsubscribe();

        setState(prevState => {
            if (prevState.status !== "loaded") return prevState;
            return { ...prevState, status: "exiting" };
        });

        mineActionRequestRef.current = mineService.exitMine().subscribe({
            next: _value => {
                exitSound.current.play();
                setState(prevState => {
                    if (prevState.status !== "exiting") return prevState;
                    return { ...prevState, status: "exited" };
                });
            },
            error: _err => setState({ status: "error" })
        });
    };

    const playPickaxeSound = () => {
        let soundIndex;
        do {
            soundIndex = Math.floor(Math.random() * pickaxeSounds.current.length);
        } while (soundIndex === lastPickaxeSoundIndex.current);

        lastPickaxeSoundIndex.current = soundIndex;
        pickaxeSounds.current[soundIndex].play();
    };

    const title = (() => {
        switch (state.status) {
            case "initial loading": return "Mine"
            case "error": return "Mine"
            case "loaded":
            case "exiting":
            case "exited": return state.mine.type.name
        }
    })() + " - PBBG"

    if (state.status === "initial loading") return <LoadingSpinner />;
    else if (state.status === "error") return <>ERROR</>;

    return <>
        <title>{title}</title>
        {state.status === "loaded" || state.status === "exiting" ? <>
            <LoadingButton loading={state.status === "exiting"} style={style} onClick={exitMine}>Exit mine</LoadingButton>
            <Mine
                mine={state.mine}
                style={style}
                pickaxe={state.pickaxe !== "loading" ? state.pickaxe : null}
                submittingAction={state.submittingAction}
                onMineAction={performMineAction}
            />
        </> : state.status === "exited" ?
            <Link to={"/mine/list"} className="fancy" style={style}>Return to mine list</Link>
        : {}}

        {/* Mining level */}
        {state.miningLvl === "loading" ?
            <LoadingSpinner style={style} />
        :
            <LevelInfo levelProgress={state.miningLvl} style={style} />
        }

        {/* Equipped pickaxe slot */}
        {state.pickaxe === "loading" ?
            <LoadingSpinner style={style} />
        : state.pickaxe === null ?
            <>No pickaxe equipped</>
        :
            <InventoryItem inventoryEntry={state.pickaxe} style={style} />
        }
        <MineLog results={state.results} expanded={state.status === "exited"} />
    </>;
};

const style: CSSProperties = {
    marginBottom: "4px",
    alignSelf: "center"
};

export default MinePage;
