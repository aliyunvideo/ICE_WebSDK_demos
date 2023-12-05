import {useCallback, useEffect, useReducer, useRef, useState} from "react";
import {createRoot} from 'react-dom/client';
import {createProjectPlayer, parseTimeline,customSimpleTimeline,customFontTimeline} from "./playerUtil";
import {request,requestGet} from './utils';
import {Tabs, Card, Row, Col, Timeline, Input, Button, List,Tag} from "antd";



function notifyStatus(status, data) {
   if ('notifyStatus' in window) {
      window.notifyStatus(status, data);
   } else {
     // console.log('notifyStatus', status, data);
   }
}

async function createJob(data){
      //  以下参数可复用导出视频的弹框对参数进行处理，生成合成任务请求参数
      const storageListReq = await requestGet('GetStorageList');
      // 示例这里采用临时文件路径，业务实现可以自己根据需要进行改动
      const tempFileStorageLocation = storageListReq.data.StorageInfoList.find((item) => {
        return item.EditingTempFileStorage
      });
      const {StorageLocation, Path} = tempFileStorageLocation;
      const filename = `${ Date.now() }`;
      const outputUrl = `https://${ StorageLocation }/${ Path }${ filename }_clips_merge.mp4`;
     const reqParam = {
      ProjectId: '',//填空字符串，会自动创建新项目，不为空可能覆盖当前项目timeline
      Timeline: JSON.stringify(data.timeline),
      OutputMediaTarget: 'oss-object',
      OutputMediaConfig: JSON.stringify({
        //设置业务文件名
        MediaURL: `${ outputUrl }`,
        // 使用推荐分辨率码率
        Bitrate: data.recommend.bitrate ? parseInt(data.recommend.bitrate, 10) : 1500,
        Width: data.recommend.width,
        Height: data.recommend.height,
      }),
    };
    //业务方自定义请求提交合成的API
    const res = await request('SubmitMediaProducingJob', reqParam);
    return res;
}

const eventReducer = (state,action)=>{
   if(action.type === 'clean'){

      return [];
   }
   if(action.type ==='init' && subscriptions.length >1){
      subscriptions.splice(0,subscriptions.length -1).forEach((sub)=>{
         sub.unsubscribe();
      });

      return [];
   }
   const event = action.data;
   if (!event || (event.type === 'render' || event.type.indexOf('loading') >= 0)) {
      return state;
   }
   event.createTime = (new Date()).toString();
   return [event,...state];
}


