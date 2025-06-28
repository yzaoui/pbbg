import React from "react";
import { FriendInfo } from "../../backend/friends";
import FriendItem from "./FriendItem";
import { Link } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";

interface LoadingProps {
    loading: true;
}

interface LoadedProps {
    loading?: false;
    friendInfos: FriendInfo[];
}

type Props = LoadingProps | LoadedProps;

const FriendUL: React.FC<Props> = (props) => <ul className="FriendUL">
    {props.loading ?
        <LoadingSpinner />
    :
        props.friendInfos.map(friend =>
            <li key={friend.userId}>
                <Link to={`/user/${friend.userId}`}>
                    <FriendItem username={friend.username} />
                </Link>
            </li>
        )
    }
</ul>;

export default FriendUL;
