import React from "react";
import { MarketItem } from "../../backend/market";
import LoadingButton from "../LoadingButton";
import MarketItemEntry from "./MarketItemEntry";
import { goldImg } from "../../helper/const";
import { isStackable } from "../../backend/inventory";

interface Props {
    marketItems: MarketItem[];
    selling: boolean;
    onSell: (orders: Map<number, number | undefined>) => void;
}

interface State {
    selectedItemsWithQuantity: Map<number, number | undefined>;
}

class UserMarket extends React.Component<Props, State> {
    readonly state: Readonly<State> = {
        selectedItemsWithQuantity: new Map()
    };

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.selling && !this.props.selling) this.setState({ selectedItemsWithQuantity: new Map() });
    }

    render() {
        const { marketItems, selling } = this.props;
        const { selectedItemsWithQuantity } = this.state;

        return <div className="UserMarket">
            <ul>
                {marketItems.map(marketItem => <MarketItemEntry
                    key={marketItem.item.id}
                    marketItem={marketItem}
                    onClick={this.handleClickItem}
                    selected={selectedItemsWithQuantity.has(marketItem.item.id)}
                    selectedQuantity={selectedItemsWithQuantity.get(marketItem.item.id)}
                />)}
            </ul>
            <div className="footer">
                <span>Total: {goldImg}{this.total()}</span>
                <LoadingButton loading={selling} disabled={selling || selectedItemsWithQuantity.size === 0} onClick={this.handleSell}>Sell</LoadingButton>
            </div>
        </div>;
    }

    total = () => {
        return this.props.marketItems.filter(marketItem => this.state.selectedItemsWithQuantity.has(marketItem.item.id))
            .map(marketItem => ({ price: marketItem.price, quantity: this.selectedItemQuantity(marketItem.item.id) }))
            .reduce((total, { price, quantity }) => total + (quantity !== null ? price * quantity : price ), 0);
    };

    selectedItemQuantity = (itemId: number) => {
        const quantity = this.state.selectedItemsWithQuantity.get(itemId);

        if (quantity === null || quantity === undefined) return null;

        return quantity;
    };

    handleClickItem = (id: number) => {
        const currentlySelectedItems = this.state.selectedItemsWithQuantity;

        const item = this.props.marketItems.find(marketItem => marketItem.item.id === id)!.item;

        const newMap = new Map(currentlySelectedItems);

        if (isStackable(item)) {
            const currentQuantity = currentlySelectedItems.get(id);
            const inputQuantityString = window.prompt(
                `How many? (max: ${item.quantity})`,
                (currentQuantity !== null && currentQuantity !== undefined) ? currentQuantity.toString() : "0"
            );

            if (inputQuantityString === null) return;

            const inputQuantity = parseInt(inputQuantityString);

            if (isNaN(inputQuantity) || inputQuantity < 0 || inputQuantity > item.quantity) {
                window.alert(`Invalid quantity: ${inputQuantityString}. Must be an integer within 0 and ${item.quantity}.`);
                return;
            }

            if (inputQuantity === 0) newMap.delete(id);
            else newMap.set(id, inputQuantity);
        } else {
            if (currentlySelectedItems.has(id)) {
                newMap.delete(id);
            } else {
                newMap.set(id, undefined);
            }
        }

        this.setState({ selectedItemsWithQuantity: newMap });
    };

    handleSell = () => {
        this.props.onSell(this.state.selectedItemsWithQuantity);
    };
}

export default UserMarket;
