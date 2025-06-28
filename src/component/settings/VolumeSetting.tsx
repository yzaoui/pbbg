import React, { ChangeEventHandler } from "react";
import audioService from "../../audio.service";
import "./VolumeSetting.scss"

interface State {
    volume: string;
}

class VolumeSetting extends React.Component {
    readonly state: Readonly<State> = {
        volume: audioService.getVolume().toString()
    };

    render() {
        return <fieldset className="ChangeSoundVolume">
            <legend>Volume</legend>
            <div>
                <label htmlFor="volume">Adjust sound effect volume</label>
                <input type="range" id="volume" min="0" max="1" step="0.01" onChange={this.handleChange} value={this.state.volume} />
            </div>
        </fieldset>;
    }

    handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const volume = event.target.value;

        audioService.setVolume(volume);
        this.setState({ volume: volume })
    };
}

export default VolumeSetting;
