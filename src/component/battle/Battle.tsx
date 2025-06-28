import React from "react";
import { Battle as BattleData, BattleReward, MappedUnitEffects } from "../../backend/battle";
import BattleQueue from "./BattleQueue";
import PBBGUnit from "../PBBGUnit";
import "./Battle.scss";
import BattleActions from "./BattleActions";
import BattleLog from "./BattleLog";
import { MyUnit } from "../../backend/squad";

export type SidedUnit = MyUnit & { side: "ally" | "enemy" };

type Props = {
    battle: BattleData;
    onAllyTurn: (unitId: number) => void;
    onEnemyTurn: () => void;
    performingAction: boolean;
    effects: MappedUnitEffects[];
    reward: BattleReward | null;
};

type State = {
    hoveredUnitId: number | null;
    selectingTarget: boolean;
}

class Battle extends React.Component<Props, State> {
    readonly state: Readonly<State> = {
        hoveredUnitId: null,
        selectingTarget: false
    };

    render() {
        const battleIsOver = this.props.reward !== null;
        const nextUnitId = this.props.battle.turns[0].unitId;
        const currentSide = this.props.battle.allies.some(ally => nextUnitId === ally.id) ? "ally" : "enemy";

        return <div className="Battle" data-overlay-active={this.state.selectingTarget ? "" : undefined} data-battle-over={battleIsOver ? "" : undefined}>
            {this.state.selectingTarget &&
                this.createOverlay()
            }
            {!battleIsOver &&
                <BattleQueue battle={this.props.battle} onUnitEnter={this.handleUnitEnter} onUnitLeave={this.handleUnitLeave} hoveredUnit={this.state.hoveredUnitId} />
            }
            <div className="allies-container unit-list-section">
                <h1>Allies</h1>
                <ul>
                    {this.props.battle.allies.map(ally => <li key={ally.id}><PBBGUnit
                        unit={ally}
                        facing="right"
                        data-side="ally"
                        data-current-turn={ally.id === nextUnitId ? "" : undefined}
                        data-hovered={ally.id === this.state.hoveredUnitId ? "" : undefined}
                        onMouseEnter={() => this.handleUnitEnter(ally.id)}
                        onMouseLeave={this.handleUnitLeave}
                        {...(this.state.selectingTarget && ally.id !== nextUnitId && ally.hp > 0 &&
                            { onClick: () => this.handleSelectTarget(ally.id) }
                        )}
                    /></li>)}
                </ul>
            </div>
            <div className="enemies-container unit-list-section">
                <h1>Enemies</h1>
                <ul>
                    {this.props.battle.enemies.map(enemy => <li key={enemy.id}><PBBGUnit
                        unit={enemy}
                        facing="left"
                        data-side="enemy"
                        data-current-turn={enemy.id === nextUnitId ? "" : undefined}
                        data-hovered={enemy.id === this.state.hoveredUnitId ? "" : undefined}
                        onMouseEnter={() => this.handleUnitEnter(enemy.id)}
                        onMouseLeave={this.handleUnitLeave}
                        {...(this.state.selectingTarget && enemy.id !== nextUnitId && enemy.hp > 0 &&
                            { onClick: () => this.handleSelectTarget(enemy.id) }
                        )}
                    /></li>)}
                </ul>
            </div>
            {!battleIsOver &&
                <BattleActions performingAction={this.props.performingAction} {...(currentSide === "ally" ? {
                    enemyTurn: false,
                    onProcessAllyTurn: this.handleAllyTurn
                } : {
                    enemyTurn: true,
                    onProcessEnemyTurn: this.props.onEnemyTurn
                })} />
            }
            <BattleLog effects={this.props.effects} reward={this.props.reward} onUnitNameEnter={this.handleUnitEnter} onUnitNameLeave={this.handleUnitLeave} units={new Map(
                this.props.battle.allies.map(ally => ({ ...ally, side: "ally" }) as SidedUnit)
                    .concat(this.props.battle.enemies.map(enemy => ({ ...enemy, side: "enemy" }) as SidedUnit))
                    .map(unit => [unit.id, unit])
            )} />
        </div>;
    }

    createOverlay = () => <div className="overlay">
        <div>
            <button className="fancy danger" onClick={this.handleCancelTargeting}>Cancel</button>
            <span>Select target</span>
        </div>
    </div>;

    handleUnitEnter = (unitId: number) => this.setState({ hoveredUnitId: unitId });

    handleUnitLeave = () => this.setState({ hoveredUnitId: null });

    handleAllyTurn = () => this.setState({ selectingTarget: true });

    handleSelectTarget = (unitId: number) => {
        this.setState({ selectingTarget: false });
        this.props.onAllyTurn(unitId);
    };

    handleCancelTargeting = () => this.setState({ selectingTarget: false });
}

export default Battle;
