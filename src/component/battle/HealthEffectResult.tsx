import React from "react";
import { SidedUnit } from "./Battle";
import { HealthEffect } from "../../backend/battle";

interface Props {
    unit: SidedUnit;
    effect: HealthEffect;
    onUnitNameEnter: () => void;
    onUnitNameLeave: () => void;
}

const HealthEffectResult: React.FC<Props> = ({ unit, effect, onUnitNameEnter, onUnitNameLeave }) => <li className="HealthEffectResult">
    <span className={unit.side} onMouseEnter={onUnitNameEnter} onMouseLeave={onUnitNameLeave}>
        {unit.name}
    </span> took <span className="damage">{-effect.delta}</span> damage
</li>;

export default HealthEffectResult;
