import { Howl } from "howler";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Subscription } from "rxjs";

import enterMineMP3 from "../../audio/enter_mine.mp3";
import enterMineOGG from "../../audio/enter_mine.ogg";
import { MineTypeList } from "../../backend/mine";
import mineService from "../../backend/mine.service";
import MineList from "../../component/mine/MineList";
import { LocationState } from "./MinePage";

type State = {
    status: "loading";
} | {
    status: "error";
} | {
    status: "loaded";
    mineTypeList: MineTypeList;
} | {
    status: "entering mine";
    mineTypeList: MineTypeList;
    enteringMineId: number;
};

const MineListPage: React.FC = () => {
    const navigate = useNavigate();
    const [state, setState] = useState<State>({ status: "loading" });
    const enterMineSound = useRef(new Howl({
        src: [enterMineMP3, enterMineOGG],
        preload: true
    }));
    const enterMineRequestRef = useRef<Subscription | null>(null);

    useEffect(() => {
        const subscription = mineService.getMineTypes().subscribe({
            next: value => setState({ status: "loaded", mineTypeList: value.data }),
            error: _err => setState({ status: "error" })
        });

        return () => {
            subscription.unsubscribe();
            enterMineRequestRef.current?.unsubscribe();
        };
    }, []);

    const handleEnterMine = (mineTypeId: number) => {
        if (state.status !== "loaded") return;

        enterMineRequestRef.current?.unsubscribe();

        setState({ status: "entering mine", mineTypeList: state.mineTypeList, enteringMineId: mineTypeId });

        enterMineRequestRef.current = mineService.enterMine({ mineTypeId }).subscribe({
            next: value => {
                setState({ status: "loaded", mineTypeList: state.mineTypeList });
                enterMineSound.current.play();
                navigate("/mine", { state: { mine: value.data } satisfies LocationState });
            },
            error: _err => setState({ status: "error" })
        });
    };

    return <>
        <title>Mine List - PBBG</title>
        {(() => {
            switch (state.status) {
                case "loading": return <MineList status={state.status} />;
                case "error": return <MineList status={state.status} />;
                case "loaded": return <MineList status={state.status} mineTypeList={state.mineTypeList} onEnterMine={handleEnterMine} />;
                case "entering mine": return <MineList status={state.status} mineTypeList={state.mineTypeList} enteringMineId={state.enteringMineId} />;
            }
        })()}
    </>;
};

export default MineListPage;
