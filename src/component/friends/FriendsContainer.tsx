import React from "react";
import FriendsNav from "./FriendsNav";
import FriendsContent from "./FriendsContent";
import { FriendInfo, Friends } from "../../backend/friends";
import { match } from "react-router-dom";

interface LoadingProps {
    loading: true;
}

interface LoadedProps {
    loading?: false;
    friends: Friends;
    searchResults: FriendInfo[] | null;
    searching: boolean;
    onSearchUser: (text: string) => void;
}

type Props = (LoadingProps | LoadedProps) & {
    match: match;
};

const FriendsContainer: React.FC<Props> = (props) => {
    return <div className="FriendsContainer">
        <FriendsNav match={props.match} />
        {props.loading ?
            <FriendsContent
                loading
                match={props.match}
            />
        :
            <FriendsContent
                match={props.match}
                friends={props.friends}
                searchResults={props.searchResults}
                searching={props.searching}
                onSearchUser={props.onSearchUser}
            />
        }
    </div>;
};

export default FriendsContainer;
