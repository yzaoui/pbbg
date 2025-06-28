import React, { HTMLAttributes } from "react";
import styles from "./LoadingSpinner.module.scss";

const LoadingSpinner: React.FC<HTMLAttributes<HTMLDivElement>> = ({ ...rest }) => <div
    className={styles.spinner}
    {...rest}
/>;

export default LoadingSpinner;
