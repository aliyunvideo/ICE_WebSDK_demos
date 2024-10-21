import React from "react";

import {
  EyeOutlined,
  EyeInvisibleOutlined,
  PlaySquareOutlined,
  AudioOutlined,
  FontSizeOutlined,
  StarOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
} from "@ant-design/icons";

export default function Icon({ name }) {
  const ICONS = {
    visible: <EyeOutlined />,
    invisible: <EyeInvisibleOutlined />,
    video: <PlaySquareOutlined />,
    audio: <AudioOutlined />,
    subtitle: <FontSizeOutlined />,
    effect: <StarOutlined />,
    alignLeft: <AlignLeftOutlined />,
    alignCenter: <AlignCenterOutlined />,
    alignRight: <AlignRightOutlined />,
  };
  return ICONS[name] || null;
}
