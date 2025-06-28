import React from "react";
import { Inventory } from "../../backend/inventory";
import { Subscription } from "rxjs";
import inventoryService from "../../backend/inventory.service";
import LoadingSpinner from "../LoadingSpinner";
import PlantRadioOption from "./PlantRadioOption";
import styles from "./PlantModal.module.scss";
import classNames from "classnames";
import MicroModal from "react-micro-modal";

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

class PlantModal extends React.Component<Props, State> {
    readonly state: Readonly<State> = initialState;

    private inventoryRequest: Subscription | null = null;

    componentWillUnmount() {
        this.inventoryRequest?.unsubscribe();
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (!prevProps.open && this.props.open) {
            // Modal was opened
            this.inventoryRequest = inventoryService.getInventory("plantable").subscribe(res =>
                this.setState({ inventory: res.data })
            );
        } else if (prevProps.open && !this.props.open) {
            // Modal was closed
            this.inventoryRequest !== null && this.inventoryRequest.unsubscribe();
            this.setState(initialState);
        }
    }

    render() {
        return <MicroModal
                open={this.props.open}
                handleClose={this.props.onClose}
                children={handleClose =>
                    <div className={styles.PlantModal}>
                        <header>
                            <h1>Choose what to plant</h1>
                        </header>
                        <main>
                            {this.state.inventory === "loading" ?
                                <LoadingSpinner />
                            : this.state.inventory.items.length > 0 ?
                                this.state.inventory.items.map(inventoryEntry =>
                                    <PlantRadioOption
                                        key={inventoryEntry.item.id}
                                        inventoryEntry={inventoryEntry}
                                        checked={this.state.selectedOption === inventoryEntry.item.id}
                                        onChange={this.handleRadioChange}
                                    />
                                )
                            :
                                <div>You have no plantable items.</div>
                            }
                        </main>
                        <footer>
                            <button className={classNames(styles.select, "fancy")} onClick={this.handleSelect} disabled={this.state.selectedOption === null}>Select</button>
                            <button className={classNames(styles.cancel, "fancy secondary")} onClick={handleClose}>Cancel</button>
                        </footer>
                    </div>
                }
                overrides={{
                    Dialog: {
                        style: { padding: 0 }
                    }
                }}
            />
    }

    private handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            selectedOption: Number(event.target.value)
        })
    };

    private handleSelect = () => {
        if (this.state.selectedOption === null) return;

        this.props.onSelect(this.state.selectedOption)
    }
}

export default PlantModal;
