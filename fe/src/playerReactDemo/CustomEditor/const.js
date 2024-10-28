export const TrackTypes = {
  Effect: "特效",
  Subtitle: "字幕",
  Video: "视频",
  Audio: "音频",
};
export const MaterialTypes = {
  VFX: "特效",
  Filter: "滤镜",
  Text: "字幕",
  Image: "图片",
  Video: "视频",
  Audio: "音频",
  Transition: "转场",
};

export const TrackMaterialTypes = {
  Effect: ["VFX", "Filter"],
  Subtitle: ["Text"],
  Video: ["Video","Image","Transition"],
  Audio: ["Audio"],
};

const genId = () => {
  return Date.now() + Math.round(Math.round(1000));
};

export const MaterialTemplate = {
  VFX: (trackId, config) => {
    return Object.assign(
      {
        Id: genId(),
        TrackId: trackId,
        Type: "VFX",
        SubType: "",
        TimelineIn: 0,
        TimelineOut: 5,
        Duration: 5,
      },
      config
    );
  },
  Filter: (trackId, config) => {
    return Object.assign(
      {
        Id: genId(),
        TrackId: trackId,
        Type: "Filter",
        SubType: "",
        TimelineIn: 0,
        TimelineOut: 5,
        Duration: 5,
      },
      config
    );
  },
  Text: (trackId, config) => {
    return Object.assign(
      {
        Id: genId(),
        TrackId: trackId,
        Type: "Text",
        AdaptMode: "AutoWrap",
        BorderStyle: 1,
        Content: "实例字幕",
        Duration: 5,
        Font: "Alibaba PuHuiTi",
        FontColor: "#ffffff",
        FontColorOpacity: 1,
        FontFace: {
          Bold: true,
          Italic: true,
          Underline: true,
        },
        FontSize: 14,
        LineSpacing: 0,
        Outline: 0,
        Shadow: 0,
        Spacing: 0,
        SubtitleEffects: [],
        TextWidth: 0.8,
        TimelineIn: 0,
        TimelineOut: 5,
        X: 0.5,
        Y: 0.756,
        Angle: 0,
        Alignment: "Center",
      },
      config
    );
  },
  Image:  (trackId, config) => {
    return Object.assign(
      {
        Id: genId(),
        TrackId: trackId,
        Type: "Image",
        MediaId: "",
        TimelineIn: 0,
        TimelineOut: 5,
        Duration: 5,
        X: 0,
        Y: 0,
        Width: 1,
        Height: 1,
        AdaptMode:'Contain'
    },
      config
    );
  },
  Video:  (trackId, config) => {
    return Object.assign(
      {
        Id: genId(),
        TrackId: trackId,
        Type: "Video",
        MediaId: "",
        TimelineIn: 0,
        TimelineOut: 5,
        Duration: 5,
        X: 0,
        Y: 0,
        Width: 1,
        Height: 1,
        AdaptMode:'Contain'
    },
      config
    );
  },
  Audio: (trackId, config) => {
    return Object.assign(
      {
        Id: genId(),
        TrackId: trackId,
        Type: "Audio",
        MediaId: "",
        TimelineIn: 0,
        TimelineOut: 5,
        Duration: 5,
        X: 0,
        Y: 0
    },
      config
    );
  },
  Transition: (trackId, config) => {
    return Object.assign(
      {
        Id: genId(),
        TrackId: trackId,
        Type: "Transition",
        SubType: "",
        Duration: 1,
        From:undefined,
        To: undefined
    },
      config
    );
  },
};
