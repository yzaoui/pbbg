import React, { HTMLAttributes } from "react";

import { LevelProgress } from "../backend/user-stats";
import styles from "./LevelInfo.module.scss";
import PBBGLevelProgress from "./PBBGLevelProgress";

interface Props extends HTMLAttributes<HTMLDivElement> {
    levelProgress: LevelProgress;
}

const LevelInfo: React.FC<Props> = ({ levelProgress: { level, relativeExp, relativeExpToNextLevel }, ...rest }) => <div className={styles.LevelInfo} {...rest}>
    <PBBGLevelProgress className={styles["level-progress"]} level={level} value={relativeExp} max={relativeExpToNextLevel} />
    <span>Lv. {level} — {relativeExp} / {relativeExpToNextLevel}</span>
</div>;

export default LevelInfo;
