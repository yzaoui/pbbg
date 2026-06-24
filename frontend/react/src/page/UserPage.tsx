import "./UserPage.scss";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Subscription } from "rxjs";

import { Friendship } from "../backend/friends";
import friendsService from "../backend/friends.service";
import { UserProfile } from "../backend/user";
import userService from "../backend/user.service";
import LoadingSpinner from "../component/LoadingSpinner";
import UserProfileComponent from "../component/UserProfileComponent";

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

const UserPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [state, setState] = useState<State>({ status: "loading" });
    const friendshipRequestRef = useRef<Subscription | null>(null);

    if (!id) throw new Error();

    useEffect(() => {
        const subscription = userService.getUserProfile(id).subscribe({
            next: value => setState({ status: "loaded", userProfile: value.data, changingFriendship: false }),
            error: _err => setState({ status: "error" })
        });

        return () => {
            subscription.unsubscribe();
            friendshipRequestRef.current?.unsubscribe();
        };
    }, [id]);

    const handleChangeFriendship = (currentFriendship: Friendship) => {
        if (state.status !== "loaded") return;

        // Cancel any in-flight friendship request
        friendshipRequestRef.current?.unsubscribe();

        setState(prevState => {
            if (prevState.status !== "loaded") return prevState;
            return { ...prevState, changingFriendship: true };
        });

        friendshipRequestRef.current = friendsService.changeFriendship(friendshipToAction(currentFriendship), { userId: state.userProfile.id })
            .subscribe(res => setState(prevState => {
                if (prevState.status !== "loaded") return prevState;

                const updatedUserProfile = Object.assign({}, prevState.userProfile);
                updatedUserProfile.friendship = res.data;

                return { ...prevState, changingFriendship: false, userProfile: updatedUserProfile };
            }));
    };

    const getTitle = () => {
        switch (state.status) {
            case "loading": return "Loading… - User - PBBG";
            case "loaded": return `${state.userProfile.username} - User - PBBG`;
            case "error": return "Error - User - PBBG";
        }
    };

    return <>
        <title>{getTitle()}</title>
        {(() => {
            switch (state.status) {
                case "loading": return <div><LoadingSpinner /></div>;
                case "loaded": return <UserProfileComponent userProfile={state.userProfile} onChangeFriendship={handleChangeFriendship} changingFriendship={state.changingFriendship} />;
                case "error": return <div>ERROR</div>;
            }
        })()}
    </>;
};

const friendshipToAction = (friendship: Friendship) => {
    switch (friendship) {
        case "confirmed": return "remove-friend";
        case "request-received": return "accept-request";
        case "request-sent": return "cancel-request";
        case "none": return "add-friend";
    }
};

export default UserPage;
