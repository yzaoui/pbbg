import React from "react";
import "../../page/dex/DexSubpage.scss"
import unknownImg from "./../../img/dex-unknown.png";
import styles from "./DexEntry.module.scss";
import classNames from "classnames";

interface Props {
    id: string;
}

const DexUnknownEntry: React.FC<Props> = ({ id }) => <li className="entry-li">
    <div className={classNames(styles["entry-container"], styles["unknown-entry"])}>
        <span>#{id}</span>
        <img src={unknownImg} alt={"Unknown entry"} />
        <span>------------------------</span>
    </div>
</li>;

export default DexUnknownEntry;
