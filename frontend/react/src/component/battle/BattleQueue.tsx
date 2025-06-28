import React from "react";
import { Battle as BattleData } from "../../backend/battle";
import "./BattleQueue.scss";

interface Props {
    battle: BattleData;
    onUnitEnter: (unitId: number) => void;
    onUnitLeave: (unitId: number) => void;
    hoveredUnit: number | null;
}

const BattleQueue: React.FC<Props> = ({ battle, onUnitEnter, onUnitLeave, hoveredUnit }) => <div className="BattleQueue">
    <span><b>Turn Order ►</b></span>
    <ol>{combineBattleToQueue(battle).map(({ unit, side }) =>
        <li
            key={unit.id}
            data-side={side}
            onMouseEnter={() => onUnitEnter(unit.id)}
            onMouseLeave={() => onUnitLeave(unit.id)}
            data-hovered={hoveredUnit === unit.id ? "" : undefined}
        >
            <img src={unit.iconURL} alt={unit.name + " icon"} />
        </li>
    )}</ol>
</div>;

const combineBattleToQueue = (battle: BattleData) => battle.turns.map(turn => {
    const ally = battle.allies.find(ally => ally.id === turn.unitId);
    const enemy = battle.enemies.find(enemy => enemy.id === turn.unitId);

    if (ally) return {
        unit: ally,
        side: "ally"
    };

    else if (enemy) return {
        unit: enemy,
        side: "enemy"
    };

    else throw Error();
});

export default BattleQueue;
