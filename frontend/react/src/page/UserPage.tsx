import React from "react";
import { RouteComponentProps } from "react-router";
import { Subscription } from "rxjs";
import userService from "../backend/user.service";
import { UserProfile } from "../backend/user";
import { Helmet } from "react-helmet";
import LoadingSpinner from "../component/LoadingSpinner";
import UserProfileComponent from "../component/UserProfileComponent";
import "./UserPage.scss";
import { Friendship } from "../backend/friends";
import friendsService from "../backend/friends.service";

interface Props extends RouteComponentProps<{ id: string }> {}

interface LoadingState {
    status: "loading";
}

interface LoadedState {
    status: "loaded";
    userProfile: UserProfile;
    changingFriendship: boolean;
}

interface ErrorState {
    status: "error";
}

type State = LoadingState | LoadedState | ErrorState;

class UserPage extends React.Component<Props, State> {
    readonly state: Readonly<State> = {
        status: "loading"
    };

    request?: Subscription;

    componentDidMount() {
        this.request = userService.getUserProfile(this.props.match.params.id)
            .subscribe({
                next: value => this.setState({ status: "loaded", userProfile: value.data, changingFriendship: false }),
                error: err => this.setState({ status: "error" })
            });
    }

    componentWillUnmount() {
        this.request && this.request.unsubscribe();
    }

    render() {
        switch (this.state.status) {
            case "loading": return <>
                <Helmet title="Loading… - User - PBBG" />
                <div><LoadingSpinner /></div>
            </>;
            case "loaded": return <>
                <Helmet title={`${this.state.userProfile.username} - User - PBBG`} />
                <UserProfileComponent userProfile={this.state.userProfile} onChangeFriendship={this.handleChangeFriendship} changingFriendship={this.state.changingFriendship} />
            </>;
            case "error": return <div>ERROR</div>;
        }
    }

    private handleChangeFriendship = (currentFriendship: Friendship) => {
        if (this.state.status !== "loaded") return;

        this.setState({ ...this.state, changingFriendship: true });

        this.request = friendsService.changeFriendship(friendshipToAction(currentFriendship), { userId: this.state.userProfile.id } )
            .subscribe(res => this.setState(prevState => {
                if (prevState.status !== "loaded") return prevState;

                const updatedUserProfile = Object.assign({}, prevState.userProfile);
                updatedUserProfile.friendship = res.data;

                return { ...prevState, changingFriendship: false, userProfile: updatedUserProfile };
            }));
    };
}

const friendshipToAction = (friendship: Friendship) => {
    switch (friendship) {
        case "confirmed": return "remove-friend";
        case "request-received": return "accept-request";
        case "request-sent": return "cancel-request";
        case "none": return "add-friend";
    }
};

export default UserPage;
