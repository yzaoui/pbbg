import React from "react";
import "./MineListUnknownRow.scss";

interface Props {
    nextUnlockLevel: number;
}

const MineListUnknownRow: React.FC<Props> = ({ nextUnlockLevel }) => <tr className="MineListUnknownRow">
    <td>???????</td>
    <td>{nextUnlockLevel}</td>
    <td><button className="fancy" disabled>Need to unlock</button></td>
</tr>;

export default MineListUnknownRow;
