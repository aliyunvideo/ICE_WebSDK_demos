import React, { useCallback, useEffect, useState } from "react";
import SubtitleConfig from "./SubtitleConfig";
import VideoConfig from "./VideoConfig";
import ImageConfig from "./ImageConfig";
import AudioConfig from "./AudioConfig";
import "./index.css";
import EffectConfig from "./EffectConfig";

/**
 *
 * @param {{player: AliyunTimelinePlayer}} param0
 */
export default function ConfigPanel({ player, materialId,  value,onConfigChange }) {
  const onChange = useCallback(
    (val) => {

      if ( materialId === undefined) {
        if(onConfigChange){
          onConfigChange(val);
        }
        return;
      }
      player.updateClip(materialId, (_val) => {
        return Object.assign(_val, val);
      });
      if(onConfigChange){
        onConfigChange(val);
      }
    },
    [materialId, player,onConfigChange]
  );




  return (
    <div className="config-editor">
      {value && value.Type === "Text" && (
        <SubtitleConfig
          materialId={materialId}
          config={value}
          onChange={onChange}
          stageWidth={player.stageWidth}
          stageHeight={player.stageHeight}
        />
      )}
      {value && value.Type === "Video" && (
        <VideoConfig
          materialId={materialId}
          config={value}
          onChange={onChange}
          stageWidth={player.stageWidth}
          stageHeight={player.stageHeight}
        />
      )}
      {value && value.Type === "Image" && (
        <ImageConfig
          materialId={materialId}
          config={value}
          onChange={onChange}
          stageWidth={player.stageWidth}
          stageHeight={player.stageHeight}
        />
      )}
      {value && value.Type === "Audio" && (
        <AudioConfig
          materialId={materialId}
          config={value}
          onChange={onChange}
          stageWidth={player.stageWidth}
          stageHeight={player.stageHeight}
        />
      )}

      {value && value.Type === "VFX" && (
        <EffectConfig
          materialId={materialId}
          config={value}
          onChange={onChange}
          stageWidth={player.stageWidth}
          stageHeight={player.stageHeight}
          effectType={"effect"}

        />
      )}

      {value && value.Type === "Filter" && (
        <EffectConfig
          materialId={materialId}
          config={value}
          onChange={onChange}
          stageWidth={player.stageWidth}
          stageHeight={player.stageHeight}
          effectType={"filter"}
        />
      )}

      {value && value.Type === "Transition" && (
        <EffectConfig
          materialId={materialId}
          config={value}
          onChange={onChange}
          stageWidth={player.stageWidth}
          stageHeight={player.stageHeight}
          effectType={"transition"}
        />
      )}
      {!value && <div style={{margin:'30px auto',fontSize:18,textAlign:'center'}} >未选中素材</div>}
    </div>
  );
}
