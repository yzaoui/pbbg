import { BasePlantJSON, isMaturableBasePlantJSON, MaterializedPlantJSON, MaturableBasePlantJSON, PlotJSON } from "../backend/farm";

export interface PlotData {
    id: number;
}

export interface OccupiedPlotData extends PlotData {
    plant: MaterializedPlant;
    progress: PlantProgress;
}

export const isOccupiedPlotData = (plot: PlotData): plot is OccupiedPlotData => "plant" in plot && "progress" in plot;

export interface MaterializedPlant {
    basePlant: BasePlant;
    cycleStart: string;
}

export interface MaturableMaterializedPlant extends MaterializedPlant {
    basePlant: MaturableBasePlant;
    isMature: boolean;
}

export const isMaturableMaterializedPlant = (plant: MaterializedPlant): plant is MaturableMaterializedPlant => "isMature" in plant;

export interface PlantProgress {
    percentage: number;
    remainingTime: string;
}

export interface BasePlant {
    id: number;
    name: string;
    icon: string;
    description: string;
    growingPeriod: number;
    growingSprite: string;
}

export interface MaturableBasePlant extends BasePlant {
    maturePeriod: number;
    matureSprite: string;
}

export const isMaturableBasePlant = (plant: BasePlant): plant is MaturableBasePlant => "maturePeriod" in plant && "matureSprite" in plant;

export const plotFromJSON = (plot: PlotJSON): PlotData => {
    if (plot.plant !== null) {
        return is<OccupiedPlotData>({
            id: plot.id,
            plant: materializedPlantFromJSON(plot.plant),
            progress: getPlantProgress(plot.plant, new Date())
        })
    } else {
        return {
            id: plot.id
        };
    }
};

const is = <T>(x: T): T => x;

const materializedPlantFromJSON = (plant: MaterializedPlantJSON): MaterializedPlant => {
    if (plant.isMature !== null) {
        return is<MaturableMaterializedPlant>({
            basePlant: maturableBasePlantFromJSON(plant.basePlant),
            cycleStart: plant.cycleStart,
            isMature: plant.isMature
        });
    } else {
        return {
            basePlant: basePlantFromJSON(plant.basePlant),
            cycleStart: plant.cycleStart
        };
    }
};

export const basePlantFromJSON = (basePlant: BasePlantJSON): BasePlant => {
    if (isMaturableBasePlantJSON(basePlant)) return maturableBasePlantFromJSON(basePlant);

    return {
        id: basePlant.id,
        name: basePlant.name,
        icon: basePlant.icon,
        description: basePlant.description,
        growingPeriod: basePlant.growingPeriod,
        growingSprite: basePlant.growingSprite,
    };
};

export const maturableBasePlantFromJSON = (basePlant: MaturableBasePlantJSON): MaturableBasePlant => ({
    id: basePlant.id,
    name: basePlant.name,
    icon: basePlant.icon,
    description: basePlant.description,
    growingPeriod: basePlant.growingPeriod,
    growingSprite: basePlant.growingSprite,
    maturePeriod: basePlant.maturePeriod,
    matureSprite: basePlant.matureSprite
});

export const getPlantProgress = (plant: MaterializedPlant, nowDate: Date): PlantProgress => {
    const start = Date.parse(plant.cycleStart);
    const period = isMaturableMaterializedPlant(plant) && plant.isMature ? plant.basePlant.maturePeriod : plant.basePlant.growingPeriod;
    const end = start + period * 1000;
    const now = nowDate.getTime();

    if (now > end) {
        return {
            percentage: 1,
            remainingTime: millisecondsToDurationString(0)
        };
    } else if (now < start) {
        return {
            percentage: 0,
            remainingTime: millisecondsToDurationString(end - start)
        };
    } else {
        return {
            percentage: ((now - start) / (end - start)),
            remainingTime: millisecondsToDurationString(end - now)
        };
    }
};

const millisecondsToDurationString = (ms: number): string => {
    const hours = Math.floor(ms / 1000 / 60 / 60) + "h";
    const minutes = Math.floor((ms / 1000 / 60) % 60) + "m";
    const seconds = Math.floor((ms / 1000) % 60) + "s";

    return ms < 1000 * 60 ? seconds
        : ms < 1000 * 60 * 60 ? minutes + seconds
        : hours + minutes + seconds
};

export const secondsToDurationString = (s: number): string => millisecondsToDurationString(s * 1000);
