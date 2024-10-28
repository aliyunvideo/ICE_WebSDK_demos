import React, { useEffect, useMemo } from "react";

import {
  Form,
  Input,
  Select,
  InputNumber,
  Tag,
  ColorPicker,
  Space,
  Button,
  Radio,
  Slider,
  Row,
  Col,
  Popover,
  Tabs,
  Checkbox,
} from "antd";

import Icon from "./icons";
import "./index.css";

/**
 * @typedef {import('../../../types/player').default} AliyunTimelinePlayer
 */

const SubtitleEffectsConfig = [
  {
    index: 0,
    title: "描边",
    type: "Outline",
    defaultParams: {
      Color: "#000000",
      Bord: 0.05,
      Opacity: 1,
    },
    keys: ["Color", "Bord", "Opacity"],
  },
  {
    index: 1,
    title: "阴影",
    type: "Shadow",
    defaultParams: {
      Color: "#000000",
      XShift: 0.05,
      YShift: 0.05,
      Bord: 0.05,
      Opacity: 1,
    },
    keys: ["Color", "Shift", "Bord", "Opacity"],
  },
  {
    index: 2,
    title: "发光",
    type: "Shadow",
    defaultParams: {
      Color: "#000000",
      XShift: 0.05,
      YShift: 0.05,
      Opacity: 1,
      Bord: 0.05,
      Blur: 0.05,
    },
    keys: ["Color", "Shift", "Opacity", "Bord", "Blur"],
  },
  {
    index: 3,
    title: "背景",
    type: "Box",
    defaultParams: {
      Color: "#000000",
      Opacity: 1,
      Bord: 0.05,
      Radius: 0.05,
    },
    keys: ["Color", "Opacity", "Bord", "Radius"],
  },
];

function SubtitleEffectCard({
  title,
  keys,
  onChange,
  onRemove,
  value,
  enable,
  fontSize,
}) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(value);
  }, [form, value]);

  return (
    <div className="subtitle-effect">
      <div className="title">
        <Checkbox
          checked={enable}
          onChange={( ) => {
            if (!enable) {
              onChange(form.getFieldsValue());
            } else {
              onRemove();
            }
          }}
        />
        <label>{title}</label>
      </div>
      {enable && (
        <Form
          form={form}
          onValuesChange={(cval, vals) => {
            if (vals.Color && typeof vals.Color === "object") {
              vals.Color = vals.Color.toHex();
            }
            // const fontSizeKeys = ['Bord','XShift','YShift','Blur'];

            // fontSizeKeys.forEach((key)=>{
            //   console.log('val',key,vals[key])
            //   if(vals[key] && typeof vals[key] === 'number'){
            //      vals[key] = vals[key] / fontSize;
            //   }
            // })
            // console.log('vals',vals)
            onChange(vals);
          }}
        >
          {keys.includes("Color") && (
            <Form.Item
              labelAlign="left"
              labelTextAlign="left"
              label={"颜色"}
              name={"Color"}
              initialValue={'#ffffff'}
            >
              <ColorPicker />
            </Form.Item>
          )}
          {keys.includes("Bord") && (
            <Form.Item
              labelAlign="left"
              labelTextAlign="left"
              label={"宽度"}
              name={"Bord"}
              initialValue={1/fontSize}
            >
              <InputNumber step={1/fontSize} min={0} max={fontSize}
              formatter={(v)=>Number(v * fontSize).toFixed(0) }
              parser={(v)=>{
                 return Number(v) / fontSize;
              }} />
            </Form.Item>
          )}
          {keys.includes("Shift") && (
            <Form.Item labelAlign="left" labelTextAlign="left" label={"偏移"}>
              <Space>
                <Form.Item noStyle name={"XShift"}  initialValue={1/fontSize}>
                  <InputNumber
                    addonBefore={"x"}
                    step={1/fontSize}
                    min={-fontSize}
                    max={fontSize}
                    formatter={(v)=>Number(v * fontSize).toFixed(0)}
                    parser={(v)=>{
                      return Number(v) / fontSize;
                   }}
                  />
                </Form.Item>
                <Form.Item noStyle name={"YShift"}  initialValue={1/fontSize}>
                  <InputNumber
                    addonBefore={"y"}
                    step={1/fontSize}
                    min={-fontSize}
                    max={fontSize}
                    formatter={(v)=>Number(v* fontSize).toFixed(0)}
                    parser={(v)=>{
                      return Number(v) / fontSize;
                   }}
                  />
                </Form.Item>
              </Space>
            </Form.Item>
          )}
          {keys.includes("Radius") && (
            <Form.Item
              labelAlign="left"
              labelTextAlign="left"
              label={"圆角"}
              name={"Radius"}
              initialValue={0}
            >
              <InputNumber step={1} min={0} max={Math.round(fontSize / 3)}
              formatter={(v)=>Number(v).toFixed(0)}
                />
            </Form.Item>
          )}
          {keys.includes("Opacity") && (
            <Form.Item
              labelAlign="left"
              labelTextAlign="left"
              label={"不透明度"}
              name={"Opacity"}
              initialValue={1}
            >
              <Slider min={0} max={1} step={0.01}  />
            </Form.Item>
          )}
          {keys.includes("Blur") && (
            <Form.Item
              labelAlign="left"
              labelTextAlign="left"
              label={"模糊"}
              name={"Blur"}
              initialValue={0}
            >
              <Slider min={0} max={1} step={1/fontSize}
               />
            </Form.Item>
          )}
        </Form>
      )}
    </div>
  );
}

