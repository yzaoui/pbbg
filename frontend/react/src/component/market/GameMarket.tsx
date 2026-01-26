import React, { useEffect, useState } from "react";
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

const GameMarket: React.FC<Props> = ({ marketItems, userGold, buying, onBuy }) => {
    const [selectedItemsWithQuantity, setSelectedItemsWithQuantity] = useState<Map<number, number | undefined>>(new Map());

    useEffect(() => {
        if (!buying) {
            setSelectedItemsWithQuantity(new Map());
        }
    }, [buying]);

    const selectedItemQuantity = (itemId: number) => {
        const quantity = selectedItemsWithQuantity.get(itemId);

        if (quantity === null || quantity === undefined) return null;

        return quantity;
    };

    const total = () => {
        return marketItems.filter(marketItem => selectedItemsWithQuantity.has(marketItem.item.id))
            .map(marketItem => ({ price: marketItem.price, quantity: selectedItemQuantity(marketItem.item.id) }))
            .reduce((total, { price, quantity }) => total + (quantity !== null ? price * quantity : price ), 0);
    };

    const handleClickItem = (id: number) => {
        const currentlySelectedItems = selectedItemsWithQuantity;

        const item = marketItems.find(marketItem => marketItem.item.id === id)!.item;

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

        setSelectedItemsWithQuantity(newMap);
    };

    const handleBuy = () => {
        onBuy(selectedItemsWithQuantity);
    };

    const totalValue = total();
    const notEnoughGold = userGold < totalValue;

    return <div className="GameMarket">
        <ul>
            {marketItems.map(marketItem => <MarketItemEntry
                key={marketItem.item.id}
                marketItem={marketItem}
                onClick={handleClickItem}
                selected={selectedItemsWithQuantity.has(marketItem.item.id)}
                selectedQuantity={selectedItemsWithQuantity.get(marketItem.item.id)}
            />)}
        </ul>
        <div className="footer" data-not-enough-gold={notEnoughGold ? "" : undefined}>
            <span>Total: {goldImg}{totalValue}</span>
            <LoadingButton loading={buying} disabled={notEnoughGold || buying || selectedItemsWithQuantity.size === 0} onClick={handleBuy}>Buy</LoadingButton>
        </div>
    </div>;
};

export default GameMarket;
