import cloneDeep from "lodash-es/cloneDeep";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";
import { PlotJSON } from "../backend/farm";
import farmService from "../backend/farm.service";
import LoadingSpinner from "../component/LoadingSpinner";
import ExpandablePlotList from "../component/farm/ExpandablePlotList";
import PlantModal from "../component/farm/PlantModal";
import { arrayReorder } from "../helper/array";
import { getPlantProgress, isMaturableMaterializedPlant, isOccupiedPlotData, PlotData, plotFromJSON } from "../model/farm";
import "./FarmPage.scss";

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

const FarmPage: React.FC = () => {
    const [state, setState] = useState<State>({ status: "loading" });
    const refreshRequestRef = useRef<Subscription>(null);
    const plantRequestsRef = useRef<Map<number, Subscription>>(new Map());
    const harvestRequestsRef = useRef<Map<number, Subscription>>(new Map());
    const expandingRequestRef = useRef<Subscription>(null);

    useEffect(() => {
        const subscription = farmService.getPlots().subscribe(res =>
            setState({
                status: "loaded",
                plots: res.data.map(json => plotFromJSON(json)),
                fetchingNextStage: new Set(),
                loadingPlots: new Set(),
                expanding: false,
                plantingPlotId: null
            }));

        return () => {
            subscription.unsubscribe();
            refreshRequestRef.current?.unsubscribe();
            // eslint-disable-next-line react-hooks/exhaustive-deps
            plantRequestsRef.current.forEach(req => req.unsubscribe());
            // eslint-disable-next-line react-hooks/exhaustive-deps
            harvestRequestsRef.current.forEach(req => req.unsubscribe());
            expandingRequestRef.current?.unsubscribe();
        };
    }, []);

    const refreshPlantProgress = useCallback(() => {
        if (state.status !== "loaded") return;

        const updatedPlots: PlotData[] = cloneDeep(state.plots);
        const now = new Date();
        const toFetch: Set<number> = new Set();

        for (const plot of updatedPlots) {
            if (isOccupiedPlotData(plot)) {
                plot.progress = getPlantProgress(plot.plant, now);

                if (plot.progress.percentage === 1 && isMaturableMaterializedPlant(plot.plant) && !plot.plant.isMature) {
                    toFetch.add(plot.id);

                    if (refreshRequestRef.current === null) {
                        refreshRequestRef.current = farmService.getPlots()
                            .subscribe(res => {
                                refreshRequestRef.current = null;
                                setState(prevState => {
                                    if (prevState.status !== "loaded") return prevState;
                                    return { ...prevState, plots: res.data.map(plotJSON => plotFromJSON(plotJSON)) };
                                });
                            });
                    }
                }
            }
        }

        setState(prevState => {
            if (prevState.status !== "loaded") return prevState;
            return { ...prevState, plots: updatedPlots, fetchingNextStage: toFetch };
        });
    }, [state]);

    const updatePlot = useCallback((updatedPlot: PlotJSON) => {
        setState(prevState => {
            if (prevState.status !== "loaded") return prevState;

            const updatedPlots = Array.from(prevState.plots);
            const updatedPlotIndex = updatedPlots.findIndex(plot => plot.id === updatedPlot.id);

            updatedPlots[updatedPlotIndex] = plotFromJSON(updatedPlot);

            const updatedLoadingPlots = new Set(prevState.loadingPlots);
            updatedLoadingPlots.delete(updatedPlot.id);

            return { ...prevState, plots: updatedPlots, loadingPlots: updatedLoadingPlots };
        });
    }, []);

    const handlePlant = (plotId: number) => {
        if (state.status !== "loaded") return;

        setState(prevState => {
            if (prevState.status !== "loaded") return prevState;
            return { ...prevState, plantingPlotId: plotId };
        });
    };

    const handleHarvest = (plotId: number) => {
        if (state.status !== "loaded") return;

        const existingRequest = harvestRequestsRef.current.get(plotId);
        if (existingRequest) {
            existingRequest.unsubscribe();
            harvestRequestsRef.current.delete(plotId);
        }

        setState(prevState => {
            if (prevState.status !== "loaded") return prevState;
            return { ...prevState, loadingPlots: (new Set(prevState.loadingPlots)).add(plotId) };
        });

        const newRequest = farmService.harvest({ plotId: plotId })
            .subscribe(res => {
                harvestRequestsRef.current.delete(plotId);
                updatePlot(res.data);
            });

        harvestRequestsRef.current.set(plotId, newRequest);
    };

    const handleReorder = (plotId: number, targetIndex: number) => {
        // TODO: Show loading UI while reordering
        setState(prevState => {
            if (prevState.status !== "loaded") throw Error();

            const sourceIndex = prevState.plots.findIndex(plot => plot.id === plotId);

            if (sourceIndex === -1) throw Error();

            if (sourceIndex === targetIndex) return prevState;

            return { ...prevState, plots: arrayReorder(prevState.plots, sourceIndex, targetIndex) };
        });

        farmService.reorder({ plotId: plotId, targetIndex: targetIndex });
    };

    const handleExpand = () => {
        if (state.status !== "loaded") return;

        expandingRequestRef.current?.unsubscribe();

        setState(prevState => {
            if (prevState.status !== "loaded") return prevState;
            return { ...prevState, expanding: true };
        });

        expandingRequestRef.current = farmService.expand()
            .subscribe(res => {
                expandingRequestRef.current = null;
                setState((prevState) => {
                    if (prevState.status !== "loaded") return prevState;

                    return { ...prevState, expanding: false, plots: prevState.plots.concat(plotFromJSON(res.data)) };
                });
            });
    };

    const handlePlantModalSelect = (itemId: number) => {
        if (state.status !== "loaded") return;

        const plotId = state.plantingPlotId!;

        const existingRequest = plantRequestsRef.current.get(plotId);
        if (existingRequest) {
            existingRequest.unsubscribe();
            plantRequestsRef.current.delete(plotId);
        }

        setState((prevState: State) => {
            if (prevState.status !== "loaded") return prevState;

            return { ...prevState, plantingPlotId: null, loadingPlots: (new Set(prevState.loadingPlots)).add(plotId) };
        });

        plantRequestsRef.current.set(plotId,
            farmService.plant({ plotId: plotId, itemId: itemId })
                .subscribe(res => {
                    plantRequestsRef.current.delete(plotId);
                    updatePlot(res.data);
                })
        );
    };

    const handlePlantModalClose = () => {
        if (state.status !== "loaded") return;

        setState(prevState => {
            if (prevState.status !== "loaded") return prevState;
            return { ...prevState, plantingPlotId: null };
        });
    };

    return <>
        <title>Farm - PBBG</title>
        {(() => {
            switch (state.status) {
                case "loading":
                    return <LoadingSpinner />;
                case "loaded":
                    return <div className="FarmPage">
                        <ExpandablePlotList
                            plots={state.plots}
                            refreshPlantProgress={refreshPlantProgress}
                            fetchingNextStage={state.fetchingNextStage}
                            loadingPlots={state.loadingPlots}
                            expanding={state.expanding}
                            onPlant={handlePlant}
                            onHarvest={handleHarvest}
                            onReorder={handleReorder}
                            onExpand={handleExpand}
                        />
                        <PlantModal open={state.plantingPlotId !== null} onClose={handlePlantModalClose} onSelect={handlePlantModalSelect} />
                    </div>;
            }
        })()}
    </>;
};

export default FarmPage;
