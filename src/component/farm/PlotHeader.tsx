import React from "react";
import { OccupiedPlotData} from "../../model/farm";

type Props = {
    loading: boolean;
    plot: OccupiedPlotData;
} | {};

const PlotHeader: React.FC<Props> = (props) => <div className="PlotHeader">
    {"plot" in props ? <>
        <span>{props.plot.plant.basePlant.name}</span>
    </> : <>
        <span/>
    </>}
</div>

export default PlotHeader;
