import { CustomFontItem } from '../constants/globalInterface';

export declare function encodeUrl(url: string): string;
export type ServerEffectTrackItem = {
  Id?: number;
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
};
export type ServerVideoTrackClip = {
  Id?: number;
  MediaId?: string;
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
  Duration?: number;
  DyncFrames?: number;
  TimelineIn?: number;
  TimelineOut?: number;
  Speed?: number;
  MaskVideoUrl?: string;
  Effects?: ServerEffectTrackItem[];
  ReferenceClipId?: string;
  ClipId?: string;
};
export type ServerImageTrackClip = {
  Id?: number;
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
export type ServerAudioTrackClip = {
  Id?: number;
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
  TimelineIn?: number;
  TimelineOut?: number;
  Speed?: number;
  LoopMode?: boolean;
  Effects?: ServerEffectTrackItem[];
  Duration?: number;
};
export type ServerSubtitleTrackClip = {
  Id?: number;
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
};
export type ServerAudioTrack = {
  Id?: number;
  MainTrack?: boolean;
  AudioTrackClips?: ServerAudioTrackClip[];
  Type?: string;
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
  toBackendTimeline: (fTimeline: IServerTimeline) => IServerTimeline;
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
  };
  VideoTracks?: ServerVideoTrack[];
  AudioTracks?: ServerAudioTrack[];
  ImageTracks?: ServerImageTrack[];
  SubtitleTracks?: ServerSubtitleTrack[];
  EffectTracks?: ServerEffectTrack[];
  From: string;
}
export type ServerTimelineAdapterOption = {
  outputWidth: number;
  outputHeight: number;
  fixFontSize?: 'auto' | 'enable' | 'disable';
  fixRect?: 'auto' | 'enable' | 'disable';
  log?: boolean;
};
export declare function checkAndFixedFields(
  field: {
    Type: string;
  } & {
    [key: string]: any;
  },
  log: (type: 'warning' | 'log' | 'error', ...args: any[]) => void,
): void;
export declare class ServerTimelineAdapter {
  private _option;
  private _logs;
  private _ids;
  constructor(option: ServerTimelineAdapterOption);
  log(type: 'warning' | 'log' | 'error', ...args: any[]): void;
  get logs(): any[];
  parse(
    timeline: string | IServerTimeline,
    {
      autoFix,
    }?: {
      autoFix: boolean;
    },
  ): ParsedResult;
  fixTimeline(timeline: IServerTimeline): {
    mediaMap: ParsedMediaMap;
    fontMap: {
      [key: string]: string;
    };
  };
  checkAndFixVideoTrack(
    track: ServerVideoTrack,
    feCanvas: {
      Width: number;
      Height: number;
    },
    {
      fixFontSize,
      fixRect,
    }: {
      fixFontSize: boolean;
      fixRect: boolean;
    },
  ): {
    mediaMap: ParsedMediaMap;
    fontMap: {
      [key: string]: string;
    };
  };
  checkAndFixAudioTrack(track: ServerAudioTrack): {
    mediaMap: ParsedMediaMap;
    fontMap: {
      [key: string]: string;
    };
  };
  rectFixed(clip: ServerVideoTrackClip | ServerImageTrackClip): void;
  fontsizeFixed(
    feCanvas: {
      Width: number;
      Height: number;
    },
    clip: ServerVideoTrackClip & ServerSubtitleTrackClip,
  ): ServerVideoTrackClip & ServerSubtitleTrackClip;
  fixId(
    obj: {
      Id?: number;
    },
    key: string,
  ): {
    Id?: number | undefined;
  };
}
export declare function fixTrackTransition(track: ServerVideoTrack): ServerVideoTrack | undefined;
export declare function fixExtraTrack<T extends ServerImageTrack | ServerSubtitleTrack | ServerEffectTrack>(
  obj: {
    VideoTracks?: ServerVideoTrack[];
  },
  extraTracks: T[],
):
  | {
      VideoTracks?: ServerVideoTrack[] | undefined;
    }
  | undefined;
export declare function initFontList(fontList: CustomFontItem[]): Promise<void>;
export declare function getContainRect(
  input: {
    width: number;
    height: number;
  },
  output: {
    width: number;
    height: number;
  },
): {
  x: number;
  y: number;
  width: number;
  height: number;
};
