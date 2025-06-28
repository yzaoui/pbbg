import React, { ChangeEventHandler } from "react";
import FriendUL from "./FriendUL";
import { FriendInfo } from "../../backend/friends";

interface Props {
    searchText: string;
    searching: boolean;
    searchResults: FriendInfo[] | null;
    handleValueChange: ChangeEventHandler<HTMLInputElement>;
}

const AddFriendsContentBody: React.FC<Props> = (props) => <div className="AddFriendsContentBody">
    <input
        type="text"
        placeholder="Enter your friend's username"
        value={props.searchText}
        onChange={props.handleValueChange}
    />
    {props.searching ?
        <FriendUL loading />
    : props.searchResults !== null ?
        props.searchResults.length > 0 ?
            <FriendUL friendInfos={props.searchResults} />
            :
            <div><i>No users found</i></div>
    : <></>}
</div>;

export default AddFriendsContentBody;
