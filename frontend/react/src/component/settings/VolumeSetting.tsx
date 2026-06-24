import "./VolumeSetting.scss";

import React, { ChangeEventHandler, useState } from "react";

import audioService from "../../audio.service";

const VolumeSetting: React.FC = () => {
    const [volume, setVolume] = useState(audioService.getVolume);

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const volume = parseFloat(event.target.value);

        audioService.setVolume(volume);
        setVolume(volume);
    };

    return <fieldset className="ChangeSoundVolume">
        <legend>Volume</legend>
        <div>
            <label htmlFor="volume">Adjust sound effect volume</label>
            <input type="range" id="volume" min="0" max="1" step="0.01" onChange={handleChange} value={volume} />
        </div>
    </fieldset>;
};

export default VolumeSetting;
