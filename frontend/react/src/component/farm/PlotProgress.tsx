import React from "react";
import { PlantProgress } from "../../model/farm";

type Props = {
    progress: PlantProgress;
    ready: boolean;
};

const PlotProgress: React.FC<Props> = ({ progress, ready }) => <div className="PlotProgress">
    {ready ? "Ready" : progress.remainingTime}
</div>;

export default PlotProgress;
