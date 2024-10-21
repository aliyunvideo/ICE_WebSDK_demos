import { CustomFontItem, PlayerInitConfig, IObservable, RangeAreaInitOption, ExportTrack, RangeAreaItem, ExportClip, Locales } from './globalInterface';
import { EventData } from './eventManager';
import { IServerTimeline, ServerTimelineAdapter, ParsedResult, ServerClips, ServerClip } from './timelinePlayerUtil';
declare class AliyunTimelinePlayer {
    static TimelineAdapter: typeof ServerTimelineAdapter;
    static getSubtitleEffectColorStyles(): Array<{
        key: string;
        cover: string;
    }>;
    static getSubtitleBubbles(): Array<{
        key: string;
        cover: string;
    }>;
    static setDefaultLocale(locale?: Locales): void;
    static getDefaultFontList(): CustomFontItem[];
    static getVideoEffects(): Array<{
        subType: string;
        cover: string;
        name: string;
        title: string;
        category: string | undefined;
    }>;
    static getVideoFilters(): Array<{
        subType: string;
        cover: string;
        name: string;
        title: string;
        category: string | undefined;
    }>;
    static getVideoTransitions(): Array<{
        subType: string;
        cover: string;
        name: string;
        title: string;
        category: string | undefined;
    }>;
    static parseTimeline(timeline: string | IServerTimeline, options?: {
        outputWidth: number;
        outputHeight: number;
    }): ParsedResult;
    private publicEventEmitter;
    private forcedAspectRatio;
    private subs;
    private fontList;
    private mode;
    private cid;
    constructor(config: PlayerInitConfig);
    snapshot(): Promise<void>;
    play(): void;
    pause(): void;
    destroy(): void;
    on(eventName: string, callback: Function): any;
    once(eventName: string, callback: Function): any;
    off(eventName: string): any;
    get event$(): IObservable<EventData<any>>;
    get version(): string | undefined;
    get duration(): number;
    get timeline(): any;
    set timeline(timeline: any);
    get displayWidth(): number;
    get displayHeight(): number;
    get stageWidth(): number;
    get stageHeight(): number;
    setTimeline(timeline: any, keepMediaId?: boolean): Promise<void>;
    get currentTime(): number;
    set currentTime(currentTime: number);
    get controls(): boolean;
    set controls(show: boolean);
    get aspectRatio(): string;
    set aspectRatio(ratio: string);
    get playbackRate(): number;
    set playbackRate(speed: number);
    setFontList(value: CustomFontItem[]): Promise<void>;
    loadAllFont(): Promise<boolean[]>;
    importSubtitles(type: 'ass' | 'srt' | 'clip' | 'asr', config: string): void;
    submitAiJob(id: number): Promise<void>;
    watchTrack(handler?: (tracks: ExportTrack[]) => void): () => void;
    removeTrack(id: number): void;
    setTrack(id: number, options: {
        visible?: boolean;
        mainTrack?: boolean;
    }): void;
    addTrack(track: Omit<ExportTrack, 'clips'>, options?: {
        insertIndex?: number;
    }): void;
    removeClip(id: number): void;
    getClip<T extends keyof ServerClips>(id: number): any;
    addClip<T extends keyof ServerClips>(clip: ServerClip<T>): void;
    setClipTimelineIn(id: number, timelineIn: number): void;
    setClipTimelineOut(id: number, timelineOut: number): void;
    updateClip<T extends keyof ServerClips>(id: number, handle: (clip: ServerClip<T>) => ServerClip<T>): void;
    watchClip<T extends keyof ServerClips>(id: number, handle: (clip: ServerClip<T> | null) => void): () => void;
    toBackendTimeline(): {
        duration: number;
        timeline: any;
    };
    queryTracks(handler: (track: ExportTrack) => boolean): ExportTrack[];
    queryClips(handler: (clip: ExportClip, track: ExportTrack) => boolean): ExportClip[];
    focusClip(id: number, autoSeek?: boolean): void;
    blurClip(): void;
    createRangeArea(optons: RangeAreaInitOption): RangeAreaItem | null;
}
declare const playerExport: typeof AliyunTimelinePlayer;
export type AliyunTimelinePlayerType = AliyunTimelinePlayer;
export default playerExport;
