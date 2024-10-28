import { IConfig, InputMedia, PlayerAspectRatio, IObservable, CustomFontItem } from './globalInterface';
import { EventData } from './eventManager';
interface CustomTimeline {
    VideoTracks?: any;
    AudioTracks?: any;
    AspectRatio?: PlayerAspectRatio;
}
declare const EditorExport: {
    init: (config: IConfig) => void;
    destroy: (keepState?: boolean) => boolean;
    version: string | undefined;
    setCurrentTime: (currentTime: number) => void;
    getCurrentTime: () => number;
    getDuration: () => number;
    addProjectMaterials: (materials: InputMedia[]) => void;
    setProjectMaterials: (materials: InputMedia[]) => void;
    updateProjectMaterials: (update: (materials: InputMedia[]) => InputMedia[]) => void;
    deleteProjectMaterial: (mediaId: string) => void;
    setProjectTimeline: ({ VideoTracks, AudioTracks, AspectRatio }: CustomTimeline) => Promise<void>;
    getProjectTimeline: () => any;
    getEvents: (eventType?: 'ui' | 'player' | 'error' | 'websdk' | 'timeline') => IObservable<EventData<any>>;
    importSubtitles: (type: 'ass' | 'srt' | 'clip' | 'asr', config: string) => void;
    getSubtitleEffectColorStyles: () => Array<{
        key: string;
        cover: string;
    }>;
    getSubtitleBubbles: () => Array<{
        key: string;
        cover: string;
    }>;
    getDefaultFontList(): CustomFontItem[];
};
export default EditorExport;
