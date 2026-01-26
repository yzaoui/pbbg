import React, { useEffect, useState } from "react";
import { isStackable } from "../../backend/inventory";
import { MarketItem } from "../../backend/market";
import { goldImg } from "../../helper/const";
import LoadingButton from "../LoadingButton";
import MarketItemEntry from "./MarketItemEntry";

interface Props {
    marketItems: MarketItem[];
    selling: boolean;
    onSell: (orders: Map<number, number | undefined>) => void;
}

const UserMarket: React.FC<Props> = ({ marketItems, selling, onSell }) => {
    const [selectedItemsWithQuantity, setSelectedItemsWithQuantity] = useState<Map<number, number | undefined>>(new Map());

    useEffect(() => {
        if (!selling) {
            setSelectedItemsWithQuantity(new Map());
        }
    }, [selling]);

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

    const handleSell = () => {
        onSell(selectedItemsWithQuantity);
    };

    return <div className="UserMarket">
        <ul>
            {marketItems.map(marketItem => <MarketItemEntry
                key={marketItem.item.id}
                marketItem={marketItem}
                onClick={handleClickItem}
                selected={selectedItemsWithQuantity.has(marketItem.item.id)}
                selectedQuantity={selectedItemsWithQuantity.get(marketItem.item.id)}
            />)}
        </ul>
        <div className="footer">
            <span>Total: {goldImg}{total()}</span>
            <LoadingButton loading={selling} disabled={selling || selectedItemsWithQuantity.size === 0} onClick={handleSell}>Sell</LoadingButton>
        </div>
    </div>;
};

export default UserMarket;
