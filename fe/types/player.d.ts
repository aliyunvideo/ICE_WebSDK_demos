import { CustomFontItem, PlayerInitConfig, IObservable } from './globalInterface';
import { EventData } from './eventManager';
import { IServerTimeline, ServerTimelineAdapter, ParsedResult } from './timelinePlayerUtil';

declare class AliyunTimelinePlayer {
  static TimelineAdapter: typeof ServerTimelineAdapter;
  static parseTimeline(
    timeline: string | IServerTimeline,
    options?: {
      outputWidth: number;
      outputHeight: number;
    },
  ): ParsedResult;
  private container?;
  private publicEventEmitter;
  private forcedAspectRatio;
  private subs;
  private fontList;
  constructor(config: PlayerInitConfig);
  snapshot(): Promise<void>;
  play(): void;
  pause(): void;
  destroy(): boolean;
  on(eventName: string, callback: Function): any;
  once(eventName: string, callback: Function): any;
  off(eventName: string): any;
  get event$(): IObservable<EventData<any>>;
  get version(): string | undefined;
  get duration(): number;
  get timeline(): any;
  set timeline(timeline: any);
  get state(): number;
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
}
declare const _default: typeof AliyunTimelinePlayer;
export default _default;
