
import React, {useCallback, useEffect, useState} from "react";
import {request} from "../../utils";
import {Table, Tabs, Space, Switch, InputNumber, Modal, Select, Radio, Button} from "antd";
import Icon from "./icons";
import {TrackTypes,MaterialTypes,TrackMaterialTypes} from './const';
import "./index.css";
/**
 * @typedef {import('../../../types/player').default} AliyunTimelinePlayer
 */



/**
 *
 * @param {{player: AliyunTimelinePlayer}} param0
 */
export default function TrackPanel({player, onConfig,onAdd,projectId}) {
  const [tracks, setTracks] = useState([]);
  const [timelineJson, setTimelineJson] = useState();
  const [activeTrack, setActiveTrack] = useState();


  useEffect(() => {
    player.watchTrack((tItems) => {
      setTracks(tItems);
    });
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

  const deleteMaterial = useCallback(
    (id) => {
      player.removeClip(id);
    },
    [player]
  );

  const visableTrack = useCallback(
    (id, visable) => {
      player.setTrack(id, {visible: visable});
    },
    [player]
  );

  const handleEditTrack = useCallback(
    (tabKey, action) => {
      if (action === "remove") {
        player.removeTrack(Number(tabKey));
      } else {
        const track = {
          id: Date.now() + Math.random() * 10000,
          type: "Video",
        };

        Modal.confirm({
          icon:null,
          title:"选择轨道类型",
          content: (
            <div style={{margin:'0 auto',textAlign:'center'}} >
              <Radio.Group
                optionType="button"
                defaultValue={track.type}
                onChange={(val) => {
                  track.type = val.target.value;
                }} >
                {Object.keys(TrackTypes).map(item => {
                  return <Radio value={item} key={item}>
                    <Icon name={item} /> {TrackTypes[item]}
                  </Radio>
                })}
              </Radio.Group>
            </div>
          ),
          onOk: () => {
            player.addTrack(track);
            setActiveTrack(`${ track.id }`);
          },
        });
      }
    },
    [player]
  );

  const handleAddClip = useCallback((trackId, trackType) => {
    onAdd &&  onAdd({trackId,trackType,types: TrackMaterialTypes[trackType]});
  }, [onAdd]);

  return (
    <div>
      <div style={{padding: "10px"}}>
        <Tabs
          tabPosition="left"
          type="editable-card"
          onEdit={handleEditTrack}
          activeKey={activeTrack}
          onChange={setActiveTrack}
          items={tracks.map((track, index) => {
            return {
              key: `${ track.id }`,
              label: (
                <Space>
                  <label>
                    {track.type && <Icon name={track.type.toLowerCase()} />}
                  </label>

                  <label>
                    {track.visible ? (
                      <Icon name={"visible"} />
                    ) : (
                      <Icon name={"invisible"} />
                    )}
                  </label>
                </Space>
              ),
              closable: true,
              children: (
                <div>
                  <Space style={{marginBottom: '16px'}} >
                    轨道:{track.id}
                    <Switch
                      value={track.visible}
                      checkedChildren={<><label style={{marginLeft: '8px'}} >展示</label></>}
                      unCheckedChildren={<> <label style={{marginLeft: '8px'}} >隐藏</label></>}
                      onChange={() => {
                        visableTrack(track.id, !track.visible);
                      }}
                    />
                    <Button type="primary" onClick={() => {
                      handleAddClip(track.id, track.type);
                    }} >添加</Button>
                  </Space>
                  <Table
                    dataSource={track.clips}
                    columns={[
                      {dataIndex: "id", title: "id"},
                      {dataIndex: "type", title: "类型",render:(val)=>{
                        return MaterialTypes[val]||val;
                      }},
                      {
                        dataIndex: "id",
                        title: "内容",
                        render: (id, record) => {
                          const clip = player.getClip(id);
                          if (!clip) {
                            return;
                          }
                          if (record.type === "Text") {
                            return clip.Content;
                          }
                          if (
                            record.type === "Transition" ||
                            record.type === "Filter" ||
                            record.type === "VFX"
                          ) {

                            return clip.SubType;
                          }

                          return clip.MediaId;
                        },
                      },
                      {
                        dataIndex: "timelineIn",
                        title: "入点",
                        render: (timelineIn, record) => {
                          return (
                            <InputNumber
                              value={timelineIn}
                              min={0}
                              max={record.timelineOut}
                              step={0.01}
                              onChange={(val) => {
                                player.setClipTimelineIn(record.id, val);
                              }}
                            />
                          );
                        },
                      },
                      {
                        dataIndex: "timelineOut",
                        title: "出点",
                        render: (timelineOut, record) => {
                          return (
                            <InputNumber
                              value={timelineOut}
                              min={record.timelineIn}
                              step={0.01}
                              onChange={(val) => {
                                player.setClipTimelineOut(record.id, val);
                              }}
                            />
                          );
                        },
                      },
                      {
                        dataIndex: "id",
                        title: "操作",
                        render: (id, record) => {
                          return (
                            <Space size={"middle"}>
                              <a
                                onClick={async () => {
                                  onConfig(record);
                                }}
                              >
                                编辑
                              </a>
                              <a
                                onClick={() => {
                                  deleteMaterial(id);
                                }}
                              >
                                删除
                              </a>
                            </Space>
                          );
                        },
                      },
                    ]}
                  />
                </div>
              ),
            };
          })}
        />
      </div>
    </div>
  );
}
