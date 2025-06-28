import React, { CSSProperties } from "react";
import goldSrc from "../img/gold.png";
import LoadingSpinner from "./LoadingSpinner";
import lvlMiningSrc from "../img/lvl-mining.png";
import LevelInfo from "./LevelInfo";
import lvlFarmingSrc from "../img/lvl-farming.png";
import { UserStats } from "../backend/user-stats";
import "./HomeUserStats.scss";

interface LoadingProps {
    status: "loading";
}

interface LoadedProps {
    status: "loaded";
    userStats: UserStats
}

type Props = LoadingProps | LoadedProps;

const HomeUserStats: React.FC<Props> = props => <div className="HomeUserStats">
    <table>
        <tbody>
            <tr>
                <td>
                    <img src={goldSrc} alt="Gold icon" style={{ width: "16px", height: "16px" }} />
                </td>
                <td>
                    Gold:
                </td>
                <td>
                    {props.status === "loaded" ? <b>{props.userStats.gold}</b> : <LoadingSpinner style={loadingStyle} /> }
                </td>
            </tr>
            <tr>
                <td>
                    <img src={lvlMiningSrc} alt="Mining level icon" style={{ width: "16px", height: "16px" }} />
                </td>
                <td>
                    Mining:
                </td>
                <td>
                    {props.status === "loaded" ? <LevelInfo levelProgress={props.userStats.mining} /> : <LoadingSpinner style={loadingStyle} />}
                </td>
            </tr>
            <tr>
                <td>
                    <img src={lvlFarmingSrc} alt="Farming level icon" style={{ width: "16px", height: "16px" }} />
                </td>
                <td>
                    Farming:
                </td>
                <td>
                    {props.status === "loaded" ? <LevelInfo levelProgress={props.userStats.farming} /> : <LoadingSpinner style={loadingStyle} />}
                </td>
            </tr>
        </tbody>
    </table>
</div>;

const loadingStyle: CSSProperties = {
    width: "18px",
    height: "18px",
    borderWidth: "4px"
};

export default HomeUserStats;
