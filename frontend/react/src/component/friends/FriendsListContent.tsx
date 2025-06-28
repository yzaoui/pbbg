import React from "react";
import { Friends } from "../../backend/friends";
import FriendsSectionHeader from "./FriendsSectionHeader";
import FriendUL from "./FriendUL";

interface LoadingProps {
    loading: true;
}

interface LoadedProps {
    loading?: false;
    friends: Friends;
}

type Props = LoadingProps | LoadedProps;

const FriendsListContent: React.FC<Props> = (props) => {
    return <div className="FriendsListContent">
        <FriendsSectionHeader>
            <span>YOUR FRIENDS</span>
        </FriendsSectionHeader>
        {props.loading ?
            <FriendUL loading />
        : (() => {
            const confirmedFriends = props.friends.friendInfos.filter(user => user.friendship === "confirmed");

            return confirmedFriends.length > 0 ?
                <FriendUL friendInfos={confirmedFriends} />
            :
                <div><i>You have no friends.</i></div>;
        })()}
    </div>;
};

export default FriendsListContent;
