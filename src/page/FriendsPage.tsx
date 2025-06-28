import React from "react";
import { RouteComponentProps } from "react-router";
import { Subscription } from "rxjs";
import friendsService from "../backend/friends.service";
import { FriendInfo, Friends } from "../backend/friends";
import { Helmet } from "react-helmet";
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

class FriendsPage extends React.Component<RouteComponentProps, State> {
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
        <Helmet title="Friends - PBBG" />
        {this.renderContent()}
    </div>;

    renderContent = () => {
        switch (this.state.status) {
            case "loading": return<FriendsContainer
                loading
                match={this.props.match}
            />;
            case "loaded": return <FriendsContainer
                match={this.props.match}
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

        this.setState({ ...this.state, searching: true });

        this.request = userService.searchUser(text)
            .subscribe(
                res => {
                    if (this.state.status !== "loaded") return;

                    this.setState({ ...this.state, searching: false, searchResults: res.data })
                }
            );
    };
}

export default FriendsPage;
