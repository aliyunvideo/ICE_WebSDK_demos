import {useReducer, useEffect, useRef,useState} from 'react';
import {createProjectPlayer,customSimpleTimeline, parseTimeline} from "../playerUtil";
import {Input} from "antd";


function notifyStatus(status, data) {
  if ('notifyStatus' in window) {
     window.notifyStatus(status, data);
  } else {
     console.log('notifyStatus', status, data);
  }
}

export default function CustomEventDemo() {

  const containerRef = useRef();
  const playerRef = useRef();
  const mediaMapRef = useRef();
  const [custTimeline, setCustTimeline] = useState(customSimpleTimeline());

  const [countSeeking,dispatchCountSeeeking] = useReducer((sum,curr)=>{
    return sum+curr
  },0);
  const [countSeeked,dispatchCountSeeeked] = useReducer((sum,curr)=>{
    return sum+curr
  },0);

  const [time,dispatchTime] = useReducer((sum,curr)=>{
    return  curr
  },0);

  const [state,dispatchState] = useReducer((sum,curr)=>{
    return  curr
  },'');

  useEffect(() => {

    if (!containerRef.current) {
      return null;
    }

    const createPlayer = async () => {
      playerRef.current = createProjectPlayer({
        container: containerRef.current,
        controls: true,
        beforeMediaInfo: async (mediaId) => {
          const mediaMap =  mediaMapRef.current;
          if(!mediaMap){
            return null;
          }
          if (mediaMap && mediaMap[mediaId] && mediaMap[mediaId].mediaUrl) {
            return mediaMap[mediaId].mediaUrl;
          }
          return null;
        }
      });
      playerRef.current.event$.subscribe((event) => {
        notifyStatus(event.type, JSON.stringify(event.data));
      });
      playerRef.current.on('playerSeeking',()=>{
        dispatchCountSeeeking(1);
      });
      playerRef.current.on('playerSeeked',()=>{
        dispatchCountSeeeked(1);
      });
      playerRef.current.on('render',(event)=>{
        dispatchTime(event.time);
      });
      playerRef.current.on('playerStateChange',(event)=>{
        dispatchState(event.state);
      });
    }

    createPlayer();

  }, []);

  useEffect(()=>{
    if(!playerRef.current){
      return
    }

    const timeineInfo = JSON.parse(custTimeline);
    const outputInfo = {
      outputWidth: Number(timeineInfo.FECanvas.Width),
      outputHeight: Number(timeineInfo.FECanvas.Height),
    }
    const parsedData = parseTimeline(timeineInfo, outputInfo);
    const {mediaMap, timeline} = parsedData;
    console.log('PARSED_DATA', parsedData);
    mediaMapRef.current = mediaMap;
    playerRef.current.timeline = timeline;
  },[custTimeline])

  return <div>
    <div>
      <Input.TextArea
      rows={10}
      style={{margin: '10px auto'}}
      value={custTimeline ? custTimeline : ''}
      onChange={(ev) => {
         setCustTimeline(ev.target.value);
      }}
      />
    </div>
    <div>
       seeking事件计数:{countSeeking}<br/>
       seeked事件计数:{countSeeked}<br/>
       当前时间:{time}<br/>
       播放状态:{state}<br/>
    </div>
    <div className="player-container" style={{width: '100%', height: '450px', margin: '30px auto', background: '#efefef'}}
      ref={containerRef} />

    </div>
}