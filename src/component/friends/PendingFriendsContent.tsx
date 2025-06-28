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

const PendingFriendsContent: React.FC<Props> = (props) => <div className="PendingFriendsContent">
    <FriendsSectionHeader>
        <span>RECEIVED INVITES</span>
    </FriendsSectionHeader>
    {props.loading ?
        <FriendUL loading />
    : (() => {
        const receivedInvites = props.friends.friendInfos.filter(user => user.friendship === "request-received");

        return receivedInvites.length > 0 ?
            <FriendUL friendInfos={receivedInvites} />
        :
            <div><i>You have no pending friend invites.</i></div>;
    })()}
    <FriendsSectionHeader>
        <span>SENT INVITES</span>
    </FriendsSectionHeader>
    {props.loading ?
        <FriendUL loading />
    : (() => {
        const sentInvites = props.friends.friendInfos.filter(user => user.friendship === "request-sent");

        return sentInvites.length > 0 ?
            <FriendUL friendInfos={sentInvites} />
        :
            <div><i>You have no pending sent invites.</i></div>;
    })()}
</div>;

export default PendingFriendsContent;
