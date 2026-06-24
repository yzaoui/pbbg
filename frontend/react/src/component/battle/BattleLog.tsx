import classNames from "classnames";
import React, { useEffect, useRef } from "react";

import { BattleReward, MappedUnitEffects } from "../../backend/battle";
import { SidedUnit } from "./Battle";
import styles from "./BattleLog.module.scss";
import HealthEffectResult from "./HealthEffectResult";

interface Props {
    effects: MappedUnitEffects[];
    reward: BattleReward | null;
    units: Map<number, SidedUnit>;
    onUnitNameEnter: (unitId: number) => void;
    onUnitNameLeave: (unitId: number) => void;
    className?: string;
}

const BattleLog: React.FC<Props> = ({ effects, reward, units, onUnitNameEnter, onUnitNameLeave, className }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [effects.length, reward]);

    return <div className={classNames(styles.BattleLog, className)}>
        <h1>Log</h1>
        <div ref={scrollRef}>
            <ol>
                {effects.map((mappedEffect, i) => Object.entries(mappedEffect).map(([id, effect]) => {
                    const unitId = parseInt(id);

                    return <HealthEffectResult
                        key={i}
                        unit={units.get(unitId)!}
                        effect={effect}
                        onUnitNameEnter={() => onUnitNameEnter(unitId)}
                        onUnitNameLeave={() => onUnitNameLeave(unitId)}
                    />;
                }))}
                {reward &&
                    <BattleRewardResult {...reward} />
                }
            </ol>
        </div>
    </div>;
};

const BattleRewardResult: React.FC<BattleReward> = () => <li>[BATTLE OVER RESULTS]</li>;

export default BattleLog;
