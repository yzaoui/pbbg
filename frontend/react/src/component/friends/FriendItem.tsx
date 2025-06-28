import React from "react";

interface Props {
    username: string
}

const FriendItem: React.FC<Props> = ({ username }) => <div className="FriendItem">
    {username}
</div>;

export default FriendItem;