const subscriptions = [];
export function ProjectPlayer() {
   const containerRef = useRef();
   const [timeline, setTimeline] = useState();
   const [custTimeline, setCustTimeline] = useState(customSimpleTimeline());
   const [custFontTimeline, setCustFontTimeline] = useState(customFontTimeline());
   const playerRef = useRef();
   const mediaMapRef = useRef();
   const params = new URLSearchParams(window.location.search)
   const [proId, setProId] = useState(params.get('projectId'));
   const [parseLogs, setParseLogs] = useState([]);
   const [parseFonts, setParseFonts] = useState([]);
   const [outputInfo, setOutputInfo] = useState({outputWidth: 800, outputHeight: 450});
   const [events,dispatchEvent] = useReducer(eventReducer,[]);


   const createPlayer = useCallback((projectId) => {
      if (!containerRef.current) {
         return;
      }
      dispatchEvent({type:'init'});
      const player = createProjectPlayer({
         container: containerRef.current,
         controls: true,
         beforeMediaInfo: async (mediaId) => {
            if(mediaMapRef.current && mediaMapRef.current[mediaId]){
               return mediaMapRef.current[mediaId].mediaUrl;
            }

            return null;
         }
      });
      subscriptions.push(player.event$.subscribe((event) => {
         notifyStatus(event.type, JSON.stringify(event.data));
         console.log('event',event);
         dispatchEvent({type:'push',data:event});
      }));
      playerRef.current = player;
      if (projectId) {
         request('GetEditingProject', { // https://help.aliyun.com/document_detail/197837.html
            ProjectId: projectId
         }).then((res) => {
            try {
               const timeineInfo = JSON.parse(res.data.Project.Timeline);
               setOutputInfo({
                  outputWidth: Number(timeineInfo.FECanvas.Width),
                  outputHeight: Number(timeineInfo.FECanvas.Height)
               });
               setTimeline(res.data.Project.Timeline);

            } catch (ex) {

            }
         })
      }
   }, []);

   const customTimeline = useCallback((data) => {
      createPlayer();
      setTimeline(data)
   }, [createPlayer]);

   const customFont= useCallback((data) => {
      createPlayer();
      setTimeline(data)
   }, [createPlayer]);

   const reset = useCallback(() => {
      if (!(playerRef && playerRef.current)) {
         return;
      }
      setTimeline(undefined);
      dispatchEvent({type:'clean'});
      playerRef.current.timeline = undefined;
   }, []);

   useEffect(() => {
      if (!timeline || !playerRef.current) {
         return
      }
      dispatchEvent({type:'clean'});
      const {success, logs, timeline: timelineParsed, mediaMap, fontList} = parseTimeline(timeline, outputInfo);
      console.log('PARSED',timelineParsed,mediaMap,logs,fontList);
      mediaMapRef.current = mediaMap;
      playerRef.current.setFontList(fontList);
      setParseLogs(logs);
      setParseFonts(fontList);
      if (success) {
         playerRef.current.timeline = timelineParsed;
      } else {
         playerRef.current.timeline = undefined;
      }

   }, [timeline, outputInfo])


   return <Row gutter={24} style={{margin: '10px'}} >
      <Col span={12} >
         <Card title={'Timeline预览工具'} >
            <div className="player-container" style={{width: '100%', height: '450px', margin: '30px auto', background: '#efefef'}} ref={containerRef} />
            {parseLogs &&
            <List >
                {parseLogs.map((item)=>{
                  return <List.Item  title={item.type} >
                       <Tag color={item.type} >
                       {item.type}
                       </Tag>
                       {item.args.join(';')}
                      </List.Item>
                })}
            </List>
            }
            {parseFonts &&
                <List  >
                 {parseFonts.map((item)=>{
                  return <List.Item   >
                      <Tag color={'blue'} >
                        字体
                       </Tag>
                       key:{item.key}<br/>
                       url:{item.url}
                      </List.Item>
                })}
                </List>
            }
      <Button style={{margin: '10px'}} onClick={() => {
                            createJob({
                              timeline,
                              recommend:{
                                 width:outputInfo.outputWidth,
                                 height: outputInfo.outputHeight
                              }
                            });
                        }} >创建合成任务</Button>
            <Tabs
               defaultActiveKey="project"
               items={[
                  {
                     key: 'project',
                     label: '预览项目',
                     children: <div>
                        <Input onChange={(ev) => {setProId(ev.value);}} value={proId} />
                        <Button style={{margin: '10px'}} type="primary" onClick={() => {
                           createPlayer(proId);
                        }} >预览</Button>
                        <Button style={{margin: '10px'}} onClick={() => {
                           reset();
                        }} >重置</Button>
                     </div>
                  },

                  {
                     key: 'timeline',
                     label: '自定义Timeline',
                     children: <div >
                        <div>
                           <Input.TextArea
                              rows={10}
                              style={{margin: '10px auto'}}
                              value={custTimeline ? custTimeline : ''}
                              onChange={(ev) => {
                                 setCustTimeline(ev.target.value);
                              }} />
                           <Input.TextArea
                              rows={4}
                              style={{margin: '10px auto'}}
                              value={outputInfo ? JSON.stringify(outputInfo,null,4) : ''}
                              onChange={(ev) => {
                                  try{
                                    const val = JSON.parse(ev.target.value);
                                    setOutputInfo(val);
                                  }catch(ex){

                                  }
                              }} />
                           <Button style={{margin: '10px'}} type="primary" onClick={() => {
                              customTimeline(custTimeline)
                           }} >预览</Button>
                           <Button style={{margin: '10px'}} onClick={() => {
                              reset();
                           }} >重置</Button>
                        </div>
                     </div>
                  },
                  {
                     key: 'font',
                     label: '自定义字体',
                     children: <div >
                     <div>
                        <Input.TextArea
                           rows={10}
                           style={{margin: '10px auto'}}
                           value={custFontTimeline ? custFontTimeline : ''}
                           onChange={(ev) => {
                              setCustFontTimeline(ev.target.value);
                           }} />
                        <Input.TextArea
                           rows={4}
                           style={{margin: '10px auto'}}
                           value={outputInfo ? JSON.stringify(outputInfo,null,4) : ''}
                           onChange={(ev) => {
                               try{
                                 const val = JSON.parse(ev.target.value);
                                 setOutputInfo(val);
                               }catch(ex){

                               }
                           }} />
                        <Button style={{margin: '10px'}} type="primary" onClick={() => {
                           customFont(custFontTimeline)
                        }} >预览</Button>
                        <Button style={{margin: '10px'}} onClick={() => {
                           reset();
                        }} >重置</Button>

                     </div>
                  </div>
                  }
               ]}
            />
         </Card>
      </Col>
      <Col span={12} style={{maxHeight: '100vh', overflowY: 'scroll'}} >
         <Timeline
            style={{width: '100%', marginTop: '10px'}}
            items={
               (events || []).map((item) => {
                  return {

                     children: <Card title={item.type}  >
                        <div>{item.createTime}</div>
                        {JSON.stringify(item.data, undefined, 2)}
                     </Card>
                  }
               })
            } />
      </Col>
   </Row>
}
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<ProjectPlayer />);