import React, { ChangeEventHandler } from "react";
import InventoryItem from "../inventory/InventoryItem";
import { InventoryEntry } from "../../backend/inventory";
import styles from "./PlantRadioOption.module.scss";

type Props = {
    inventoryEntry: InventoryEntry;
    checked: boolean;
    onChange: ChangeEventHandler<HTMLInputElement>;
};

const PlantRadioOption: React.FC<Props> = ({ inventoryEntry, checked, onChange }) => {
    const id = "plant-radio-option-" + inventoryEntry.item.id;

    return <div className={styles.PlantRadioOption}>
        <input type="radio" name="plant" id={id} value={inventoryEntry.item.id} checked={checked} onChange={onChange} />
        <label htmlFor={id}>
            <InventoryItem inventoryEntry={inventoryEntry} />
            <span>{inventoryEntry.item.baseItem.friendlyName}</span>
        </label>
    </div>;
}

export default PlantRadioOption;
