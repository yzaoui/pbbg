import { Howler } from "howler";

const audioService = {
    setVolume: (volume: number | string) => {
        let vol = volume;

        if (typeof volume === "string") vol = parseFloat(volume);

        if (vol < 0 || vol > 1) throw Error();

        Howler.volume(vol as number)
    },
    getVolume: () => Howler.volume()
};

export default audioService;
