import { Howler } from "howler";

const audioService = {
    setVolume: (volume: number ) => {
        if (volume < 0 || volume > 1) throw Error();

        Howler.volume(volume)
    },
    getVolume: () => Howler.volume()
};

export default audioService;
