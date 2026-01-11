import React from "react";
import { SidedUnit } from "./Battle";
import { HealthEffect } from "../../backend/battle";
import styles from "./BattleLog.module.scss";

interface Props {
    unit: SidedUnit;
    effect: HealthEffect;
    onUnitNameEnter: () => void;
    onUnitNameLeave: () => void;
}

const HealthEffectResult: React.FC<Props> = ({ unit, effect, onUnitNameEnter, onUnitNameLeave }) => <li className={styles.HealthEffectResult}>
    <span className={styles[unit.side]} onMouseEnter={onUnitNameEnter} onMouseLeave={onUnitNameLeave}>
        {unit.name}
    </span> took <span className={styles.damage}>{-effect.delta}</span> damage
</li>;

export default HealthEffectResult;
