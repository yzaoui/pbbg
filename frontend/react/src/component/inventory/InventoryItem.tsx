import React, { HTMLAttributes } from "react";

import { InventoryEntry, isEquippable, isStackable } from "../../backend/inventory";
import styles from "./InventoryItem.module.scss";

interface Props extends HTMLAttributes<HTMLDivElement> {
    inventoryEntry: InventoryEntry;
}

const InventoryItem: React.FC<Props> = ({ inventoryEntry, ...rest }) => <div className={styles.InventoryItem} {...rest}>
    <img src={inventoryEntry.item.baseItem.img16} alt={inventoryEntry.item.baseItem.friendlyName + " sprite"} />
    {isStackable(inventoryEntry.item) &&
        <span className={styles.quantity}>{inventoryEntry.item.quantity}</span>
    }
    {isEquippable(inventoryEntry) && inventoryEntry.equipped &&
        <span className={styles.equipped} title="Currently equipped">E</span>
    }
</div>;

export default InventoryItem;
