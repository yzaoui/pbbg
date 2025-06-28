import React from "react";
import { Link } from "react-router-dom";
import "./DexEntry.scss"
import { BasePlant } from "../../model/farm";

type Props = {
    id: string;
    plant: BasePlant;
};

const DexPlantEntry: React.FC<Props> = ({ id, plant }) => <li className="entry-li">
    <Link to={"/dex/plants/" + id} className="entry-container">
        <span>#{id}</span>
        <img src={plant.icon} alt={plant.name + " icon"} />
        <span>{plant.name}</span>
    </Link>
</li>;

export default DexPlantEntry;
