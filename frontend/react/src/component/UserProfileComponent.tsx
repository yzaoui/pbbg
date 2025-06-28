import React from "react";
import { UserProfile } from "../backend/user";
import LoadingButton from "./LoadingButton";
import { Friendship } from "../backend/friends";

interface Props {
    userProfile: UserProfile;
    onChangeFriendship: (currentFriendship: Friendship) => void;
    changingFriendship: boolean;
}

const UserProfileComponent: React.FC<Props> = ({ userProfile: { username, joinedDate, friendship }, onChangeFriendship, changingFriendship }) => <div className="UserProfileComponent">
    <h1>{username}</h1>
    <div>Joined on {(new Date(joinedDate)).toDateString()}</div>
    {friendship !== null && <>
        <span>{spanText(friendship)}</span>
        <LoadingButton loading={changingFriendship} onClick={() => onChangeFriendship(friendship)}>{buttonText(friendship)}</LoadingButton>
    </>}
</div>;

const spanText = (friendship: Friendship) => {
    switch (friendship) {
        case "none": return "You are not friends.";
        case "request-sent": return "Friend request sent.";
        case "request-received": return "Friend request received.";
        case "confirmed": return "You are friends.";
    }
};

const buttonText = (friendship: Friendship) => {
    switch (friendship) {
        case "none": return "Add Friend";
        case "request-sent": return "Cancel Friend Request";
        case "request-received": return "Accept Friend Request";
        case "confirmed": return "Unfriend";
    }
};

export default UserProfileComponent;
