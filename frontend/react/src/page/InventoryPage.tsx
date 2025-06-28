import React from "react";
import player from "../img/player.png";
import "./InventoryPage.scss";
import { Inventory, isEquippable } from "../backend/inventory";
import LoadingSpinner from "../component/LoadingSpinner";
import InventoryItem from "../component/inventory/InventoryItem";
import { Subscription } from "rxjs";
import inventoryService from "../backend/inventory.service";
import InventoryItemTooltip from "../component/inventory/InventoryItemTooltip";
import EquipmentSlot from "../component/inventory/EquipmentSlot";
import noPickaxe from "../img/no-pickaxe.png";
import { Howl } from "howler";
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

class InventoryPage extends React.Component<{}, State> {
    readonly state: Readonly<State> = {
        status: "loading"
    };

    request?: Subscription;

    equipSound = new Howl({
        src: [equipMP3, equipOGG],
        preload: true
    });

    componentDidMount() {
        document.title = "Inventory - PBBG";

        this.request = inventoryService.getInventory()
            .subscribe({
                next: value => this.setState({ status: "loaded", inventory: value.data, equipmentChanging: false }),
                error: err => this.setState({ status: "error" })
            });
    }

    componentWillUnmount() {
        this.request && this.request.unsubscribe();
    }

    render() {
        if (this.state.status === "error") return "ERROR";

        return <div className="InventoryPage">
            <div className="player-equipment">
                <img className="player-portrait" src={player} alt="Player portrait" />
                <EquipmentSlot item={this.state.status === "loaded" ? this.state.inventory.equipment.pickaxe : "loading"} style={{ top: "100px", left: "90px" }}>
                    <img src={noPickaxe} alt={"No pickaxe equipped"} />
                </EquipmentSlot>
            </div>
            <ul className="inventory-container">
                {this.state.status === "loaded" ?
                    this.inventoryContents(this.state)
                : this.state.status === "loading" ?
                    <LoadingSpinner />
                : {}}
            </ul>
        </div>;
    }

    inventoryContents = ({ inventory, equipmentChanging }: { inventory: Inventory, equipmentChanging: boolean }) =>
        inventory.items.sort((a, b) => a.item.id - b.item.id).map(entry => <li key={entry.item.id} className="inventory-item">
            <InventoryItem inventoryEntry={entry} />
            <InventoryItemTooltip
                inventoryEntry={entry}
                equip={isEquippable(entry) && !entry.equipped ? () => this.handleEquipUnequip(entry.item.id, "equip") : undefined}
                unequip={isEquippable(entry) && entry.equipped ? () => this.handleEquipUnequip(entry.item.id, "unequip") : undefined}
                equipDisabled={equipmentChanging}
            />
        </li>);

    handleEquipUnequip = (inventoryItemId: number, action: "equip" | "unequip") => {
        if (this.state.status !== "loaded") throw Error();
        this.setState({ ...this.state, equipmentChanging: true });

        this.request = inventoryService.equipUnequip(action, { inventoryItemId })
            .subscribe({
                next: res => {
                    if (this.state.status !== "loaded") throw Error();

                    this.equipSound.play();
                    this.setState({ ...this.state, inventory: res.data, equipmentChanging: false });
                },
                error: err => this.setState({ status: "error" })
            });
    }
}

export default InventoryPage;
