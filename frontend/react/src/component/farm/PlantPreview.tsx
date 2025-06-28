import { BasePlant, isMaturableBasePlant } from "../../model/farm";
import React, { ChangeEventHandler } from "react";
import PlantImage from "./PlantImage";
import "./PlantPreview.scss";

type Props = {
    basePlant: BasePlant;
};

type State = {
    index: number;
};

class PlantPreview extends React.Component<Props, State> {
    readonly state: Readonly<State> = {
        index: 0
    };

    render() {
        const { basePlant } = this.props;
        const { index } = this.state;

        if (isMaturableBasePlant(basePlant)) {
            let src: string;
            let spriteIndex: number;

            if (index < 4) {
                src = basePlant.growingSprite;
                spriteIndex = index;
            } else {
                src = basePlant.matureSprite;
                if (index === 4) {
                    spriteIndex = 3;
                } else {
                    spriteIndex = index - 4
                }
            }

            return <div className="PlantPreview">
                <PlantImage src={src} spriteIndex={spriteIndex} alt={`${basePlant.name} sprite`} />
                <input type="range" min={0} max={7} value={index} step={1} onChange={this.handleSliderChange} />
            </div>
        } else {
            return <div className="PlantPreview">
                <PlantImage src={basePlant.growingSprite} spriteIndex={index} alt={`${basePlant.name} sprite`} />
                <input type="range" min={0} max={3} value={index} step={1} onChange={this.handleSliderChange} />
            </div>
        }
    }

    handleSliderChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        this.setState({ index: parseInt(event.target.value) });
    }
}

export default PlantPreview;
