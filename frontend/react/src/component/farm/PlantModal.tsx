import React, { useEffect, useRef, useState } from "react";
import MicroModal from "react-micro-modal";
import { Subscription } from "rxjs";
import { Inventory } from "../../backend/inventory";
import inventoryService from "../../backend/inventory.service";
import LoadingSpinner from "../LoadingSpinner";
import styles from "./PlantModal.module.scss";
import PlantRadioOption from "./PlantRadioOption";

type Props = {
    open: boolean;
    onClose: () => void;
    onSelect: (itemId: number) => void;
};

type State = {
    selectedOption: number | null;
    inventory: "loading" | Inventory;
};

const initialState: State = {
    selectedOption: null,
    inventory: "loading"
};

const PlantModal: React.FC<Props> = ({ open, onClose, onSelect }) => {
    const [state, setState] = useState<State>(initialState);
    const inventoryRequestRef = useRef<Subscription>(null);

    useEffect(() => {
        if (open) {
            // Modal was opened
            inventoryRequestRef.current = inventoryService.getInventory("plantable").subscribe(res =>
                setState(prevState => ({ ...prevState, inventory: res.data }))
            );
        } else {
            // Modal was closed
            inventoryRequestRef.current?.unsubscribe();
            setState(initialState);
        }

        return () => {
            inventoryRequestRef.current?.unsubscribe();
        };
    }, [open]);

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState(prevState => ({
            ...prevState,
            selectedOption: Number(event.target.value)
        }));
    };

    const handleSelect = () => {
        if (state.selectedOption === null) return;

        onSelect(state.selectedOption);
    };

    return <MicroModal
            open={open}
            handleClose={onClose}
            children={handleClose =>
                <div className={styles.PlantModal}>
                    <header>
                        <h1>Choose what to plant</h1>
                    </header>
                    <main>
                        {state.inventory === "loading" ?
                            <LoadingSpinner />
                        : state.inventory.items.length > 0 ?
                            state.inventory.items.map(inventoryEntry =>
                                <PlantRadioOption
                                    key={inventoryEntry.item.id}
                                    inventoryEntry={inventoryEntry}
                                    checked={state.selectedOption === inventoryEntry.item.id}
                                    onChange={handleRadioChange}
                                />
                            )
                        :
                            <div>You have no plantable items.</div>
                        }
                    </main>
                    <footer>
                        <button className="fancy" onClick={handleSelect} disabled={state.selectedOption === null}>Select</button>
                        <button className="fancy secondary" onClick={handleClose}>Cancel</button>
                    </footer>
                </div>
            }
            overrides={{
                Dialog: {
                    style: { padding: 0 }
                }
            }}
        />;
};

export default PlantModal;
