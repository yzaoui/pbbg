import React from "react";
import Plot from "./Plot";
import { isOccupiedPlotData, PlotData } from "../../model/farm";

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
}

class PlotList extends React.Component<Props, State> {
    readonly state: Readonly<State> = {
        status: "idle"
    };

    private forceUpdateInterval: (number | null) = null;

    componentDidMount() {
        this.forceUpdateInterval = window.setInterval(this.props.refreshPlantProgress, 100);
    }

    componentWillUnmount() {
        if (this.forceUpdateInterval !== null) {
            clearInterval(this.forceUpdateInterval);
            this.forceUpdateInterval = null;
        }
    }

    render() {
        const { plots, fetchingNextStage, loadingPlots, onPlant, onHarvest } = this.props;
        const draggedPlotId = this.state.status === "idle" ? null : this.state.draggedPlotId;
        const isOverDropTargetPlotId = this.state.status === "idle" ? null : this.state.dropTargetPlotId;
        const isDragging = this.state.status === "dragging"

        return <ul className="PlotList">
            {plots.map((plot, index) =>
                <li key={plot.id}>
                    <Plot
                        dragged={draggedPlotId === plot.id}
                        isDropTarget={isDragging}
                        isOverDropTarget={isOverDropTargetPlotId === plot.id}
                        onDragStart={(e) => this.handlePlotDragStart(e, plot.id)}
                        onDragEnter={(e) => this.handlePlotDragEnter(e, plot.id)}
                        onDragLeave={(e) => this.handlePlotDragLeave(e, plot.id)}
                        onDragEnd={(e) => this.handlePlotDragEnd(e)}
                        onDrop={(e) => this.handlePlotDrop(e, plot.id, index)}
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
    }

    private handlePlotDragStart = (event: React.DragEvent<HTMLElement>, plotId: number) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("application/pbbg-plot-id", plotId.toString());

        this.setState({
            status: "dragging",
            draggedPlotId: plotId,
            dropTargetPlotId: plotId
        });
    };

    private handlePlotDragEnter = (event: React.DragEvent<HTMLElement>, plotId: number) => {
        if (event.dataTransfer.getData("application/pbbg-plot-id").length === 0) return;

        if (this.state.status === "dragging") this.setState((prevState) => {
            return { ...prevState, dropTargetPlotId: plotId };
        })

        return false;
    };

    private handlePlotDragLeave = (event: React.DragEvent<HTMLElement>, plotId: number) => {
        if (event.dataTransfer.getData("application/pbbg-plot-id").length === 0) return;

        // TODO: Implement leaving drag area

        return false;
    };

    private handlePlotDragEnd = (event: React.DragEvent<HTMLElement>) => {
        if (this.state.status === "dragging") this.setState({ status: "idle" });

        return false;
    };

    private handlePlotDrop = (event: React.DragEvent<HTMLElement>, plotId: number, targetIndex: number) => {
        const plotIdData = event.dataTransfer.getData("application/pbbg-plot-id");
        if (plotIdData.length === 0) return

        event.stopPropagation();
        event.preventDefault();
        const sourcePlotId = Number(plotIdData);

        if (sourcePlotId !== plotId) {
            this.props.onReorder(sourcePlotId, targetIndex);
        }
    };
}

export default PlotList;
