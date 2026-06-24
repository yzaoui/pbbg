import "./FriendsPage.scss";

import React, { useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";

import { FriendInfo, Friends } from "../backend/friends";
import friendsService from "../backend/friends.service";
import userService from "../backend/user.service";
import FriendsContainer from "../component/friends/FriendsContainer";

interface LoadingState {
    status: "loading";
}

interface LoadedState {
    status: "loaded";
    friends: Friends;
    searching: boolean;
    searchResults: FriendInfo[] | null;
}

interface ErrorState {
    status: "error";
}

type State = LoadingState | LoadedState | ErrorState;

const FriendsPage: React.FC = () => {
    const [state, setState] = useState<State>({ status: "loading" });
    const searchRequestRef = useRef<Subscription | null>(null);

    useEffect(() => {
        const subscription = friendsService.getFriends().subscribe({
            next: value => setState({ status: "loaded", friends: value.data, searching: false, searchResults: null }),
            error: _err => setState({ status: "error" })
        });

        return () => {
            subscription.unsubscribe();
            searchRequestRef.current?.unsubscribe();
        };
    }, []);

    const handleSearchUser = (text: string) => {
        if (state.status !== "loaded") return;

        searchRequestRef.current?.unsubscribe();

        setState(prevState => {
            if (prevState.status !== "loaded") return prevState;
            return { ...prevState, searching: true };
        });

        searchRequestRef.current = userService.searchUser(text).subscribe(
            res => {
                setState(prevState => {
                    if (prevState.status !== "loaded") return prevState;
                    return { ...prevState, searching: false, searchResults: res.data };
                });
            }
        );
    };

    const renderContent = () => {
        switch (state.status) {
            case "loading": return <FriendsContainer loading />;
            case "loaded": return <FriendsContainer
                friends={state.friends}
                searchResults={state.searchResults}
                searching={state.searching}
                onSearchUser={handleSearchUser}
            />;
            case "error": return <span>ERROR</span>;
        }
    };

    return <div className="FriendsPage">
        <title>Friends - PBBG</title>
        {renderContent()}
    </div>;
};

export default FriendsPage;
