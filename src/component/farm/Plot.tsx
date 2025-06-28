import React, { DragEventHandler } from "react";
import PlotImage from "./PlotImage";
import PlotFooter from "./PlotFooter";
import LoadingSpinner from "../LoadingSpinner";
import { isMaturableMaterializedPlant, OccupiedPlotData, PlotData } from "../../model/farm";
import PlotHeader from "./PlotHeader";
import classNames from "classnames";

interface EmptyPlotProps {
    plot: PlotData;
    onPlant: (plotId: number) => void;
}

interface OccupiedPlotProps {
    plot: OccupiedPlotData;
    fetchingNextStage: boolean;
    onHarvest: (plotId: number) => void;
}

export type Props = {
    loading: boolean;
    dragged: boolean;
    isDropTarget: boolean;
    isOverDropTarget: boolean;
    onDragStart: DragEventHandler<HTMLElement>;
    onDragEnter: DragEventHandler<HTMLElement>;
    onDragLeave: DragEventHandler<HTMLElement>;
    onDragEnd: DragEventHandler<HTMLElement>;
    onDrop: DragEventHandler<HTMLElement>;
} & (EmptyPlotProps | OccupiedPlotProps);

const Plot: React.FC<Props> = (props: Props) => <div
    className={classNames("Plot", { "dragged": props.dragged }, { "is-drop-target": props.isDropTarget }, { "is-over": props.isOverDropTarget })}
    draggable="true"
    onDragStart={props.onDragStart}
    onDragEnter={props.onDragEnter}
    onDragOver={(e) => e.preventDefault()}
    onDragLeave={props.onDragLeave}
    onDragEnd={props.onDragEnd}
    onDrop={props.onDrop}
>
    {"fetchingNextStage" in props ? <>
        {(props.fetchingNextStage || props.loading) &&
            overlay
        }
        <PlotHeader loading={props.loading} plot={props.plot} />
        <PlotImage plant={props.plot.plant} progress={props.plot.progress} />
        <PlotFooter
            loading={props.loading}
            progress={props.plot.progress}
            isHarvestable={!(isMaturableMaterializedPlant(props.plot.plant) && !props.plot.plant.isMature) && props.plot.progress.percentage === 1}
            onHarvest={() => props.onHarvest(props.plot.id)}
        />
    </> : <>
        {props.loading &&
            overlay
        }
        <PlotHeader />
        <PlotImage />
        <PlotFooter
            loading={props.loading}
            onPlant={() => props.onPlant(props.plot.id)}
        />
    </>}
</div>;

const overlay = <div className="overlay">
    <div className="spinner-holder">
        <LoadingSpinner />
    </div>
</div>;

export default Plot;
