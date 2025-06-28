import { LevelProgress } from "./user-stats";

/**
 * /squad
 */
export type SquadResponse = Squad

export interface Squad {
    units: MyUnit[];
}

interface MyUnit {
    id: number;
    name: string;
    baseUnitId: number;
    hp: number;
    maxHP: number;
    atk: number;
    def: number;
    levelProgress: LevelProgress;
    idleAnimationURL: string;
    iconURL: string;
}
