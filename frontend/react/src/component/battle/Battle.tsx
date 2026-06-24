import React, { useState } from "react";

import { Battle as BattleData, BattleReward, MappedUnitEffects } from "../../backend/battle";
import { MyUnit } from "../../backend/squad";
import PBBGUnit from "../PBBGUnit";
import styles from "./Battle.module.scss";
import BattleActions from "./BattleActions";
import BattleLog from "./BattleLog";
import BattleQueue from "./BattleQueue";

export type SidedUnit = MyUnit & { side: "ally" | "enemy" };

type Props = {
    battle: BattleData;
    onAllyTurn: (unitId: number) => void;
    onEnemyTurn: () => void;
    performingAction: boolean;
    effects: MappedUnitEffects[];
    reward: BattleReward | null;
};

const Battle: React.FC<Props> = ({ battle, onAllyTurn, onEnemyTurn, performingAction, effects, reward }) => {
    const [hoveredUnitId, setHoveredUnitId] = useState<number | null>(null);
    const [selectingTarget, setSelectingTarget] = useState(false);

    const battleIsOver = reward !== null;
    const nextUnitId = battle.turns[0].unitId;
    const currentSide = battle.allies.some(ally => nextUnitId === ally.id) ? "ally" : "enemy";

    const handleUnitEnter = (unitId: number) => setHoveredUnitId(unitId);

    const handleUnitLeave = () => setHoveredUnitId(null);

    const handleAllyTurn = () => setSelectingTarget(true);

    const handleSelectTarget = (unitId: number) => {
        setSelectingTarget(false);
        onAllyTurn(unitId);
    };

    const handleCancelTargeting = () => setSelectingTarget(false);

    const createOverlay = () => <div className={styles.overlay}>
        <div>
            <button className="fancy danger" onClick={handleCancelTargeting}>Cancel</button>
            <span>Select target</span>
        </div>
    </div>;

    return <div className={styles.Battle} data-overlay-active={selectingTarget ? "" : undefined} data-battle-over={battleIsOver ? "" : undefined}>
        {selectingTarget &&
            createOverlay()
        }
        {!battleIsOver &&
            <BattleQueue battle={battle} onUnitEnter={handleUnitEnter} onUnitLeave={handleUnitLeave} hoveredUnit={hoveredUnitId} className={styles.BattleQueue} />
        }
        <div className={`${styles["allies-container"]} ${styles["unit-list-section"]}`}>
            <h1>Allies</h1>
            <ul>
                {battle.allies.map(ally => <li key={ally.id}><PBBGUnit
                    className={styles.PBBGUnit}
                    unit={ally}
                    facing="right"
                    data-side="ally"
                    data-current-turn={ally.id === nextUnitId ? "" : undefined}
                    data-hovered={ally.id === hoveredUnitId ? "" : undefined}
                    onMouseEnter={() => handleUnitEnter(ally.id)}
                    onMouseLeave={handleUnitLeave}
                    {...(selectingTarget && ally.id !== nextUnitId && ally.hp > 0 &&
                        { onClick: () => handleSelectTarget(ally.id) }
                    )}
                /></li>)}
            </ul>
        </div>
        <div className={`${styles["enemies-container"]} ${styles["unit-list-section"]}`}>
            <h1>Enemies</h1>
            <ul>
                {battle.enemies.map(enemy => <li key={enemy.id}><PBBGUnit
                    className={styles.PBBGUnit}
                    unit={enemy}
                    facing="left"
                    data-side="enemy"
                    data-current-turn={enemy.id === nextUnitId ? "" : undefined}
                    data-hovered={enemy.id === hoveredUnitId ? "" : undefined}
                    onMouseEnter={() => handleUnitEnter(enemy.id)}
                    onMouseLeave={handleUnitLeave}
                    {...(selectingTarget && enemy.id !== nextUnitId && enemy.hp > 0 &&
                        { onClick: () => handleSelectTarget(enemy.id) }
                    )}
                /></li>)}
            </ul>
        </div>
        {!battleIsOver &&
            <BattleActions performingAction={performingAction} className={styles.BattleActions} {...(currentSide === "ally" ? {
                enemyTurn: false,
                onProcessAllyTurn: handleAllyTurn
            } : {
                enemyTurn: true,
                onProcessEnemyTurn: onEnemyTurn
            })} />
        }
        <BattleLog effects={effects} reward={reward} onUnitNameEnter={handleUnitEnter} onUnitNameLeave={handleUnitLeave} className={styles.BattleLog} units={new Map(
            battle.allies.map(ally => ({ ...ally, side: "ally" }) as SidedUnit)
                .concat(battle.enemies.map(enemy => ({ ...enemy, side: "enemy" }) as SidedUnit))
                .map(unit => [unit.id, unit])
        )} />
    </div>;
};

export default Battle;
