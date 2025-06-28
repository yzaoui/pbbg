import { BaseItem } from "./dex";

/**
 * /inventory
 */
export type InventoryResponse = Inventory

/**
 * /inventory/equipment
 */
export type EquipUnequipRequest = {
    inventoryItemId: number;
}

export interface Inventory {
    items: InventoryEntry[];
    equipment: Equipment;
}

export interface Equipment {
    pickaxe: InventoryEntry | null;
}

export interface InventoryEntry {
    item: MaterializedItem;
}

export type MaterializedItem = {
    id: number;
    baseItem: BaseItem;
} & Partial<Stackable>;

export interface Stackable {
    quantity: number;
}

export interface Equippable {
    equipped: boolean;
}

export interface Point {
    x: number;
    y: number;
}

export const isStackable = (item: MaterializedItem): item is MaterializedItem & Stackable => "quantity" in item && typeof(item["quantity"]) === "number";
export const isEquippable = (item: InventoryEntry | (InventoryEntry & Equippable)): item is InventoryEntry & Equippable =>
    "equipped" in item && typeof(item["equipped"]) === "boolean";
