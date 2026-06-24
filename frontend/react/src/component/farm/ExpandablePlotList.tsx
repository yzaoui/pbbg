import React from "react";

import { PlotData } from "../../model/farm";
import ExpandPlots from "./ExpandPlots";
import PlotList from "./PlotList";

type Props = {
    plots: PlotData[];
    refreshPlantProgress: () => void;
    fetchingNextStage: Set<number>;
    loadingPlots: Set<number>;
    expanding: boolean;
    onPlant: (plotId: number) => void;
    onHarvest: (plotId: number) => void;
    onReorder: (plotId: number, index: number) => void;
    onExpand: () => void;
};

const ExpandablePlotList: React.FC<Props> = (props) => <div className="ExpandablePlotList">
    <PlotList
        plots={props.plots}
        refreshPlantProgress={props.refreshPlantProgress}
        fetchingNextStage={props.fetchingNextStage}
        loadingPlots={props.loadingPlots}
        onPlant={props.onPlant}
        onHarvest={props.onHarvest}
        onReorder={props.onReorder}
    />
    <ExpandPlots loading={props.expanding} onExpand={props.onExpand} />
</div>;

export default ExpandablePlotList;
