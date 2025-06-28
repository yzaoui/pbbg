import React from "react";
import LoadingButton from "../LoadingButton";
import "./BattleActions.scss";

type Props = {
    performingAction: boolean;
} & ({
    enemyTurn: true;
    onProcessEnemyTurn: () => void;
} | {
    enemyTurn: false;
    onProcessAllyTurn: () => void;
});

const BattleActions: React.FC<Props> = (props) => <div className="BattleActions">
    <h1>Actions</h1>
    <div>
        {props.enemyTurn ?
            <LoadingButton loading={props.performingAction} onClick={props.onProcessEnemyTurn}>Process enemy turn</LoadingButton>
            :
            <LoadingButton loading={props.performingAction} onClick={props.onProcessAllyTurn}>Attack</LoadingButton>
        }
    </div>
</div>;

export default BattleActions;
