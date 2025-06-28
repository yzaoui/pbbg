import React from "react";
import "../../page/dex/DexSubpage.scss"
import unknownImg from "./../../img/dex-unknown.png";

interface Props {
    id: string;
}

const DexUnknownEntry: React.FC<Props> = ({ id }) => <li className="entry-li">
    <div className="entry-container unknown-entry">
        <span>#{id}</span>
        <img src={unknownImg} alt={"Unknown entry"} />
        <span>------------------------</span>
    </div>
</li>;

export default DexUnknownEntry;
