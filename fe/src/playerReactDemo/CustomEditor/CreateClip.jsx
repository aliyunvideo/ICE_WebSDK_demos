import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Radio, Space, Timeline } from "antd";
import ConfigPanel from "./ConfigPanel";
import { TrackTypes, MaterialTypes, TrackMaterialTypes } from "./const";
import "./index.css";
import SearchMediaModal from "../../reactDemo/SearchMediaModal";
import { MaterialTemplate } from "./const";

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
    player.addClip( value);
    onClose();
  }, [player, value,onClose]);

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
      const baseConfig = MaterialTemplate[type](trackId, {});
      if ("MediaId" in baseConfig) {
        setValue(undefined);
        setShowMediaSelect(baseConfig);
      } else {
        setValue(baseConfig);
      }
    }
  }, [type, trackId]);

  return (
    <>
      <Modal
        open
        onOk={handleAdd}
        okText="确定"
        cancelText="取消"
        onCancel={onClose}
        width={720}
        title="添加配置"
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
