import React, {useCallback, useMemo} from "react";

import {
  Tabs,
} from "antd";
import MediaConfig from './MediaConfig';
import "./index.css";
import  {CommonEffectConfig as EffectConfig} from "./EffectConfig";


export default function ImageConfig(props) {

  const {config,onChange} = props;

  const effectSubType = useMemo(()=>{
     if(config.Effects){
       const effect = config.Effects.find((ef)=>{
        return ef.Type === 'VFX'
       });
       if(effect){
        return effect.SubType;
       }
     }
  },[config]);

  const handleEffectChange = useCallback((val)=>{
    let effects = config.Effects || [];
    if(effects.length > 0){
      const effect = effects.find((ef)=>{
       return ef.Type === 'VFX'
      });
      if(effect){
         effect.SubType = val.SubType;
      }
    } else{
      effects.push({Type:'VFX',SubType:val.SubType})
    }

    onChange({Effects:[...effects]});

  },[config]);

  return (
    <Tabs
      items={[
        {
          label: "基本信息",
          key: "basic",
          children: <MediaConfig {...props} />,
        },
        {
          label: "特效",
          key: "effect",
          children: <EffectConfig subType={effectSubType} effectType={'effect'} onChange={handleEffectChange}/>,
        },
      ]}
    />
  );
}
