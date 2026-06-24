import "./MineLog.scss";

import classNames from "classnames";
import React, { useEffect, useRef } from "react";

import { isStackable } from "../../backend/inventory";
import { LevelUp as LevelUpData, MinedItemResult } from "../../backend/mine";

interface Props {
    results: (MinedItemResult | LevelUpData)[];
    expanded?: boolean;
}

const MineLog: React.FC<Props> = ({ results, expanded }) => {
    const ulRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (ulRef.current) {
            ulRef.current.scrollTop = ulRef.current.scrollHeight;
        }
    }, [results.length]);

    const isMinedItemResult = (result: MinedItemResult | LevelUpData): result is MinedItemResult => "item" in result;

    return <ul className={classNames("MineLog", { "expanded": expanded })} ref={ulRef}>
        {results.map((result, i) => isMinedItemResult(result) ? <ItemResult key={i} {...result} /> : <LevelUp key={i} {...result} />)}
    </ul>;
};

const ItemResult: React.FC<MinedItemResult> = ({ item, expPerIndividualItem }) => <li className="ItemResult">
    {isStackable(item) ?
        <>Obtained <b>{item.quantity}</b>× <img src={item.baseItem.img16} alt={item.baseItem.friendlyName + " sprite"} /><b>{item.baseItem.friendlyName}</b> (+{expPerIndividualItem * item.quantity} exp)</>
        :
        <>Obtained {item.baseItem.friendlyName} (+{expPerIndividualItem} exp)</>
    }
</li>;

const LevelUp: React.FC<LevelUpData> = ({ newLevel, additionalMessage }) => <li className="LevelUp">
    <>Mining level increased to level {newLevel}!{additionalMessage !== null ? ` ${additionalMessage}` : ""}</>
</li>;

export default MineLog;
