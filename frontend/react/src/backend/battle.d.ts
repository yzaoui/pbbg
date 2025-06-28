import { MyUnit } from "./squad";
import { MaterializedItem } from "./inventory";

/**
 * /battle/session
 */
type BattleResponse = Battle | null;

/**
 * /battle/session?action=generate
 */
type BattleGenerateResponse = Battle;

/**
 * /battle/allyTurn
 */
type BattleAllyTurnRequest = {
    targetUnitId: number;
};
type BattleAllyTurnResponse = BattleActionResult;

/**
 * /battle/enemyTurn
 */
type BattleEnemyTurnResponse = BattleActionResult;

interface Battle {
    allies: MyUnit[];
    enemies: MyUnit[];
    turns: Turn[];
}

interface Turn {
    unitId: number;
}

interface BattleActionResult {
    battle: Battle;
    unitEffects: MappedUnitEffects;
    reward: BattleReward | null;
}

type MappedUnitEffects = Record<number, UnitEffect>;

type UnitEffect = HealthEffect;

interface HealthEffect {
    type: "health";
    delta: number;
}

interface BattleReward {
    gold: number;
    items: MaterializedItem[];
}
