import React from "react";
import { Route, match } from "react-router-dom";
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

type Props = (LoadingProps | LoadedProps) & {
    match: match;
};

const FriendsContent: React.FC<Props> = ({ match, ...rest }) => <div className="FriendsContent">
    <Route path={`${match.path}/`} exact>
        {rest.loading ?
            <FriendsListContent loading />
        :
            <FriendsListContent friends={rest.friends} />
        }
    </Route>
    <Route path={`${match.path}/add`} exact>
        {rest.loading ?
            <AddFriendsContent loading />
        :
            <AddFriendsContent searchResults={rest.searchResults} searching={rest.searching} onSearchUser={rest.onSearchUser} />
        }
    </Route>
    <Route path={`${match.path}/pending`} exact>
        {rest.loading ?
            <PendingFriendsContent loading />
        :
            <PendingFriendsContent friends={rest.friends} />
        }
    </Route>
</div>;

export default FriendsContent;
