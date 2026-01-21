import React from "react";
import { Subscription } from "rxjs";
import friendsService from "../backend/friends.service";
import { FriendInfo, Friends } from "../backend/friends";
import FriendsContainer from "../component/friends/FriendsContainer";
import "./FriendsPage.scss";
import userService from "../backend/user.service";

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

class FriendsPage extends React.Component<{}, State> {
    readonly state: Readonly<State> = {
        status: "loading"
    };

    request?: Subscription;

    componentDidMount() {
        this.request = friendsService.getFriends()
            .subscribe({
                next: value => this.setState({ status: "loaded", friends: value.data, searchResults: null }),
                error: err => this.setState({ status: "error" })
            });
    }

    render = () => <div className="FriendsPage">
        <title>Friends - PBBG</title>
        {this.renderContent()}
    </div>;

    renderContent = () => {
        switch (this.state.status) {
            case "loading": return<FriendsContainer
                loading
            />;
            case "loaded": return <FriendsContainer
                friends={this.state.friends}
                searchResults={this.state.searchResults}
                searching={this.state.searching}
                onSearchUser={this.handleSearchUser}
            />;
            case "error": return <span>ERROR</span>;
        }
    };

    handleSearchUser = (text: string) => {
        if (this.state.status !== "loaded") return;

        this.setState(prevState => {
            if (prevState.status !== "loaded") return prevState;
            return { ...prevState, searching: true };
        });

        this.request = userService.searchUser(text)
            .subscribe(
                res => {
                    this.setState(prevState => {
                        if (prevState.status !== "loaded") return prevState;
                        return { ...prevState, searching: false, searchResults: res.data };
                    });
                }
            );
    };
}

export default FriendsPage;
