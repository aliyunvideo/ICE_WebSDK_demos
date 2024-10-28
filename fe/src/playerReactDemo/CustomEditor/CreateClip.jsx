import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, message, Modal, Radio, Select, Space, Timeline } from "antd";
import ConfigPanel from "./ConfigPanel";
import { TrackTypes, MaterialTypes, TrackMaterialTypes } from "./const";
import "./index.css";
import SearchMediaModal from "../../reactDemo/SearchMediaModal";
import { MaterialTemplate } from "./const";
import Icon from "./icons";

/**
 *
 * @param {{player: AliyunTimelinePlayer}} param0
 */
export default function CreateClip({
  types,
  trackId,
  trackType,
  player,
  onClose,
}) {
  const [value, setValue] = useState();
  const [type, setType] = useState(types[0]);
  const [showAddMedia, setShowAddMedia] = useState();
  const [showMediaSelect, setShowMediaSelect] = useState();
  const [fromId, setFromId] = useState();
  const [toId, setToId] = useState();
  const handleConfigUpdate = useCallback((ev) => {
    console.log("handleConfigUpdate>>>", ev);
    setValue((old) => {
      if (!old) {
        return old;
      }
      return { ...old, ...ev };
    });
  }, []);

  const handleAdd = useCallback(() => {
    if(['VFX','Filter','Transition'].includes(value.Type)){
       if(!value.SubType){
          message.error('请选择一个效果');
          return;
       }
    }

    player.addClip(value);
    onClose();
  }, [player, value, onClose]);

  const handleMediaClose = useCallback(() => {
    setShowAddMedia(undefined);
  }, []);

  const mediaFilter = useCallback(
    (typs) => {
      console.log("mediaFilter", typs, type);
      return typs.filter((t) => {
        return type.toLowerCase() === t.value;
      });
    },
    [type]
  );

  const handleMediaSelect = useCallback(() => {
    setShowAddMedia({
      onSubmit: ([item]) => {
        console.log(">>>item", item, showMediaSelect);
        if (!item) {
          setShowAddMedia(undefined);
          setShowMediaSelect(undefined);
          return;
        }
        const config = item.video || item.image || item.audio;
        const newValue = Object.assign(
          {},
          showMediaSelect,
          {
            MediaId: item.mediaId,
          },
          config.duration
            ? {
                TimelineIn: 0,
                TimelineOut: config.duration,
                Duration: config.duration,
              }
            : {}
        );
        setValue(newValue);
        setShowAddMedia(undefined);
        setShowMediaSelect(undefined);
      },
    });
  }, [showMediaSelect]);

  useEffect(() => {
    if (MaterialTemplate[type]) {
      setShowMediaSelect(undefined);
      const baseConfig = MaterialTemplate[type](trackId, {});
      if ("MediaId" in baseConfig) {
        setValue(undefined);
        setShowMediaSelect(baseConfig);
      } else {
        setValue(baseConfig);
      }
    }
  }, [type, trackId]);

  const materialOptions = useMemo(() => {
    const clips = player.queryClips((clip, track) => {
      return clip.type !== "Transition" && track.id === trackId;
    });
    const tclips = player.queryClips((clip, track) => {
      return clip.type === "Transition" && track.id === trackId;
    });
    const hasFromTrans = [];
    const hasToTrans = [];
    tclips.forEach((tc)=>{
        const tconfig = player.getClip(tc.id);
        if(tconfig){
          if(!hasFromTrans.includes(tconfig.From)){
            hasFromTrans.push(tconfig.From);
          }
          if(!hasToTrans.includes(tconfig.To)){
            hasToTrans.push(tconfig.To);
         }
        }
    });
    if (!clips) {
      return [];
    }
    return clips.map((clip,index) => {
      return {
        value: clip.id,
        hasFrom: hasFromTrans.includes(clip.id) || index===clips.length-1,
        hasTo: hasToTrans.includes(clip.id) || index===0,
        label: (
          <div>
            <Icon name={clip.type?.toLowerCase()} />
            {clip.id}
          </div>
        ),
      };
    });
  }, [trackId, player]);

  const onTransitionMaterialChange = useCallback((type, id) => {
    if (type === "from") {
      setValue((old)=>{
        return {...old,From:id}
      });
      setFromId(id);
    }
    if (type === "to") {
      setValue((old)=>{
        return {...old,To:id}
      });
      setToId(id);
    }
  }, [trackId, player]);

  return (
    <>
      <Modal
        open
        onOk={handleAdd}
        okText="确定"
        cancelText="取消"
        onCancel={onClose}
        width={720}
        title="添加素材"
      >
        <Radio.Group
          optionType="button"
          defaultValue={types[0]}
          value={type}
          style={{ marginBottom: "16px" }}
          onChange={(ev) => {
            setType(ev.target.value);
          }}
        >
          {types.map((type) => {
            return <Radio value={type}>{MaterialTypes[type]}</Radio>;
          })}
        </Radio.Group>

        <div>
          {showMediaSelect && (
            <Button onClick={handleMediaSelect}>选择媒资导入</Button>
          )}
          {type === "Transition" && (
            <>
              <Space style={{ margin: "16px 0" }}>
                <label>转场前</label>
                <Select
                  value={fromId}
                  style={{ width: "200px" }}
                  onChange={(val) => {
                    onTransitionMaterialChange("from", val);
                  }}
                  options={materialOptions.filter((item) => {
                    return item.value !== toId && !item.hasFrom;
                  })}
                />
                <label>转场后</label>
                <Select
                  value={toId}
                  style={{ width: "200px" }}
                  onChange={(val) => {
                    onTransitionMaterialChange("to", val);
                  }}
                  options={materialOptions.filter((item) => {
                    return item.value !== fromId && !item.hasTo;
                  })}
                />
              </Space>
            </>
          )}
        </div>
        {player && (
          <ConfigPanel
            value={value}
            onConfigChange={handleConfigUpdate}
            player={player}
          ></ConfigPanel>
        )}
      </Modal>
      {showAddMedia && (
        <SearchMediaModal
          onSubmit={showAddMedia.onSubmit}
          onClose={handleMediaClose}
          optionFilter={mediaFilter}
          defaultMediaType={type ? type.toLowerCase() : "all"}
          mode={"one"}
        />
      )}
    </>
  );
}
