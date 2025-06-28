export type FriendsResponse = Friends;

export type ChangeFriendshipRequest = {
    userId: number;
}

export type ChangeFriendshipResponse = Friendship;

export interface Friends {
    friendInfos: FriendInfo[];
}

export interface FriendInfo {
    userId: number;
    username: string;
    friendship: Friendship;
}

export type Friendship = "none" | "request-sent" | "request-received" | "confirmed";
