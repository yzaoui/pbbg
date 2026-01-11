import React, {HTMLAttributes} from "react";
import styles from "./PBBGUnit.module.scss";
import PBBGLevelProgress from "./PBBGLevelProgress";
import PBBGProgressBar from "./PBBGProgressBar";
import classNames from "classnames";
import {LevelProgress} from "../backend/user-stats";

interface Props extends HTMLAttributes<HTMLDivElement> {
    unit: Unit;
    facing?: "left" | "right";
}

export interface Unit {
    name: string;
    hp: number;
    maxHP: number;
    atk: number;
    def: number;
    levelProgress: LevelProgress;
    idleAnimationURL: string;
}

const PBBGUnit: React.FC<Props> = ({ unit, facing = "right", className, ...rest }) =>
    <div
        className={classNames(styles.PBBGUnit, className)}
        data-facing={facing}
        data-dead={unit.hp === 0 ? "" : undefined}
        {...rest}
    >
        <img src={unit.idleAnimationURL} className={styles.sprite} alt={unit.name + " sprite"} />
        <div>
            <div>
                <span className={styles.name}>{unit.name}</span>
            </div>
            <div>
                <span>HP: </span>
                <PBBGProgressBar className={styles["hp-bar"]} value={unit.hp} max={unit.maxHP} />
                <span>{unit.hp} / {unit.maxHP}</span>
            </div>
            <div>
                <span className={styles["stat-container"]}>ATK: {unit.atk}</span>
                <span className={styles["stat-container"]}>DEF: {unit.def}</span>
            </div>
            <div>
                <span>Level {unit.levelProgress.level}</span>
                <PBBGLevelProgress className={styles["exp-bar"]} level={unit.levelProgress.level} value={unit.levelProgress.relativeExp} max={unit.levelProgress.relativeExpToNextLevel} />
                <span>{unit.levelProgress.relativeExp} / {unit.levelProgress.relativeExpToNextLevel}</span>
            </div>
        </div>
    </div>;

export default PBBGUnit;
