import * as React from "react";
import { Link } from "react-router-dom";

import styles from "./DexReturnLink.module.scss";

interface Props {
    to: string;
    label: string;
}

const DexReturnLink: React.FC<Props> = ({ to, label }) =>
    <div style={{ display: "inline-flex" }}>
        <Link to={to} className={styles.return}><span role="img" aria-label="Back">⬅</span> {label}</Link>
    </div>;

export default DexReturnLink;
