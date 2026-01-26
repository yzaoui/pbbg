import React, { useEffect, useState } from "react";
import { isOccupiedPlotData, PlotData } from "../../model/farm";
import Plot from "./Plot";

type Props = {
    plots: PlotData[];
    refreshPlantProgress: () => void;
    fetchingNextStage: Set<number>;
    loadingPlots: Set<number>;
    onPlant: (plotId: number) => void;
    onHarvest: (plotId: number) => void;
    onReorder: (plotId: number, index: number) => void;
};

type State = {
    status: "idle";
} | {
    status: "dragging";
    draggedPlotId: number;
    dropTargetPlotId: number | null;
};

const PlotList: React.FC<Props> = ({ plots, refreshPlantProgress, fetchingNextStage, loadingPlots, onPlant, onHarvest, onReorder }) => {
    const [state, setState] = useState<State>({ status: "idle" });

    useEffect(() => {
        const interval = window.setInterval(refreshPlantProgress, 100);

        return () => clearInterval(interval);
    }, [refreshPlantProgress]);

    const handlePlotDragStart = (event: React.DragEvent<HTMLElement>, plotId: number) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("application/pbbg-plot-id", plotId.toString());

        setState({
            status: "dragging",
            draggedPlotId: plotId,
            dropTargetPlotId: plotId
        });
    };

    const handlePlotDragEnter = (event: React.DragEvent<HTMLElement>, plotId: number) => {
        if (event.dataTransfer.getData("application/pbbg-plot-id").length === 0) return;

        if (state.status === "dragging") setState((prevState) => {
            return { ...prevState, dropTargetPlotId: plotId };
        });

        return false;
    };

    const handlePlotDragLeave = (event: React.DragEvent<HTMLElement>, _plotId: number) => {
        if (event.dataTransfer.getData("application/pbbg-plot-id").length === 0) return;
        // TODO: Implement leaving drag area
        return false;
    };

    const handlePlotDragEnd = (_event: React.DragEvent<HTMLElement>) => {
        if (state.status === "dragging") setState({ status: "idle" });

        return false;
    };

    const handlePlotDrop = (event: React.DragEvent<HTMLElement>, plotId: number, targetIndex: number) => {
        const plotIdData = event.dataTransfer.getData("application/pbbg-plot-id");
        if (plotIdData.length === 0) return;

        event.stopPropagation();
        event.preventDefault();
        const sourcePlotId = Number(plotIdData);

        if (sourcePlotId !== plotId) {
            onReorder(sourcePlotId, targetIndex);
        }
    };

    const draggedPlotId = state.status === "idle" ? null : state.draggedPlotId;
    const isOverDropTargetPlotId = state.status === "idle" ? null : state.dropTargetPlotId;
    const isDragging = state.status === "dragging";

    return <ul className="PlotList">
        {plots.map((plot, index) =>
            <li key={plot.id}>
                <Plot
                    dragged={draggedPlotId === plot.id}
                    isDropTarget={isDragging}
                    isOverDropTarget={isOverDropTargetPlotId === plot.id}
                    onDragStart={(e) => handlePlotDragStart(e, plot.id)}
                    onDragEnter={(e) => handlePlotDragEnter(e, plot.id)}
                    onDragLeave={(e) => handlePlotDragLeave(e, plot.id)}
                    onDragEnd={(e) => handlePlotDragEnd(e)}
                    onDrop={(e) => handlePlotDrop(e, plot.id, index)}
                    loading={loadingPlots.has(plot.id)}
                    {...(isOccupiedPlotData(plot) ? {
                        plot: plot,
                        fetchingNextStage: fetchingNextStage.has(plot.id),
                        onHarvest: onHarvest
                    } : {
                        plot: plot,
                        onPlant: onPlant
                    }
                    )}
                />
            </li>
        )}
    </ul>;
};

export default PlotList;
