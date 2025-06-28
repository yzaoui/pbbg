import React from "react";
import { MarketItem } from "../../backend/market";
import LoadingButton from "../LoadingButton";
import { isStackable } from "../../backend/inventory";
import MarketItemEntry from "./MarketItemEntry";
import { goldImg } from "../../helper/const";

interface Props {
    marketItems: MarketItem[];
    userGold: number;
    buying: boolean;
    onBuy: (orders: Map<number, number | undefined>) => void;
}

interface State {
    selectedItemsWithQuantity: Map<number, number | undefined>;
}

class GameMarket extends React.Component<Props, State> {
    readonly state: Readonly<State> = {
        selectedItemsWithQuantity: new Map()
    };

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.buying && !this.props.buying) this.setState({ selectedItemsWithQuantity: new Map() });
    }

    render() {
        const { marketItems, userGold, buying } = this.props;
        const { selectedItemsWithQuantity } = this.state;
        const total = this.total();
        const notEnoughGold = userGold < total;

        return <div className="GameMarket">
            <ul>
                {marketItems.map(marketItem => <MarketItemEntry
                    key={marketItem.item.id}
                    marketItem={marketItem}
                    onClick={this.handleClickItem}
                    selected={selectedItemsWithQuantity.has(marketItem.item.id)}
                    selectedQuantity={selectedItemsWithQuantity.get(marketItem.item.id)}
                />)}
            </ul>
            <div className="footer" data-not-enough-gold={notEnoughGold ? "" : undefined}>
                <span>Total: {goldImg}{total}</span>
                <LoadingButton loading={buying} disabled={notEnoughGold || buying || selectedItemsWithQuantity.size === 0} onClick={this.handleBuy}>Buy</LoadingButton>
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

    handleBuy = () => {
        this.props.onBuy(this.state.selectedItemsWithQuantity);
    };
}

export default GameMarket;
