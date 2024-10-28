import { CustomFontItem, InputMedia, MaterialType, MediaIdType } from './globalInterface';
export declare function encodeUrl(url: string): string;
export type ServerEffectTrackItem = {
    Id?: number;
    TrackId?: number;
    Type: string;
    SubType?: string;
    TimelineIn?: number;
    TimelineOut?: number;
    Duration?: number;
    X?: number;
    Y?: number;
    Width?: number;
    Height?: number;
    From?: number;
    To?: number;
    _mode?: 'from' | 'to';
    Loudness?: number;
    TruePeak?: number;
    Peak?: number;
    Gain?: number;
};
export type BaseClip = {
    _durationMode?: 'absolute' | 'relative' | 'full';
    _durationModeValue?: number;
    _durationRange?: {
        oriTimelineIn?: number;
        oriTimelineOut?: number;
    };
    _durationRatio?: number;
    businessType?: string;
};
export type BaseMediaClip = BaseClip & {
    Duration?: number;
    ReferenceClipId?: string;
    ClipId?: string;
    VirginDuration?: number;
    NoReferTimelineOut?: boolean;
    NoReferTimelineIn?: boolean;
};
export type ServerClips = {
    [MaterialType.Image]: ServerImageTrackClip;
    [MaterialType.Audio]: ServerAudioTrackClip;
    [MaterialType.Video]: ServerVideoTrackClip;
    [MaterialType.Subtitle]: ServerSubtitleTrackClip;
};
export type ServerClip<T extends keyof ServerClips> = ServerClips[T];
export type ServerVideoTrackClip = BaseMediaClip & {
    Id?: number;
    TrackId?: number;
    MediaId?: string;
    MediaIdType?: MediaIdType;
    MediaURL?: string;
    Type: string;
    X?: number;
    Y?: number;
    Width?: number;
    Height?: number;
    AdaptMode?: string;
    In?: number;
    Out?: number;
    MaxOut?: number;
    DyncFrames?: number;
    TimelineIn?: number;
    TimelineOut?: number;
    Speed?: number;
    MaskVideoUrl?: string;
    Effects?: ServerEffectTrackItem[];
};
export type ServerImageTrackClip = {
    Id?: number;
    Type?: string;
    TrackId?: number;
    MediaId?: string;
    MediaURL?: string;
    PreviewUrl?: string;
    X?: number;
    Y?: number;
    Width?: number;
    Height?: number;
    DyncFrames?: number;
    TimelineIn?: number;
    TimelineOut?: number;
    Speed?: number;
    MaskVideoUrl?: string;
    Effects?: ServerEffectTrackItem[];
};
export type ServerAudioTrackClip = BaseMediaClip & {
    Id?: number;
    TrackId?: number;
    Type?: string;
    Content?: string;
    Voice?: string;
    CustomizedVoice?: string;
    Format?: string;
    SpeechRate?: number;
    PitchRate?: number;
    MediaId?: string;
    MediaURL?: string;
    In?: number;
    Out?: number;
    MaxOut?: number;
    TimelineIn?: number;
    TimelineOut?: number;
    Speed?: number;
    LoopMode?: boolean;
    Effects?: ServerEffectTrackItem[];
};
export type ServerSubtitleTrackClip = {
    Id?: number;
    TrackId?: number;
    Type?: string;
    SubType?: string;
    FileURL?: string;
    Font?: string;
    FontSize?: number;
    FontColor?: string;
    FontColorOpacity?: string;
    FontFace?: {
        Bold: boolean;
        Italic: boolean;
        Underline: boolean;
    };
    Spacing?: number;
    LineSpacing?: number;
    Angle?: number;
    BorderStyle?: number;
    Outline?: number;
    OutlineColour?: string;
    Shadow?: number;
    BackColour?: string;
    Alignment?: string;
    AdaptMode?: string;
    TextWidth?: number;
    FontUrl?: string;
    EffectColorStyle?: string;
    AaiMotionInEffect?: string;
    AaiMotionIn?: string;
    AaiMotionOutEffect?: string;
    AaiMotionOut?: string;
    AaiMotionLoopEffect?: string;
    X?: number;
    Y?: number;
    Content?: string;
    TimelineIn?: number;
    TimelineOut?: number;
    Ratio?: number;
};
export type ServerVideoTrack = {
    Id?: number;
    Type: string;
    MainTrack?: boolean;
    VideoTrackClips?: ServerVideoTrackClip[];
    TrackShortenMode?: 'AutoSpeed';
    TrackExpandMode?: 'AutoSpeed';
    Disabled?: boolean;
};
export type ServerAudioTrack = {
    Id?: number;
    MainTrack?: boolean;
    AudioTrackClips?: ServerAudioTrackClip[];
    Type?: string;
    TrackShortenMode?: 'AutoSpeed';
    TrackExpandMode?: 'AutoSpeed';
    Disabled?: boolean;
};
export type ServerImageTrack = {
    Id?: number;
    ImageTrackClips?: ServerImageTrackClip[];
};
export type ServerSubtitleTrack = {
    Id?: number;
    SubtitleTrackClips?: ServerSubtitleTrackClip[];
};
export type ServerEffectTrack = {
    Id?: number;
    EffectTrackItems?: ServerEffectTrackItem[];
};
export type ServerOutputMediaConfig = {
    Width: number;
    Height: number;
};
export type ParsedMediaMap = {
    [key: string]: {
        mediaType: string;
        mediaId: string;
        mediaUrl?: string;
        width?: number;
        height?: number;
        duration: number;
    };
};
export type ParsedResult = {
    success: boolean;
    logs: any[];
    timeline: IServerTimeline;
    toBackendTimeline: (fTimeline?: IServerTimeline) => IServerTimeline;
    fixFields: FixFieldItem[];
    mediaMap: ParsedMediaMap;
    output: {
        width: number;
        height: number;
    };
    fontList: Array<{
        key: string;
        url: string;
    }>;
};
export interface IServerTimeline {
    Version?: number;
    SdkVersion?: string;
    AspectRatio?: string;
    FECanvas?: {
        Height: number;
        Width: number;
        OutputWidth?: number;
        OutputHeight?: number;
    };
    VideoTracks?: ServerVideoTrack[];
    AudioTracks?: ServerAudioTrack[];
    ImageTracks?: ServerImageTrack[];
    SubtitleTracks?: ServerSubtitleTrack[];
    EffectTracks?: ServerEffectTrack[];
    From: string;
}
export declare function genId(key: string): number;
export type ServerTimelineAdapterOption = {
    outputWidth: number;
    outputHeight: number;
    fixFontSize?: 'auto' | 'enable' | 'disable';
    fixRect?: 'auto' | 'enable' | 'disable';
    log?: boolean;
};
export declare function checkAndFixedFields(field: {
    Type: string;
} & {
    [key: string]: any;
}, log: (type: 'warning' | 'log' | 'error', key: string, errorType: FixFieldItem['errorType'], ...args: any[]) => void): void;
export type FixFieldItem = {
    type: string;
    errorType: 'required' | 'notSupport' | 'parseNumberFail' | 'parseArrayFail' | 'parseStringFail' | 'parseObjectFail' | 'parseBooleanFail';
    key: string;
    clip: any;
    index: number;
    clips: any[];
    trackType: string;
    trackIndex: number;
    errorArgs?: any[];
};
export type ParaseOptions = {
    autoFix?: boolean;
};
export declare class ServerTimelineAdapter {
    private _option;
    private _logs;
    private _ids;
    private _fixFieldItems;
    constructor(option: ServerTimelineAdapterOption);
    log(type: 'warning' | 'log' | 'error', ...args: any[]): void;
    get logs(): any[];
    parse(timeline: string | IServerTimeline, { autoFix }?: ParaseOptions): ParsedResult;
    fixTimeline(timeline: IServerTimeline): {
        mediaMap: ParsedMediaMap;
        fontMap: {
            [key: string]: string;
        };
    };
    checkAndFixVideoTrack(track: ServerVideoTrack, feCanvas: {
        Width: number;
        Height: number;
    }, { fixFontSize, fixRect, trackIndex }: {
        fixFontSize: boolean;
        fixRect: boolean;
        trackIndex: number;
    }): {
        mediaMap: ParsedMediaMap;
        fontMap: {
            [key: string]: string;
        };
    };
    checkAndFixAudioTrack(track: ServerAudioTrack, { trackIndex, fixFontSize, feCanvas, }: {
        trackIndex: number;
        fixFontSize: boolean;
        feCanvas: {
            Width: number;
            Height: number;
        };
    }): {
        mediaMap: ParsedMediaMap;
        fontMap: {
            [key: string]: string;
        };
    };
    rectFixed(clip: ServerVideoTrackClip | ServerImageTrackClip): void;
    fontsizeFixed(feCanvas: {
        Width: number;
        Height: number;
    }, clip: ServerVideoTrackClip & ServerSubtitleTrackClip): BaseClip & {
        Duration?: number | undefined;
        ReferenceClipId?: string | undefined;
        ClipId?: string | undefined;
        VirginDuration?: number | undefined;
        NoReferTimelineOut?: boolean | undefined;
        NoReferTimelineIn?: boolean | undefined;
    } & {
        Id?: number | undefined;
        TrackId?: number | undefined;
        MediaId?: string | undefined;
        MediaIdType?: MediaIdType | undefined;
        MediaURL?: string | undefined;
        Type: string;
        X?: number | undefined;
        Y?: number | undefined;
        Width?: number | undefined;
        Height?: number | undefined;
        AdaptMode?: string | undefined;
        In?: number | undefined;
        Out?: number | undefined;
        MaxOut?: number | undefined;
        DyncFrames?: number | undefined;
        TimelineIn?: number | undefined;
        TimelineOut?: number | undefined;
        Speed?: number | undefined;
        MaskVideoUrl?: string | undefined;
        Effects?: ServerEffectTrackItem[] | undefined;
    } & ServerSubtitleTrackClip;
    fixId(obj: {
        Id?: number;
    }, key: string): {
        Id?: number | undefined;
    };
}
export declare function fixTrackTransition(track: ServerVideoTrack): ServerVideoTrack | undefined;
export declare function fixExtraTrack<T extends ServerImageTrack | ServerSubtitleTrack | ServerEffectTrack>(obj: {
    VideoTracks?: ServerVideoTrack[];
}, extraTracks: T[]): {
    VideoTracks?: ServerVideoTrack[] | undefined;
} | undefined;
export declare function initFontList(fontList: CustomFontItem[]): Promise<void>;
export declare function getContainRect(input: {
    width: number;
    height: number;
}, output: {
    width: number;
    height: number;
}): {
    x: number;
    y: number;
    width: number;
    height: number;
};
type MediaClipType = ServerVideoTrackClip | ServerAudioTrackClip;
export declare function calculateTrackDuration(track: ServerVideoTrack | ServerAudioTrack, options: {
    itemHandle?: (item: MediaClipType) => MediaClipType;
}): {
    clipDuration: number;
    trackClips: MediaClipType[];
    trackKey: "VideoTrackClips";
};
export declare function fixTimelineInOutByDuration(targetDuration: number, track: ServerVideoTrack | ServerAudioTrack): ServerVideoTrack | ServerAudioTrack;
export type ReferClip = {
    clip: ServerAudioTrackClip | ServerVideoTrackClip;
    trackIndex: number;
    clipIndex: number;
    trackType: 'video' | 'audio';
};
export type ClipReferNode = {
    trackType: 'video' | 'audio';
    trackIndex: number;
    clipIndex: number;
    clipId: string;
    id: number;
    referClipId?: string;
    referList: ReferClip[];
};
export declare function createClipReferMap(timeline: IServerTimeline): {
    setClip: (clipId: string, data: {
        trackIndex?: number;
        clipIndex?: number;
        referClipId?: string;
        trackType?: 'video' | 'audio';
    }) => void;
    getClip: (clipId: string) => ClipReferNode | undefined;
    getClipList: () => ClipReferNode[];
    getReferClip: (clipId: string, trackType: string, trackIndex: number) => {
        success: boolean;
        error: string;
        clip?: undefined;
    } | {
        success: boolean;
        clip: ClipReferNode | undefined;
        error: string;
    };
};
export declare function findClipByIndex(timeline: IServerTimeline, trackType: string, trackIndex: number, clipIndex: number, update?: (item: ServerVideoTrackClip | ServerAudioTrackClip) => ServerVideoTrackClip | ServerAudioTrackClip): ServerAudioTrackClip | ServerVideoTrackClip | undefined;
export declare function fixMainTrack(timeline: IServerTimeline, mainTrack: ServerVideoTrack | ServerAudioTrack): number;
export declare function fixTracksByInputMedias(tracks: IServerTimeline['VideoTracks'] | IServerTimeline['AudioTracks'], mediaMap: Map<string, InputMedia>, clipReferMap: ReturnType<typeof createClipReferMap>): {
    tracks: undefined;
    mainTrack: ServerVideoTrack | ServerAudioTrack | undefined;
    maxDuration: number;
} | {
    tracks: (ServerVideoTrack | ServerAudioTrack)[];
    mainTrack: ServerVideoTrack | ServerAudioTrack | undefined;
    maxDuration: number;
};
export declare function fixTimelineInOutByClipMap(timeline: IServerTimeline, clipReferMap: ReturnType<typeof createClipReferMap>, errors: FixFieldItem[]): {
    maxDuration: number;
};
export declare function fixTimelineInOutByMaxDuration(timeline: IServerTimeline, maxDuration: number, errors: FixFieldItem[]): void;
export declare function fixTimelineInOut(timeline: IServerTimeline, inputMedias: InputMedia[]): {
    errors: FixFieldItem[];
    maxDuration: number;
};
export {};
