import { IConfig, InputMedia, PlayerAspectRatio, IObservable } from './globalInterface';
import { EventData } from './eventManager';
interface CustomTimeline {
    VideoTracks?: any;
    AudioTracks?: any;
    AspectRatio?: PlayerAspectRatio;
}
declare const _default: {
    init: (config: IConfig) => void;
    destroy: (keepState?: boolean | undefined) => boolean;
    version: string | undefined;
    setCurrentTime: (currentTime: number) => void;
    getCurrentTime: () => number;
    getDuration: () => number;
    addProjectMaterials: (materials: InputMedia[]) => void;
    setProjectMaterials: (materials: InputMedia[]) => void;
    deleteProjectMaterial: (mediaId: string) => void;
    setProjectTimeline: ({ VideoTracks, AudioTracks, AspectRatio }: CustomTimeline) => void;
    getProjectTimeline: () => any;
    getEvents: (eventType?: "error" | "ui" | "player" | "websdk" | "timeline" | undefined) => IObservable<EventData<any>>;
    importSubtitles: (type: "ass" | "clip" | "asr" | "srt", config: string) => void;
};
export default _default;
