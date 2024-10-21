import { get } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {useParams} from "react-router";
import { request } from "../../utils";
import { Button, ConfigProvider, message, Space } from "antd";

import TrackPanel from "./TrackPanel";
import ConfigPanel from "./ConfigPanel";

import "./index.css";
import CreateClip from "./CreateClip";

/**
 * @typedef {import('../../../types/player').default} AliyunTimelinePlayer
 */

ConfigProvider.config({
  prefixCls: "biz-ant",
  iconPrefixCls: "biz-anticon",
});

function createPlayer(container) {
  const player = new window.AliyunTimelinePlayer({
    licenseConfig: {
      rootDomain: "",
      licenseKey: "",
    },
    container,
    getMediaInfo: async (mediaId, mediaType, mediaOrigin) => {
      if (mediaType === "font") {
        params.InputURL = InputURL;
        delete params.MediaId;
      }
      if (mediaOrigin === "mediaURL") {
        params.InputURL = mediaId;
        delete params.MediaId;
      }

      const apiName =
        mediaOrigin === "public" ? "GetPublicMediaInfo" : "GetMediaInfo";
      return request(apiName, {
        // https://help.aliyun.com/document_detail/197842.html
        MediaId: mediaId,
      })
        .then((res) => {
          // 注意，这里仅作为示例，实际中建议做好错误处理，避免如 FileInfoList 为空数组时报错等异常情况
          const fileInfoList = get(res, "data.MediaInfo.FileInfoList", []);
          let mediaUrl, maskUrl;
          let sourceFile = fileInfoList.find((item) => {
            return item?.FileBasicInfo?.FileType === "source_file";
          });
          if (!sourceFile) {
            sourceFile = fileInfoList[0];
          }
          const maskFile = fileInfoList.find((item) => {
            return (
              item.FileBasicInfo &&
              item.FileBasicInfo.FileUrl &&
              item.FileBasicInfo.FileUrl.indexOf("_mask") > 0
            );
          });
          if (maskFile) {
            maskUrl = get(maskFile, "FileBasicInfo.FileUrl");
          }
          mediaUrl = get(sourceFile, "FileBasicInfo.FileUrl");
          const codec = get(sourceFile, "VideoStreamInfoList[0].CodecName");

          return {
            url: mediaUrl,
            codec,
            maskUrl,
          };
        })
        .catch((ex) => {
          // 外链地址兜底逻辑
          if (mediaOrigin === "mediaURL") {
            return mediaId;
          }
        });
    },
  });
  return player;
}

export default function App() {
  const [player, setPlayer] = useState();
  const [materialId, setMaterialId] = useState();
  const [createConfig, setCreateConfig] = useState();
  const [config, setConfig] = useState();
  const containerRef = useRef(null);
  const params = useParams();
  const {projectId} = params;

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const newPlayer = createPlayer(containerRef.current);
    setPlayer(newPlayer);

    return () => {
      newPlayer.destroy();
    };
  }, []);

  useEffect(() => {
    if (!player || materialId === undefined) {
      return;
    }
    const unWatch = player.watchClip(materialId, (vConfig) => {
      console.log("watchClip", materialId, vConfig);
      setConfig(vConfig);
    });
    return () => {
      unWatch();
    };
  }, [player, materialId]);

  const handleCloseClip = useCallback(() => {
    setCreateConfig(undefined);
  }, []);

  const handleSave = useCallback(async ()=>{
    if (!player || projectId === undefined) {
      return;
    }
    const {duration,timeline} = player.toBackendTimeline();
     await request("UpdateEditingProject", {
      ProjectId: projectId,
      Duration: duration,
      Timeline: JSON.stringify(timeline),
    }) ;
    message.success("保存成功");
  },[projectId,player]);


  return (
    <ConfigProvider prefixCls="biz-ant" iconPrefixCls="biz-anticon">
      <div>
        <div className="header">
          <Space>
            <Button onClick={handleSave} type="primary">保存</Button>
          </Space>
        </div>
        <div className="player-panel">
          <div className="player" ref={containerRef} />

          <div className="config">
            <ConfigPanel
              player={player}
              materialId={materialId}
              value={config}
            />
            {createConfig && (
              <CreateClip
                player={player}
                onClose={handleCloseClip}
                {...createConfig}
              />
            )}
          </div>
        </div>
        {player && (
          <TrackPanel
            projectId={projectId}
            player={player}
            onConfig={(mat) => {
              setMaterialId(mat.id);
            }}
            onAdd={(data) => {
              setCreateConfig(data);
            }}
          />
        )}
      </div>
    </ConfigProvider>
  );
}
