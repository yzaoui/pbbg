import React from "react";
import LoadingButton from "../LoadingButton";
import styles from "./BattleActions.module.scss";
import classNames from "classnames";

type Props = {
    performingAction: boolean;
    className?: string;
} & ({
    enemyTurn: true;
    onProcessEnemyTurn: () => void;
} | {
    enemyTurn: false;
    onProcessAllyTurn: () => void;
});

const BattleActions: React.FC<Props> = (props) => <div className={classNames(styles.BattleActions, props.className)}>
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
