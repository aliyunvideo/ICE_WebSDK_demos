import { get } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {useParams} from "react-router";
import { request } from "../../utils";
import { Button, ConfigProvider, message, Slider, Space } from "antd";
import {
  PlayCircleFilled,
  PauseCircleFilled
} from "@ant-design/icons";
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
/**
 *
 * @param {*} container
 * @returns {AliyunTimelinePlayer}
 */
function createPlayer(container) {
  const player = new window.AliyunTimelinePlayer({
    licenseConfig: {
      rootDomain: "",
      licenseKey: "",
    },
    mode:"component",
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
  const [tracks, setTracks] = useState([]);
  const [timelineJson, setTimelineJson] = useState();
  const [duration,setDuration] = useState(0);
  const [currentTime,setCurrentTime] = useState(0);
  const [playing,setPlaying] = useState(false);
  const containerRef = useRef(null);
  const params = useParams();
  const {projectId} = params;

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const newPlayer = createPlayer(containerRef.current);
    setPlayer(newPlayer);
    newPlayer.event$.subscribe((ev)=>{
       if(ev.type === 'render'){
            setCurrentTime(newPlayer.currentTime);
       }
       if(ev.type ==='playerStateChange'){
          if(ev.data.state !== 'playing'){
             setPlaying(false);
          }
       }

    })
    return () => {
      newPlayer.destroy();
    };
  }, []);

  const [aspectRatio,setAspectRatio] = useState('16:9');

  useEffect(()=>{

     if(aspectRatio && aspectRatio.indexOf(':')>0){
      const [w,h] = aspectRatio.split(':');
      containerRef.current.style.aspectRatio =  `${Number(w).toFixed(0)}/${Number(h).toFixed(0)}`;
      const ratio = Number(w)/Number(h);
      containerRef.current.style.width = ratio>1?'100%':`auto`;
      containerRef.current.style.height = ratio<1?'100%':`auto`;
     }
  },[aspectRatio,containerRef]);

  useEffect(() => {
    if(player){
     player.watchTrack((tItems) => {
       setTracks(tItems);
       setAspectRatio(player.aspectRatio);
       setDuration(player.duration);
     });
     setAspectRatio(player.aspectRatio);
     setDuration(player.duration);
   }
  }, [player]);

  const fetchData = useCallback(async () => {
    if(!projectId){
      return;
    }
    const res = await request("GetEditingProject", {
      // https://help.aliyun.com/document_detail/197837.html
      ProjectId: projectId,
      RequestSource: "WebSDK",
    });

    if (!res.data.Project.Timeline) {
      alert("Timeline数据为空");
      return;
    }
    const timeineInfo = JSON.parse(res.data.Project.Timeline);
    setTimelineJson(timeineInfo);
  }, [projectId]);


  useEffect(() => {
    fetchData();
  }, [fetchData]);


  useEffect(() => {
    if (!timelineJson) {
      return;
    }
    player.setTimeline(timelineJson);
  }, [player, timelineJson]);

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

  const handlePlay = useCallback(()=>{
      if(!player){
        return;
      }
      if(player.state === 0){
         player.pause();
         setPlaying(false);
      } else{
         player.play();
         setPlaying(true);
      }
  },[player]);

  const handleSeek = useCallback((val)=>{
    if(!player){
      return;
    }
      setCurrentTime(val);
      player.currentTime = val;
  },[player]);


  return (
    <ConfigProvider prefixCls="biz-ant" iconPrefixCls="biz-anticon">
      <div>
        <div className="header">
          <Space>
            <Button onClick={handleSave} type="primary">保存</Button>
          </Space>
        </div>
        <div className="player-panel">
          <div  className="player">
            <div ref={containerRef} className="player-container" />
            <div className="player-control" >
              <div   className="play-btn" onClick={handlePlay} >
               {playing? <PauseCircleFilled /> : <PlayCircleFilled   />}
              </div>
             <Slider className="time" max={duration} min={0} onChange={handleSeek} step={0.001} value={currentTime} />
            </div>
          </div>
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
            tracks={tracks}
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
