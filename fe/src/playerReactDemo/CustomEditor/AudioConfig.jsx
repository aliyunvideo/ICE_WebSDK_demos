import React, {  } from "react";

import {
  Tabs,
} from "antd";
import MediaConfig from './MediaConfig';
import "./index.css";



export default function AudioConfig(props) {

  return (
    <Tabs
      items={[
        {
          label: "基本信息",
          key: "basic",
          children: <MediaConfig {...props} />,
        }
      ]}
    />
  );
}
