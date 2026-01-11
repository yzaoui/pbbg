import React from "react";
import { Link } from "react-router-dom";
import { MyUnitEnum } from "../../backend/dex";
import styles from "./DexEntry.module.scss";
import classNames from "classnames";

interface Props {
    id: string;
    unit: MyUnitEnum;
}

const DexUnitEntry: React.FC<Props> = ({ id, unit }) => <li className={styles["entry-li"]}>
    <Link to={"/dex/units/" + id} className={classNames(styles["entry-container"], styles.unit)}>
        <span>#{id}</span>
        <img src={unit.iconURL} alt={unit.friendlyName + " sprite"} />
        <span>{unit.friendlyName}</span>
    </Link>
</li>;

export default DexUnitEntry;
