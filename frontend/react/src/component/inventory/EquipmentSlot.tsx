import React, { CSSProperties } from "react";
import styles from "./EquipmentSlot.module.scss";
import { InventoryEntry } from "../../backend/inventory";
import classNames from "classnames";
import LoadingSpinner from "../LoadingSpinner";

interface Props {
    item: InventoryEntry | "loading" | null;
    style?: CSSProperties
}

const EquipmentSlot: React.FC<Props> = ({ item, style, children }) => <div className={classNames(styles.EquipmentSlot, { [styles.equipped]: item !== "loading" && item !== null }, { [styles.loading]: item === "loading" })} style={style}>
    {item === "loading" ?
        <LoadingSpinner style={{ width: "100%", height: "100%" }} />
    : item === null ?
        children
    :
        <img src={item.item.baseItem.img16} alt={item.item.baseItem.friendlyName + " sprite"} />
    }
</div>;

export default EquipmentSlot;
