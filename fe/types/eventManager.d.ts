export declare enum PLAYER_STATE {
  PLAYING = 0,
  PAUSED = 1,
  STALLED = 2,
  ENDED = 3,
  BROKEN = 4,
}
export interface EventFunction<P extends any[], R> {
  (...args: P): R;
}
export type UiClass = {
  el?: HTMLElement;
  key: string;
};
export type UiEventData = {
  container: UiClass;
  action: string;
  panel?: UiClass;
  component?: UiClass[];
  itemId?: string;
  itemType?: string;
  items?: Array<{
    id: string;
    type: string;
  }>;
  config?: any;
};
export type PlayerEventData = {
  currentTime: number;
  triggerTime: number;
};
export type ErrorData = {
  errorType: string;
  message: string;
};
export type Events = {
  init: {
    defaultAspectRatio: string;
    defaultSubtitle: boolean;
  };
  sdkInitBegin: {};
  sdkDestory: {};
  trackEditorResize: {
    type: 'start' | 'resizing' | 'end';
    height: number;
  };
  wasmLoad: {
    useTime: number;
  };
  click: UiEventData;
  drag: UiEventData;
  show: UiEventData;
  canplay: PlayerEventData;
  initTimeline: PlayerEventData;
  seeking: PlayerEventData & {
    action: string;
  };
  seekEnd: PlayerEventData & {
    mediaCached: boolean;
    useTime: number;
    action: string;
    effectCount: number;
    bufferCached?: boolean;
  };
  playerSeeking: PlayerEventData & {
    action: string;
  };
  playerSeeked: PlayerEventData & {
    action: string;
  };
  playerStateChange: PlayerEventData & {
    state: 'playing' | 'paused' | 'ended' | 'stalled';
  };
  play: PlayerEventData;
  playing: PlayerEventData & {
    useTime: number;
  };
  pause: PlayerEventData;
  ended: PlayerEventData;
  loading: PlayerEventData & {
    isPlaying: boolean;
  };
  loadEnd: PlayerEventData & {
    useTime: number;
    isPlaying: boolean;
  };
  frameStat: PlayerEventData & {
    playFrame: number;
    playTime: number;
    playRealTime: number;
    duration: number;
    playbackRate: number;
  };
  render: {
    time: number;
  };
  renderContextLost: {
    time: number;
  };
  renderContextRestart: {
    time: number;
  };
  algorithm: Array<{
    algType: string;
    algName: string;
    algMethod?: string;
    totalTime: number;
    count: number;
    computeType: string;
  }>;
  nodeChange: {
    types: Array<{
      name: string;
      node: string;
    }>;
  };
  jsError: ErrorData;
  playError: ErrorData;
  materialError: ErrorData;
  envError: ErrorData;
  timelineChange: {
    action: string;
    data: any;
    state: any;
  };
  aspectRatioChange: {
    aspectRatio: string;
    width: number;
    height: number;
  };
  playerScale: {
    scale: number;
  };
  previewPlayerStateChange: {
    type: 'playing' | 'paused' | 'end';
    isPlaying: boolean;
    url: string;
  };
  previewPlayerControl: {
    type: 'play' | 'pause';
  };
  saveProject: {
    autoSave: boolean;
  };
  exportProject: {
    type: string;
  };
  exportTemplate: {
    type: string;
  };
};
export type UiEventType = 'show' | 'click' | 'drag';
export type PlayerEventType =
  | 'seeking'
  | 'seekEnd'
  | 'play'
  | 'playing'
  | 'pause'
  | 'loading'
  | 'loadEnd'
  | 'frameStat'
  | 'algorithm'
  | 'render'
  | 'nodeChange';
export type ErrorEventType = 'jsError' | 'playError' | 'materialError' | 'envError';
export type EventType = keyof Events;
export type EventData<K extends EventType> = {
  type: K;
  eventType: 'init' | 'ui' | 'player' | 'error' | 'websdk' | 'timeline';
  data: Events[K];
};
export type AsyncEvent<K extends EventType, R> = EventData<K> & {
  resolve: (r: R) => void;
  reject: (e?: Error) => void;
};
export type EventGeneratorOptions<P extends any[], R, BET extends EventType, AET extends EventType> = {
  onBeforeCall?: (...args: P) => EventData<BET>;
  onAfterCall?: (result: R, ...args: P) => EventData<AET>;
};
export type EventSyncResultFunction<P extends any[], R> = {
  (...args: P): R;
};
export type EventAsyncResultFunction<P extends any[], R> = {
  (...args: P): Promise<R>;
};
export type EventResultFunction<P extends any[], R> = EventSyncResultFunction<P, R>;
