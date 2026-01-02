import React from "react";
import styles from "./PBBGProgressBar.module.scss";
import classNames from "classnames";

interface Props {
    className?: string;
    value: number
    max: number;
}

const PBBGProgressBar: React.FC<Props> = ({ className, value, max }) => <div className={classNames(styles.PBBGProgressBar, className)}>
    <div className={styles.outer}>
        <div className={styles.inner} style={{ width: `${(value / max) * 100}%` }} />
    </div>
</div>;

export default PBBGProgressBar;
