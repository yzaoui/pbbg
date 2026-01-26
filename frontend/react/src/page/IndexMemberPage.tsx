import React, { useEffect, useState } from "react";
import { UserStats } from "../backend/user-stats";
import userStatsService from "../backend/user-stats.service";
import HomeUserStats from "../component/HomeUserStats";

type State = {
    status: "loading";
} | {
    status: "error";
} | {
    status: "loaded";
    stats: UserStats;
};

const IndexMemberPage: React.FC = () => {
    const [state, setState] = useState<State>({ status: "loading" });

    useEffect(() => {
        const subscription = userStatsService.get()
            .subscribe({
                next: value => setState({ status: "loaded", stats: value.data }),
                error: _err => setState({ status: "error" })
            });

        return () => subscription.unsubscribe();
    }, []);

    return <>
        <title>Home - PBBG</title>
        {(() => {
            switch (state.status) {
                case "error": return <div>ERROR</div>;
                case "loading": return <HomeUserStats status="loading" />;
                case "loaded": return <HomeUserStats status="loaded" userStats={state.stats} />;
            }
        })()}
    </>;
};

export default IndexMemberPage;
