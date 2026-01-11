import React from "react";
import { Link } from "react-router-dom";
import { BaseItem } from "../../backend/dex";
import styles from "./DexEntry.module.scss";

interface Props {
    id: string;
    item: BaseItem;
}

const DexItemEntry: React.FC<Props> = ({ id, item }) => <li className={styles["entry-li"]}>
    <Link to={"/dex/items/" + id} className={styles["entry-container"]}>
        <span>#{id}</span>
        <img src={item.img16} alt={item.friendlyName + " sprite"} />
        <span>{item.friendlyName}</span>
    </Link>
</li>;

export default DexItemEntry;
