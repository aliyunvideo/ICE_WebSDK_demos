import {useCallback, useEffect, useRef,useState} from 'react';
import {createProjectPlayer, customServerTimeline, parseTimeline} from "../playerUtil";
import {  Button, Input} from "antd";
import {request} from '../utils';

export default function ServerTimeline() {

  const containerRef = useRef();
  const playerRef = useRef();
  const mediaMapRef = useRef();
  const [custTimeline, setCustTimeline] = useState(customServerTimeline());
  const [loading,setLoading] = useState(false);

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


    }

    createPlayer();

  }, []);

  const viewTimeline = useCallback(async ()=>{
    if(!playerRef.current||!custTimeline){
      return
    }
     setLoading(true);
      // API 创建后端Timeline Project
      const projectRes = await request('CreateEditingProject',{
        Title:'前后端Timeline转换demo',
        Timeline: custTimeline
      });

      const {ProjectId} = projectRes.data.Project;
      // 创建project后轮询project状态，转换成功后获取转换后的Timeline数据
     const getTimeline = async ()=>{
      const res = await request('GetEditingProject',{
        ProjectId: ProjectId,
        RequestSource:'WebSDK'
       });
      const backendParseData = res.data.Project;
      console.log('>>>',backendParseData);

      if(backendParseData.TimelineConvertStatus === 'Converted'||backendParseData.TimelineConvertStatus === 'ConvertFailed'){
          return backendParseData;
      } else {
         await new Promise((resolve)=>{ setTimeout(resolve,3000); });
         return await getTimeline();
      }
    }
    const backendTimelineInfo = await getTimeline();
    console.log('backendTimelineInfo>>>',backendTimelineInfo);
    if(backendTimelineInfo.TimelineConvertStatus === 'ConvertFailed'){
      alert('转换失败');
      setLoading(false);
      return;
    }
    const timelineInfo = JSON.parse(backendTimelineInfo.Timeline);
    const outputInfo = {
        outputWidth: Number(timelineInfo.FECanvas.Width),
        outputHeight: Number(timelineInfo.FECanvas.Height),
     }
   const parsedData = parseTimeline(timelineInfo, outputInfo);
      // // 解析Timeline中的字体
     const {mediaMap, timeline, fontList} = parsedData;
      console.log('PARSED_DATA', parsedData);
     mediaMapRef.current = mediaMap;
     playerRef.current.setFontList(fontList);
     playerRef.current.timeline = timeline;
     setLoading(false);
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
     <Button onClick={()=>{
      viewTimeline();
     }} disabled={loading} loading={loading} >后端Timeline转换前端预览</Button>
    </div>
    <div className="player-container" style={{width: '100%', height: '450px', margin: '30px auto', background: '#efefef'}}
      ref={containerRef} />

    </div>
}