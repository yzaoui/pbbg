import React from "react";
import { Link } from "react-router-dom";
import { MyUnitEnum } from "../../backend/dex";
import "./DexEntry.scss"

interface Props {
    id: string;
    unit: MyUnitEnum;
}

const DexUnitEntry: React.FC<Props> = ({ id, unit }) => <li className="entry-li">
    <Link to={"/dex/units/" + id} className="entry-container unit">
        <span>#{id}</span>
        <img src={unit.iconURL} alt={unit.friendlyName + " sprite"} />
        <span>{unit.friendlyName}</span>
    </Link>
</li>;

export default DexUnitEntry;