export default function SubtitleConfig({
  materialId,
  config,
  onChange,
  stageWidth,
  stageHeight
}) {
  const [form] = Form.useForm();
  const fontList = useMemo(() => {
    return AliyunTimelinePlayer.getDefaultFontList();
  }, []);

  const effectColorStyles = useMemo(() => {
    return AliyunTimelinePlayer.getSubtitleEffectColorStyles();
  }, []);

  const subtitleBubbles = useMemo(() => {
    return AliyunTimelinePlayer.getSubtitleBubbles();
  }, []);

  useEffect(() => {
    console.log('config',config)
    form.setFieldsValue(config);
  }, [config]);

  const effectColorStyle = useMemo(() => {
    return config && config.EffectColorStyle;
  }, [config]);
  const bubbleStyleId = useMemo(() => {
    return config && config.BubbleStyleId;
  }, [config]);

  return (
    <Tabs
      items={[
        {
          key: "default",
          label: "基础",
          children: (
            <Form
              form={form}
              style={{ padding: "8px" }}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              onValuesChange={(cval, vals) => {
                console.log("chanange", cval, vals);
                if (cval.FontColor && typeof cval.FontColor === "object") {
                  cval.FontColor = cval.FontColor.toHex();
                }
                if(cval.FontFace){
                  cval.FontFace = Object.assign(vals.FontFace||{},cval.FontFace);
                }
                onChange(cval);
              }}
            >
              <Form.Item
                labelAlign="left"
                labelTextAlign="left"
                label={"内容"}
                name={"Content"}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item labelAlign="left" labelTextAlign="left" label={"字体"}>
                <Space>
                  <Form.Item name={"Font"} noStyle>
                    <Select style={{ width: "200px" }}>
                      {fontList.map((item) => {
                        return (
                          <Select.Option value={item.key}>
                            {item.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item name={"FontSize"} noStyle>
                    <InputNumber addonBefore={<label>大小</label>} />
                  </Form.Item>
                </Space>
              </Form.Item>
              <Form.Item labelAlign="left" labelTextAlign="left" label={"位置"}>
                <Space>
                  <Form.Item name={"X"} noStyle>
                    <InputNumber
                      addonBefore={<label>x</label>}
                      step={1/stageWidth}
                      min={0}
                      max={1}
                      formatter={(val)=>{
                        return Number(val *  stageWidth).toFixed(0)
                      }}
                      parser={(val)=>{
                        return Number(val) / stageWidth;
                      }}
                    />
                  </Form.Item>
                  <Form.Item name={"Y"} noStyle>
                    <InputNumber
                      addonBefore={<label>y</label>}
                      step={1/stageHeight}
                      min={0}
                      max={1}
                      formatter={(val)=>{
                        return Number(val *  stageHeight).toFixed(0)
                      }}
                      parser={(val)=>{
                        return Number(val) / stageHeight;
                      }}
                    />
                  </Form.Item>

                </Space>
              </Form.Item>
              <Form.Item
                labelAlign="left"
                labelTextAlign="left"
                label={"自动换行"}
              >
                <Space>
                  <Form.Item name={"AdaptMode"} noStyle>
                    <Select style={{ width: "200px" }}>
                      <Select.Option value={""}>不换行</Select.Option>
                      <Select.Option value={"AutoWrap"}>逐字换行</Select.Option>
                      <Select.Option value={"AutoWrapAtSpaces"}>
                        空格换行
                      </Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name={"TextWidth"} noStyle>
                    <InputNumber
                      addonBefore={<label>文本宽度</label>}
                      step={0.01}
                      min={0.1}
                      max={1}
                      formatter={(val) => {
                        return Number(val || 0).toFixed(2);
                      }}
                    />
                  </Form.Item>
                </Space>
              </Form.Item>
              <Form.Item labelAlign="left" labelTextAlign="left" label={"间距"}>
                <Space>
                  <Form.Item name={"Spacing"} noStyle>
                    <InputNumber
                      addonBefore={<label>字间距</label>}
                      defaultValue={0}
                    />
                  </Form.Item>
                  <Form.Item name={"LineSpacing"} noStyle>
                    <InputNumber
                      addonBefore={<label>行间距</label>}
                      defaultValue={0}
                    />
                  </Form.Item>
                </Space>
              </Form.Item>
              <Form.Item labelAlign="left" labelTextAlign="left" label={"样式"}>
                <Space>
                  <Form.Item
                    name={["FontFace", "Italic"]}
                    noStyle
                    valuePropName="checked"
                  >
                    <Tag.CheckableTag>
                      <span
                        style={{
                          fontSize: "18px",
                          fontStyle: "italic",
                          fontFamily: "monospace",
                        }}
                      >
                        I
                      </span>
                    </Tag.CheckableTag>
                  </Form.Item>
                  <Form.Item
                    name={["FontFace", "Bold"]}
                    noStyle
                    valuePropName="checked"
                  >
                    <Tag.CheckableTag>
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "bolder",
                          fontFamily: "monospace",
                        }}
                      >
                        B
                      </span>
                    </Tag.CheckableTag>
                  </Form.Item>
                  <Form.Item
                    name={["FontFace", "Underline"]}
                    noStyle
                    valuePropName="checked"
                  >
                    <Tag.CheckableTag>
                      <span
                        style={{
                          fontSize: "18px",
                          textDecoration: "underline",
                          fontFamily: "monospace",
                        }}
                      >
                        U
                      </span>
                    </Tag.CheckableTag>
                  </Form.Item>
                </Space>
              </Form.Item>
              <Form.Item
                labelAlign="left"
                labelTextAlign="left"
                label={"对齐"}
                name={"Alignment"}
              >
                <Radio.Group optionType="button">
                  <Radio
                    value="Left"
                    style={{ marginRight: "8px" }}

                  >
                    <Icon name={"alignLeft"} />
                  </Radio>
                  <Radio
                    value="Center"
                    style={{ marginRight: "8px" }}

                  >
                     <Icon name={"alignCenter"} />

                  </Radio>
                  <Radio
                    value="Right"

                  >
                             <Icon name={"alignRight"} />

                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                labelAlign="left"
                labelTextAlign="left"
                label={"字体颜色"}
                name={"FontColor"}
              >
                <ColorPicker format="hex" />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                labelTextAlign="left"
                label={"不透明度"}
                name={"FontColorOpacity"}
              >
                <Slider min={0} max={1} step={0.001} />
              </Form.Item>
            </Form>
          ),
        },
        {
          key: "extra",
          label: "扩展属性",
          children: (
            <div className="cover-container">
            {SubtitleEffectsConfig.map((_seconfig) => {
              return (
                <SubtitleEffectCard
                  key={_seconfig.index}
                  title={_seconfig.title}
                  keys={_seconfig.keys}
                  fontSize={config.FontSize || 32}
                  value={
                    config.SubtitleEffects&&
                    config.SubtitleEffects.find((item) => {
                      return item._index === _seconfig.index;
                    })
                  }
                  enable={
                    !!(
                      config.SubtitleEffects &&
                      config.SubtitleEffects.find((item) => {
                        return item._index === _seconfig.index;
                      })
                    )
                  }
                  onChange={(oValue) => {

                    let effects = config.SubtitleEffects || [];
                    let findEffect = effects.find((item) => {
                      return item._index === _seconfig.index;
                    });
                    findEffect = {
                      Type: _seconfig.type,
                      _index: _seconfig.index,
                      _enable: true,
                      ..._seconfig.defaultParams,
                      ...oValue,
                    };

                    effects = effects.filter((item) => {
                      return item._index !== _seconfig.index;
                    });
                    effects.push(findEffect);
                    effects = effects.sort((a, b) => {
                      return b._index - a._index;
                    });

                    onChange({ SubtitleEffects: effects,EffectColorStyle: undefined });
                  }}
                  onRemove={() => {
                    let effects = config.SubtitleEffects  || [];
                    effects = effects.filter((item) => {
                      return item._index !== _seconfig.index;
                    });

                    onChange({ SubtitleEffects: effects,EffectColorStyle: undefined });
                  }}
                />
              );
            })}
            </div>
          ),
        },
        {
          key: "effectStyle",
          label: "花字",
          children: (
            <div className="cover-container">
              <Row gutter={[24, 24]}>
                {effectColorStyles.map(({ key, cover }) => {
                  return (
                    <Col
                      className={`subtitle-cover`}
                      span={3}
                      onClick={() => {
                        onChange({ EffectColorStyle: key,SubtitleEffects: undefined });
                      }}
                    >
                      {
                        <img
                          style={{
                            objectPosition: "center 15px",
                          }}
                          className={effectColorStyle === key ? "active" : null}
                          src={cover}
                          key={key}
                        />
                      }
                    </Col>
                  );
                })}
              </Row>
            </div>
          ),
        },
        {
          key: "bubble",
          label: "气泡字",
          children: (
            <div className="cover-container">
              <Row gutter={[24, 24]}>
                {subtitleBubbles.map(({ key, cover }) => {
                  return (
                    <Col
                      className={`subtitle-cover`}
                      span={4}
                      onClick={() => {
                        onChange({ BubbleStyleId: key,  SubtitleEffects: undefined });
                      }}
                    >
                      {
                        <img
                          className={
                            bubbleStyleId === key ? "active" : undefined
                          }
                          src={cover}
                          key={key}
                        />
                      }
                    </Col>
                  );
                })}
              </Row>
            </div>
          ),
        },
      ]}
    ></Tabs>
  );
}
