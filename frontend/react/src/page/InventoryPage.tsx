import { Howl } from "howler";
import React, { useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";
import { Inventory, isEquippable } from "../backend/inventory";
import inventoryService from "../backend/inventory.service";
import LoadingSpinner from "../component/LoadingSpinner";
import EquipmentSlot from "../component/inventory/EquipmentSlot";
import InventoryItem from "../component/inventory/InventoryItem";
import InventoryItemTooltip from "../component/inventory/InventoryItemTooltip";
import noPickaxe from "../img/no-pickaxe.png";
import player from "../img/player.png";
import styles from "./InventoryPage.module.scss";
// @ts-ignore
import equipMP3 from "../audio/equip_effect.mp3";
// @ts-ignore
import equipOGG from "../audio/equip_effect.ogg";

type State = {
    status: "loading";
} | {
    status: "error";
} | {
    status: "loaded";
    inventory: Inventory;
    equipmentChanging: boolean;
};

const InventoryPage: React.FC = () => {
    const [state, setState] = useState<State>({ status: "loading" });
    const equipRequestRef = useRef<Subscription>(null);
    const equipSound = useRef(new Howl({
        src: [equipMP3, equipOGG],
        preload: true
    }));

    useEffect(() => {
        const subscription = inventoryService.getInventory()
            .subscribe({
                next: value => setState({ status: "loaded", inventory: value.data, equipmentChanging: false }),
                error: _err => setState({ status: "error" })
            });

        return () => {
            subscription.unsubscribe();
            equipRequestRef.current?.unsubscribe();
        };
    }, []);

    const handleEquipUnequip = (inventoryItemId: number, action: "equip" | "unequip") => {
        if (state.status !== "loaded") return;

        equipRequestRef.current?.unsubscribe();

        setState(prevState => {
            if (prevState.status !== "loaded") return prevState;
            return { ...prevState, equipmentChanging: true };
        });

        equipRequestRef.current = inventoryService.equipUnequip(action, { inventoryItemId })
            .subscribe({
                next: res => {
                    equipSound.current.play();
                    setState(prevState => {
                        if (prevState.status !== "loaded") return prevState;
                        return { ...prevState, inventory: res.data, equipmentChanging: false };
                    });
                },
                error: _err => setState({ status: "error" })
            });
    };

    const inventoryContents = ({ inventory, equipmentChanging }: { inventory: Inventory, equipmentChanging: boolean }) =>
        inventory.items.sort((a, b) => a.item.id - b.item.id).map(entry => <li
            key={entry.item.id}
            className={styles["inventory-item"]}
        >
            <InventoryItem inventoryEntry={entry} />
            <InventoryItemTooltip
                className={styles["inventory-item-tooltip"]}
                inventoryEntry={entry}
                equip={isEquippable(entry) && !entry.equipped ? () => handleEquipUnequip(entry.item.id, "equip") : undefined}
                unequip={isEquippable(entry) && entry.equipped ? () => handleEquipUnequip(entry.item.id, "unequip") : undefined}
                equipDisabled={equipmentChanging}
            />
        </li>);

    if (state.status === "error") return <>ERROR</>;

    return <>
        <title>Inventory - PBBG</title>
        <div className={styles.InventoryPage}>
            <div className={styles["player-equipment"]}>
                <img className={styles["player-portrait"]} src={player} alt="Player portrait" />
                <EquipmentSlot item={state.status === "loaded" ? state.inventory.equipment.pickaxe : "loading"} style={{ top: "100px", left: "90px" }}>
                    <img src={noPickaxe} alt={"No pickaxe equipped"} />
                </EquipmentSlot>
            </div>
            <ul className={styles["inventory-container"]}>
                {state.status === "loaded" ?
                    inventoryContents(state)
                : state.status === "loading" ?
                    <LoadingSpinner />
                : null}
            </ul>
        </div>
    </>;
};

export default InventoryPage;
