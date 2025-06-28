import { MaterializedItem } from "./inventory";

export type ItemResponse = ItemDetails;

export interface ItemDetails {
    item: MaterializedItem;
    history: ItemHistory[];
    linkedUserInfo: Record<number, string>;
}

export interface ItemHistory {
    date: number;
    info: ItemHistoryInfo;
}

export type ItemHistoryInfo = {
    type: "created-user";
    userId: number;
} | {
    type: "created-market";
} | {
    type: "first-mined";
    userId: number;
} | {
    type: "first-harvested";
    userId: number;
};
