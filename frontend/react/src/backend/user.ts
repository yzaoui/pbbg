import { FriendInfo, Friendship } from "./friends";

export type UserResponse = UserProfile;

export type UserSearchResponse = FriendInfo[];

export interface UserProfile {
    id: number;
    username: string;
    joinedDate: string;
    friendship: Friendship | null;
}
