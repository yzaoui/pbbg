import classNames from "classnames";
import React, { useEffect, useRef } from "react";

import styles from "./PBBGLevelProgress.module.scss";

interface Props {
    className?: string;
    level: number;
    value: number;
    max: number;
}

const PBBGLevelProgress: React.FC<Props> = ({ className, level, value, max }) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<number>(null);
    const currentProgressRef = useRef({ level, percentage: max > 0 ? value / max : 0 });
    const targetProgressRef = useRef({ level, percentage: max > 0 ? value / max : 0 });
    const currentStepRef = useRef(0);

    useEffect(() => {
        const prevPct = currentProgressRef.current.percentage;
        const prevLevel = currentProgressRef.current.level;
        const currPct = max > 0 ? value / max : 0;

        const diff = (level - prevLevel) + (currPct - prevPct);
        if (diff === 0) return;

        targetProgressRef.current = {
            level: level,
            percentage: currPct
        };
        currentStepRef.current = diff / 30;

        if (timerRef.current != null) {
            clearInterval(timerRef.current);
        }

        const onStep = () => {
            let nextProgress = {
                level: currentProgressRef.current.level,
                percentage: currentProgressRef.current.percentage + currentStepRef.current
            };

            if (nextProgress.percentage >= 1 || nextProgress.percentage < 0) {
                let newPct = nextProgress.percentage % 1;
                let excessLvl = Math.trunc(nextProgress.percentage);

                if (newPct < 0) {
                    newPct += 1;
                    excessLvl -= 1;
                }

                nextProgress = {
                    level: nextProgress.level + excessLvl,
                    percentage: newPct
                };
            }

            if ((currentStepRef.current > 0 && (nextProgress.level > targetProgressRef.current.level || (nextProgress.level === targetProgressRef.current.level && nextProgress.percentage > targetProgressRef.current.percentage))) ||
                (currentStepRef.current < 0 && (nextProgress.level < targetProgressRef.current.level || (nextProgress.level === targetProgressRef.current.level && nextProgress.percentage < targetProgressRef.current.percentage)))) {
                nextProgress = targetProgressRef.current;
                if (timerRef.current != null) {
                    clearInterval(timerRef.current);
                }
            }

            currentProgressRef.current = nextProgress;

            if (innerRef.current) {
                innerRef.current.style.width = `${currentProgressRef.current.percentage * 100}%`;
            }
        };

        timerRef.current = window.setInterval(onStep, 10);

        return () => {
            if (timerRef.current != null) {
                clearInterval(timerRef.current);
            }
        };
    }, [level, value, max]);

    return <div className={classNames(styles.PBBGLevelProgress, className)}>
        <div className={styles.outer}>
            <div ref={innerRef} className={styles.inner} style={{ width: `${currentProgressRef.current.percentage * 100}%` }} />
        </div>
    </div>;
};

export default PBBGLevelProgress;
