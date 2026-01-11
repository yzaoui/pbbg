import React from "react";
import { MarketItem } from "../../backend/market";
import { goldImg } from "../../helper/const";
import { isStackable } from "../../backend/inventory";
import styles from "./MarketItemEntry.module.scss";

interface Props {
    marketItem: MarketItem;
    onClick: (id: number) => void;
    selected: boolean;
    selectedQuantity?: number;
}

const MarketItemEntry: React.FC<Props> = ({ marketItem, onClick, selected, selectedQuantity }) => <li className={styles.MarketItemEntry} data-selected={selected ? "" : undefined}>
    <div
        className={styles["sprite-container"]}
        onClick={() => onClick(marketItem.item.id)}
        tabIndex={0}
    >
        <img
            className={styles["item-sprite"]}
            src={marketItem.item.baseItem.img16}
            alt={marketItem.item.baseItem.friendlyName + " sprite"}
        />
        {isStackable(marketItem.item) &&
            <span className={styles.quantity}>{marketItem.item.quantity}</span>
        }
    </div>
    <div>
        {selectedQuantity !== undefined && selectedQuantity > 0 &&
            `${selectedQuantity}×`
        }
        {goldImg}
        <span>{marketItem.price}</span>
    </div>
</li>;

export default MarketItemEntry;
