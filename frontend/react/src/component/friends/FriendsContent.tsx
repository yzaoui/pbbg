import React from "react";
import { Routes, Route } from "react-router-dom";
import { FriendInfo, Friends } from "../../backend/friends";
import FriendsListContent from "./FriendsListContent";
import AddFriendsContent from "./AddFriendsContent";
import PendingFriendsContent from "./PendingFriendsContent";

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

const FriendsContent: React.FC<Props> = (props) => <div className="FriendsContent">
    <Routes>
        <Route path="/" element={
            props.loading ?
                <FriendsListContent loading />
            :
                <FriendsListContent friends={props.friends} />
        } />
        <Route path="/add" element={
            props.loading ?
                <AddFriendsContent loading />
            :
                <AddFriendsContent searchResults={props.searchResults} searching={props.searching} onSearchUser={props.onSearchUser} />
        } />
        <Route path="/pending" element={
            props.loading ?
                <PendingFriendsContent loading />
            :
                <PendingFriendsContent friends={props.friends} />
        } />
    </Routes>
</div>;

export default FriendsContent;
