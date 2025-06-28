import React, { HTMLAttributes } from "react";
import { MyUnit } from "../backend/squad";
import "./PBBGUnit.scss"
import PBBGLevelProgress from "./PBBGLevelProgress";
import PBBGProgressBar from "./PBBGProgressBar";

interface Props extends HTMLAttributes<HTMLDivElement> {
    unit: MyUnit;
    facing?: "left" | "right";
}

const PBBGUnit: React.FC<Props> = ({ unit, facing = "right", ...rest }) =>
    <div
        className="PBBGUnit"
        data-facing={facing}
        data-dead={unit.hp === 0 ? "" : undefined}
        {...rest}
    >
        <img src={unit.idleAnimationURL} className="sprite" alt={unit.name + " sprite"} />
        <div>
            <div>
                <span className="name">{unit.name}</span>
            </div>
            <div>
                <span>HP: </span>
                <PBBGProgressBar className="hp-bar" value={unit.hp} max={unit.maxHP} />
                <span>{unit.hp} / {unit.maxHP}</span>
            </div>
            <div>
                <span className="stat-container">ATK: {unit.atk}</span>
                <span className="stat-container">DEF: {unit.def}</span>
            </div>
            <div>
                <span>Level {unit.levelProgress.level}</span>
                <PBBGLevelProgress className="exp-bar" level={unit.levelProgress.level} value={unit.levelProgress.relativeExp} max={unit.levelProgress.relativeExpToNextLevel} />
                <span>{unit.levelProgress.relativeExp} / {unit.levelProgress.relativeExpToNextLevel}</span>
            </div>
        </div>
    </div>;

export default PBBGUnit;
