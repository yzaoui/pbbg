import React, { ChangeEventHandler, useState } from "react";
import { BasePlant, isMaturableBasePlant } from "../../model/farm";
import PlantImage from "./PlantImage";
import styles from "./PlantPreview.module.scss";

type Props = {
    basePlant: BasePlant;
};

const PlantPreview: React.FC<Props> = ({ basePlant }) => {
    const [index, setIndex] = useState(0);

    const handleSliderChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setIndex(parseInt(event.target.value));
    };

    if (isMaturableBasePlant(basePlant)) {
        let src: string;
        let spriteIndex: number;

        if (index < NUM_MATURABLE_GROWING_STAGES) {
            src = basePlant.growingSprite;
            spriteIndex = index;
        } else {
            src = basePlant.matureSprite;
            const relativeIndex = index - NUM_MATURABLE_GROWING_STAGES;
            if (relativeIndex == 0) { // first index in mature stage is special, we want to show the last stage
                spriteIndex = NUM_MATURABLE_MATURE_STAGES - 1;
            } else {
                spriteIndex = relativeIndex - 1; // subtract 1 to make up for the above
            }
        }

        return <div className={styles.PlantPreview}>
            <PlantImage src={src} spriteIndex={spriteIndex} alt={`${basePlant.name} sprite`} />
            <input type="range" min={0} max={NUM_MATURABLE_STAGES - 1} value={index} step={1} onChange={handleSliderChange} />
        </div>;
    } else {
        return <div className={styles.PlantPreview}>
            <PlantImage src={basePlant.growingSprite} spriteIndex={index} alt={`${basePlant.name} sprite`} />
            <input type="range" min={0} max={NUM_BASE_STAGES - 1} value={index} step={1} onChange={handleSliderChange} />
        </div>;
    }
};

const NUM_BASE_STAGES = 4;
const NUM_MATURABLE_GROWING_STAGES = 4;
const NUM_MATURABLE_MATURE_STAGES = 4;
const NUM_MATURABLE_STAGES = NUM_MATURABLE_GROWING_STAGES + NUM_MATURABLE_MATURE_STAGES + 1; // add 1 since ready-to-harvest sprite should appear twice

export default PlantPreview;
