import { Point } from "./inventory";
import { BasePlantJSON } from "./farm";

/**
 * /dex/items
 */
export type ItemsResponse = DexItems;

/**
 * /dex/items/:id
 */
export type ItemIndividualResponse = DexItem;

/**
 * /dex/units
 */
export type UnitsResponse = DexUnits;

/**
 * /dex/units/:id
 */
export type UnitIndividualResponse = MyUnitEnum;

/**
 * /dex/plants
 */
export type PlantsResponse = DexPlants;

/**
 * /dex/plants/:id
 */
export type PlantIndividualResponse = BasePlantJSON;

export interface DexItems {
    discoveredItems: {[id: number]: BaseItem};
    lastItemId: number;
}

export type DexItem = DiscoveredDexItem | UndiscoveredDexItem;

export interface DiscoveredDexItem {
    type: "discovered";
    baseItem: BaseItem;
}

export interface UndiscoveredDexItem {
    type: "undiscovered";
    id: number;
}

export interface BaseItem {
    id: number;
    friendlyName: string;
    img16: string;
    img32: string;
    img64: string;
    description: string;
}

export interface GridPreviewable {
    grid: Point[];
}

export const isGridPreviewable = (item: BaseItem | (BaseItem & GridPreviewable)): item is BaseItem & GridPreviewable =>
    "grid" in item && typeof(item["grid"]) === "object" && item["grid"] !== null;

export interface DexUnits {
    discoveredUnits: Record<number, MyUnitEnum>;
    lastUnitId: number;
}

export interface MyUnitEnum {
    id: number;
    friendlyName: string;
    description: string;
    iconURL: string;
    fullURL: string;
    baseHP: string;
    baseAtk: string;
    baseDef: string;
    baseInt: string;
    baseRes: string;
}

export interface DexPlants {
    discoveredPlants: Record<number, BasePlantJSON>;
    lastPlantId: number;
}
