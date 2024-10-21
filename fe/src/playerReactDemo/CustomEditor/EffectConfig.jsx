import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Row,
  Col
} from "antd";

import "./index.css";

export  function CommonEffectConfig({
  subType,
  onChange,
  effectType
}) {

  const effectItems = useMemo(()=>{
    if(effectType === 'filter'){
       return window.AliyunTimelinePlayer.getVideoFilters();
    }
    if(effectType === 'transition'){
      return window.AliyunTimelinePlayer.getVideoTransitions();
   }
    return window.AliyunTimelinePlayer.getVideoEffects();
  },[effectType]);

  return (
    <div className="cover-container">
    <Row gutter={[24, 24]}>
      {effectItems.map(({ subType:_subType, cover }) => {
        return (
          <Col
            className={`subtitle-cover effect-cover`}
            span={4}
            onClick={() => {
              onChange({ SubType:_subType,ExtParams: undefined});
            }}
          >
            {
              <img
                className={
                  _subType === subType ? "active" : undefined
                }
                src={cover}
                key={_subType}
              />
            }
          </Col>
        );
      })}
    </Row>
  </div>
  );
}


export default function EffectConfig({
  config,
  onChange,
  effectType,

}) {

  return (
    <CommonEffectConfig subType={config?.SubType} effectType={effectType} onChange={onChange}/>
  );
}
