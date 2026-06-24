import "./MineListUnknownRow.scss";

import React from "react";

interface Props {
    nextUnlockLevel: number;
}

const MineListUnknownRow: React.FC<Props> = ({ nextUnlockLevel }) => <tr className="MineListUnknownRow">
    <td>???????</td>
    <td>{nextUnlockLevel}</td>
    <td><button className="fancy" disabled>Need to unlock</button></td>
</tr>;

export default MineListUnknownRow;
