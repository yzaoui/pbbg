import React from "react";
import "./FarmPage.scss";
import { PlotJSON } from "../backend/farm";
import cloneDeep from "lodash-es/cloneDeep";
import farmService from "../backend/farm.service";
import { Subscription } from "rxjs";
import { getPlantProgress, isMaturableMaterializedPlant, isOccupiedPlotData, PlotData, plotFromJSON } from "../model/farm";
import LoadingSpinner from "../component/LoadingSpinner";
import ExpandablePlotList from "../component/farm/ExpandablePlotList";
import PlantModal from "../component/farm/PlantModal";
import { arrayReorder } from "../helper/array";

interface LoadingState {
    status: "loading";
}

interface LoadedState {
    status: "loaded";
    plots: PlotData[];
    fetchingNextStage: Set<number>;
    loadingPlots: Set<number>;
    expanding: boolean;
    plantingPlotId: number | null;
}

type State = LoadingState | LoadedState;

class FarmPage extends React.Component<{}, State> {
    readonly state: Readonly<State> = {
        status: "loading"
    };

    private initialFetchRequest: Subscription | null = null;
    private refreshRequest: Subscription | null = null;
    private plantRequests: Map<number, Subscription> = new Map();
    private harvestRequests: Map<number, Subscription> = new Map();
    private expandingRequest: Subscription | null = null;

    componentDidMount() {
        document.title = "Farm - PBBG";

        this.initialFetchRequest = farmService.getPlots().subscribe(res =>
            this.setState({
                status: "loaded",
                plots: res.data.map(json => plotFromJSON(json)),
                fetchingNextStage: new Set(),
                loadingPlots: new Set(),
                expanding: false,
                plantingPlotId: null
            }));
    }

    componentWillUnmount() {
        this.initialFetchRequest !== null && this.initialFetchRequest.unsubscribe();
        this.refreshRequest !== null && this.refreshRequest.unsubscribe();
        this.plantRequests.forEach(req => req.unsubscribe());
        this.harvestRequests.forEach(req => req.unsubscribe());
        this.expandingRequest !== null && this.expandingRequest.unsubscribe();
    }

    render() {
        switch (this.state.status) {
            case "loading":
                return <LoadingSpinner />;
            case "loaded":
                return <div className="FarmPage">
                    <ExpandablePlotList
                        plots={this.state.plots}
                        refreshPlantProgress={this.refreshPlantProgress}
                        fetchingNextStage={this.state.fetchingNextStage}
                        loadingPlots={this.state.loadingPlots}
                        expanding={this.state.expanding}
                        onPlant={this.handlePlant}
                        onHarvest={this.handleHarvest}
                        onReorder={this.handleReorder}
                        onExpand={this.handleExpand}
                    />
                    <PlantModal open={this.state.plantingPlotId !== null} onClose={this.handlePlantModalClose} onSelect={this.handlePlantModalSelect} />
                </div>;
        }
    }

    private refreshPlantProgress = () => {
        if (this.state.status !== "loaded") return;

        const updatedPlots: PlotData[] = cloneDeep(this.state.plots);
        const now = new Date();
        const toFetch: Set<number> = new Set();

        for (const plot of updatedPlots) {
            if (isOccupiedPlotData(plot)) {
                plot.progress = getPlantProgress(plot.plant, now);

                if (plot.progress.percentage === 1 && isMaturableMaterializedPlant(plot.plant) && !plot.plant.isMature) {
                    toFetch.add(plot.id);

                    if (this.refreshRequest === null) this.fetchPlots();
                }
            }
        }

        this.setState({ ...this.state, plots: updatedPlots, fetchingNextStage: toFetch });
    };

    private fetchPlots = () => {
        this.refreshRequest = farmService.getPlots()
            .subscribe(res => {
                this.refreshRequest = null;
                this.setPlots(res.data);
            });
    };

    private setPlots = (updatedPlotsJSON: PlotJSON[]) => {
        if (this.state.status !== "loaded") return;

        this.setState({ ...this.state, plots: updatedPlotsJSON.map(plotJSON => plotFromJSON(plotJSON)) });
        this.refreshPlantProgress();
    };

    private updatePlot = (updatedPlot: PlotJSON) => {
        if (this.state.status !== "loaded") return;

        const updatedPlots = Array.from(this.state.plots);
        const updatedPlotIndex = updatedPlots.findIndex(plot => plot.id === updatedPlot.id);

        updatedPlots[updatedPlotIndex] = plotFromJSON(updatedPlot);

        const updatedLoadingPlots = new Set(this.state.loadingPlots);
        updatedLoadingPlots.delete(updatedPlot.id);

        this.setState({ ...this.state, plots: updatedPlots, loadingPlots: updatedLoadingPlots });
        this.refreshPlantProgress();
    };

    private handlePlant = (plotId: number) => {
        if (this.state.status !== "loaded") return;

        this.setState({ ...this.state, plantingPlotId: plotId });
    };

    private handleHarvest = (plotId: number) => {
        if (this.state.status !== "loaded") return;

        const existingRequest = this.harvestRequests.get(plotId);
        if (existingRequest) {
            existingRequest.unsubscribe();
            this.harvestRequests.delete(plotId);
        }

        this.setState({ ...this.state, loadingPlots: (new Set(this.state.loadingPlots)).add(plotId) });

        const newRequest = farmService.harvest({ plotId: plotId })
            .subscribe(res => {
                this.harvestRequests.delete(plotId);
                this.updatePlot(res.data);
            });

        this.harvestRequests.set(plotId, newRequest);
    };

    private handleReorder = (plotId: number, targetIndex: number) => {
        // TODO: Show loading UI while reordering
        this.setState(prevState => {
            if (prevState.status !== "loaded") throw Error();

            const sourceIndex = prevState.plots.findIndex(plot => plot.id === plotId);

            if (sourceIndex === -1) throw Error();

            if (sourceIndex === targetIndex) return null;

            return { ...prevState, plots: arrayReorder(prevState.plots, sourceIndex, targetIndex) };
        }, () => {
            farmService.reorder({ plotId: plotId, targetIndex: targetIndex });
        });
    }

    private handleExpand = () => {
        if (this.state.status !== "loaded") return;

        if (this.expandingRequest !== null) this.expandingRequest.unsubscribe();

        this.setState({ ...this.state, expanding: true });

        this.expandingRequest = farmService.expand()
            .subscribe(res => {
                this.expandingRequest = null;
                this.setState((prevState) => {
                    if (prevState.status !== "loaded") return prevState;

                    return { ...prevState, expanding: false, plots: prevState.plots.concat(plotFromJSON(res.data)) };
                });
            });
    };

    private handlePlantModalSelect = (itemId: number) => {
        if (this.state.status !== "loaded") return;

        const plotId = this.state.plantingPlotId!;

        const existingRequest = this.plantRequests.get(plotId);
        if (existingRequest) {
            existingRequest.unsubscribe();
            this.plantRequests.delete(plotId);
        }

        this.setState((prevState: State) => {
            if (prevState.status !== "loaded") throw Error();

            return { ...prevState, plantingPlotId: null, loadingPlots: (new Set(prevState.loadingPlots)).add(plotId) };
        });

        this.plantRequests.set(plotId,
            farmService.plant({ plotId: plotId, itemId: itemId })
                .subscribe(res => {
                    this.plantRequests.delete(plotId);
                    this.updatePlot(res.data);
                })
        );
    };

    private handlePlantModalClose = () => {
        if (this.state.status !== "loaded") return;

        this.setState({ ...this.state, plantingPlotId: null });
    };
}

export default FarmPage;
