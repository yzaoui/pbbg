import React from "react";
import { MineType } from "../../backend/mine";
import "./MineListRow.scss";
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
}

class MineListRow extends React.Component<Props> {
    render() {
        return <tr className="MineListRow" style={{ backgroundImage: `url(${this.props.mineType.bgURL})` }}>
            <td>{this.props.mineType.name}</td>
            <td>{this.props.mineType.minLevel}</td>
            <td>
                <LoadingButton
                    loading={this.props.status === "entering this mine"}
                    disabled={this.props.status !== "default"}
                    {...(this.props.status === "default" && {
                        onClick: this.handleEnterMineClick
                    })}
                >
                    {this.props.status === "entering this mine" ? "Entering…" : "Enter"}
                </LoadingButton>
            </td>
        </tr>;
    }

    handleEnterMineClick = () => {
        if (this.props.status !== "default") return;

        this.props.onEnterMineClick(this.props.mineType.id);
    }
}

export default MineListRow;
