import React, { ChangeEventHandler, useRef, useState } from "react";
import { FriendInfo } from "../../backend/friends";
import LoadingSpinner from "../LoadingSpinner";
import AddFriendsContentBody from "./AddFriendsContentBody";
import FriendsSectionHeader from "./FriendsSectionHeader";

interface LoadingProps {
    loading: true;
}

interface LoadedProps {
    loading?: false;
    searchResults: FriendInfo[] | null;
    searching: boolean;
    onSearchUser: (text: string) => void;
}

type Props = LoadingProps | LoadedProps;

const AddFriendsContent: React.FC<Props> = (props) => {
    const [value, setValue] = useState("");
    const searchTimeoutRef = useRef<number>(null);

    const handleValueChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const text = event.target.value;

        setValue(text);

        if (searchTimeoutRef.current !== null) clearTimeout(searchTimeoutRef.current);

        if (text.length > 0) {
            searchTimeoutRef.current = window.setTimeout(() => {
                if (!props.loading) {
                    props.onSearchUser(text);
                }
            }, 600);
        }
    };

    return <div className="AddFriendsContent">
        <FriendsSectionHeader>
            <span>ADD A FRIEND</span>
        </FriendsSectionHeader>
        {props.loading ?
            <LoadingSpinner />
        :
            <AddFriendsContentBody
                searchText={value}
                searching={props.searching}
                searchResults={props.searchResults}
                handleValueChange={handleValueChange}
            />
        }
    </div>;
};

export default AddFriendsContent;
