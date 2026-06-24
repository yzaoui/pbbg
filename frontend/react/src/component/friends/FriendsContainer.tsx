import React from "react";

import { FriendInfo, Friends } from "../../backend/friends";
import FriendsContent from "./FriendsContent";
import FriendsNav from "./FriendsNav";

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

type Props = LoadingProps | LoadedProps;

const FriendsContainer: React.FC<Props> = (props) => {
    return <div className="FriendsContainer">
        <FriendsNav />
        {props.loading ?
            <FriendsContent
                loading
            />
        :
            <FriendsContent
                friends={props.friends}
                searchResults={props.searchResults}
                searching={props.searching}
                onSearchUser={props.onSearchUser}
            />
        }
    </div>;
};

export default FriendsContainer;
