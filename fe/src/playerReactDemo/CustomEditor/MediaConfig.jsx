import React, { useCallback, useEffect, useState } from "react";

import { Form, Select, InputNumber, Space, Slider, Switch } from "antd";

import "./index.css";

export default function MediaConfig({
  config,
  onChange,
  stageWidth,
  stageHeight,
}) {
  const [form] = Form.useForm();
  const [volume, setVolume] = useState(1);
  useEffect(() => {
    form.setFieldsValue(config);
  }, [form, config]);

  useEffect(() => {
    if (!config.Effects) {
      setVolume(1);
      return;
    }
    const volumeEffect = config.Effects.find((eff) => {
      return eff.Type === "Volume";
    });
    if (!volumeEffect) {
      setVolume(1);
      return;
    }
    setVolume(volumeEffect.Gain || 1);
  }, [config]);

  const changeVolume = useCallback(
    (val) => {
      setVolume(val);
      let effects = config.Effects || [];
      const volumeEffect = effects.find((eff) => {
        return eff.Type === "Volume";
      });

      if (volumeEffect) {
        if (volumeEffect.Gain === val) {
          return;
        }
        volumeEffect.Gain = val;
      } else {
        effects.push({
          Type: "Volume",
          Gain: val,
        });
      }
      onChange({ Effects: [...effects] });
    },
    [config, onChange]
  );

  return (
    <Form
      form={form}
      onValuesChange={(cval, vals) => {
        onChange(cval);
      }}
    >
      <Form.Item label="媒资ID">{config.MediaId}</Form.Item>
      {config.Type !== "Audio" && (
        <Form.Item labelAlign="left" labelTextAlign="left" label={"位置"}>
          <Space>
            <Form.Item name={"X"} noStyle>
              <InputNumber
                addonBefore={<label>x</label>}
                step={1 / stageWidth}
                min={0}
                max={1}
                formatter={(val) => {
                  return Number(val * stageWidth).toFixed(0);
                }}
                parser={(val) => {
                  return Number(val) / stageWidth;
                }}
              />
            </Form.Item>
            <Form.Item name={"Y"} noStyle>
              <InputNumber
                addonBefore={<label>y</label>}
                step={1 / stageHeight}
                min={0}
                max={1}
                formatter={(val) => {
                  return Number(val * stageHeight).toFixed(0);
                }}
                parser={(val) => {
                  return Number(val) / stageHeight;
                }}
              />
            </Form.Item>
          </Space>
        </Form.Item>
      )}
      {config.Type !== "Audio" && (
        <>
          <Form.Item labelAlign="left" labelTextAlign="left" label={"大小"}>
            <Space>
              <Form.Item name={"Width"} noStyle>
                <InputNumber
                  addonBefore={<label>宽</label>}
                  step={1 / stageWidth}
                  min={0}
                  max={1}
                  formatter={(val) => {
                    return Number(val * stageWidth).toFixed(0);
                  }}
                  parser={(val) => {
                    return Number(val) / stageWidth;
                  }}
                />
              </Form.Item>
              <Form.Item name={"Height"} noStyle>
                <InputNumber
                  addonBefore={<label>高</label>}
                  step={1 / stageHeight}
                  min={0}
                  max={1}
                  formatter={(val) => {
                    return Number(val * stageHeight).toFixed(0);
                  }}
                  parser={(val) => {
                    return Number(val) / stageHeight;
                  }}
                />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item
            name={"KeepResizeRatio"}
            valuePropName="checked"
            labelAlign="left"
            labelTextAlign="left"
            label="保持缩放比例"
          >
            <Switch defaultChecked />
          </Form.Item>
        </>
      )}

      {config.Type !== "Image" && (
        <Form.Item labelAlign="left" labelTextAlign="left" label={"音量"}>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={changeVolume}
          />
        </Form.Item>
      )}
      {config.Type !== "Audio" && (
        <Form.Item
          labelAlign="left"
          labelTextAlign="left"
          label={"适配模式"}
          name={"AdaptMode"}
        >
          <Select defaultValue={"Fill"}>
            <Select.Option value="Fill">拉伸</Select.Option>
            <Select.Option value="Cover">覆盖</Select.Option>
            <Select.Option value="Contain">包含</Select.Option>
          </Select>
        </Form.Item>
      )}
    </Form>
  );
}
