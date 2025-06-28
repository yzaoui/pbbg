import React, { MouseEventHandler } from "react";
import styles from "./PlotProgressButton.module.scss";

type Props = {
    percentage: number;
    label: string;
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
};

const PlotProgressButton: React.FC<Props> = ({ percentage, label, disabled, onClick }) => <button className={styles.PlotProgressButton} disabled={disabled} onClick={onClick}>
    <div className={styles.inner} style={{ width: percentage * 100 + "%"}} />
    <span className={styles.label}>{label}</span>
</button>;

export default PlotProgressButton;
