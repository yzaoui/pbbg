import React from "react";
import { Link } from "react-router-dom";
import { InventoryEntry, isEquippable, isStackable } from "../../backend/inventory";
import styles from "./InventoryItemTooltip.module.scss";
import GridPreview from "../GridPreview";
import { isGridPreviewable } from "../../backend/dex";
import classNames from "classnames";

interface Props {
    inventoryEntry: InventoryEntry;
    equip?: () => void;
    unequip?: () => void;
    equipDisabled?: boolean;
    className?: string;
}

const InventoryItemTooltip: React.FC<Props> = ({ inventoryEntry, equip, unequip, equipDisabled, className }) => <div
    className={classNames(styles.InventoryItemTooltip, className)}
>
    <div><Link to={`/item/${inventoryEntry.item.id}`}>{inventoryEntry.item.baseItem.friendlyName}</Link></div>
    {isStackable(inventoryEntry.item) && <>
        <hr />
        <div>Quantity: {inventoryEntry.item.quantity}</div>
    </>}
    {isEquippable(inventoryEntry) && <>
        <hr />
        <button className="fancy" onClick={inventoryEntry.equipped ? unequip : equip} disabled={equipDisabled}>
            {inventoryEntry.equipped ? "Unequip" : "Equip"}
        </button>
    </>}
    {isGridPreviewable(inventoryEntry.item.baseItem) && <>
        <hr />
        <GridPreview grid={inventoryEntry.item.baseItem.grid} center={{ x: 1, y: 1 }} />
    </>}
    <hr />
    <div><i>{inventoryEntry.item.baseItem.description}</i></div>
</div>;

export default InventoryItemTooltip;
