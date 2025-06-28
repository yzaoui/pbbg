import React from "react";
import "./MineList.scss";
import LoadingSpinner from "../LoadingSpinner";
import { MineTypeList } from "../../backend/mine";
import MineListRow from "./MineListRow";
import MineListUnknownRow from "./MineListUnknownRow";

type Props = {
    status: "loading";
} | {
    status: "error";
} | {
    status: "loaded";
    mineTypeList: MineTypeList;
    onEnterMine: (mineTypeId: number) => void;
} | {
    status: "entering mine";
    mineTypeList: MineTypeList;
    enteringMineId: number;
};

const MineList: React.FC<Props> = (props) => <table className="MineList">
    <thead>
        <tr>
            <th>Mine name</th>
            <th>Minimum lvl.</th>
            <th>Enter mine</th>
        </tr>
    </thead>
    <tbody>
    {(() => {
        if (props.status === "loading" || props.status === "error") return <tr>
            <td colSpan={3}>
                <div style={{ display: "flex", justifyContent: "center" }}>{props.status === "loading" ? <LoadingSpinner /> : "ERROR"}</div>
            </td>
        </tr>;

        return <>
            {props.mineTypeList.types.map(mineType => props.status === "loaded" ?
                <MineListRow key={mineType.id} status="default" mineType={mineType} onEnterMineClick={props.onEnterMine} />
            :
                props.enteringMineId === mineType.id ?
                    <MineListRow key={mineType.id} status="entering this mine" mineType={mineType} />
                :
                    <MineListRow key={mineType.id} status="entering another mine" mineType={mineType} />
            )}
            {props.mineTypeList.nextUnlockLevel !== null &&
                <MineListUnknownRow nextUnlockLevel={props.mineTypeList.nextUnlockLevel} />
            }
        </>;
    })()}
    </tbody>
</table>;

export default MineList;
