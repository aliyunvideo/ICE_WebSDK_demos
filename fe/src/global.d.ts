import Editor from '../types/index';
import Player from '../types/player';

declare global {
  interface Window {
    AliyunVideoEditor: typeof Editor;
    AliyunTimelinePlayer: typeof Player;
  }
}