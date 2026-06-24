import "./MineListRow.scss";

import React from "react";

import { MineType } from "../../backend/mine";
import LoadingButton from "../LoadingButton";

type Props = {
    status: "default";
    mineType: MineType;
    onEnterMineClick: (mineTypeId: number) => void;
} | {
    status: "entering this mine";
    mineType: MineType;
} | {
    status: "entering another mine";
    mineType: MineType;
};

const MineListRow: React.FC<Props> = (props) => {
    const handleEnterMineClick = () => {
        if (props.status !== "default") return;

        props.onEnterMineClick(props.mineType.id);
    };

    return <tr className="MineListRow" style={{ backgroundImage: `url(${props.mineType.bgURL})` }}>
        <td>{props.mineType.name}</td>
        <td>{props.mineType.minLevel}</td>
        <td>
            <LoadingButton
                loading={props.status === "entering this mine"}
                disabled={props.status !== "default"}
                {...(props.status === "default" && {
                    onClick: handleEnterMineClick
                })}
            >
                {props.status === "entering this mine" ? "Entering…" : "Enter"}
            </LoadingButton>
        </td>
    </tr>;
};

export default MineListRow;
