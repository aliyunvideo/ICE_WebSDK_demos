import {useCallback, useEffect, useRef, useState} from "react";
import {createRoot} from 'react-dom/client';
import {createProjectPlayer, parseTimeline,customSimpleTimeline,customFontTimeline} from "./playerUtil";
import {request} from './utils';
import {Tabs, Card, Row, Col, Timeline, Input, Button, List,Tag} from "antd";



function notifyStatus(status, data) {
   if ('notifyStatus' in window) {
      window.notifyStatus(status, data);
   } else {
     // console.log('notifyStatus', status, data);
   }
}

export function ProjectPlayer() {
   const containerRef = useRef();
   const [timeline, setTimeline] = useState();
   const [custTimeline, setCustTimeline] = useState(customSimpleTimeline());
   const [custFontTimeline, setCustFontTimeline] = useState(customFontTimeline());
   const [events, setEvents] = useState([]);
   const [event, setEvent] = useState();
   const playerRef = useRef();
   const mediaMapRef = useRef();
   const params = new URLSearchParams(window.location.search)
   const [proId, setProId] = useState(params.get('projectId'));
   const [parseLogs, setParseLogs] = useState([]);
   const [parseFonts, setParseFonts] = useState([]);
   const [outputInfo, setOutputInfo] = useState({outputWidth: 800, outputHeight: 450});


   const pushEvents = useCallback((event) => {
      if (!event || (event.type === 'render' || event.type.indexOf('loading') >= 0)) {
         return
      }
      event.createTime = (new Date()).toString();
      const newEvents = [event, ...(events)];
      setEvents(newEvents.slice(0, 100));
   }, [events])

   useEffect(() => {
      pushEvents(event);
   }, [event])


   const createPlayer = useCallback((projectId) => {
      if (!containerRef.current) {
         return;
      }
      setEvents([]);
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
      player.event$.subscribe((event) => {
         notifyStatus(event.type, JSON.stringify(event.data));
         setEvent(event);
      });
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
      playerRef.current.destroy();
   }, []);

   useEffect(() => {
      if (!timeline || !playerRef.current) {
         return
      }
      const {success, logs, timeline: timelineParsed, mediaMap, fontList} = parseTimeline(timeline, outputInfo);
      console.log('PARSED',timelineParsed,mediaMap,logs,fontList);
      mediaMapRef.current = mediaMap;
      playerRef.current.setFontList(fontList);
      setParseLogs(logs);
      setParseFonts(fontList);
      if (success) {
         playerRef.current.timeline = undefined;
         playerRef.current.timeline = timelineParsed;
      } else {
         playerRef.current.timeline = undefined;
      }

   }, [timeline, outputInfo])


   return <Row gutter={24} style={{margin: '10px'}} >
      <Col span={12} >
         <Card title={'Timeline预览工具'} >
            <div className="player-container" style={{width: '100%', height: '450px', margin: '30px auto', background: '#efefef'}} ref={containerRef} />
            <pre style={{maxHeight: 300, overflowY: 'scroll'}} >
               {timeline ? JSON.stringify(JSON.parse(timeline), undefined, 4) : ''}
            </pre>

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
                       </Tag>{item.url}
                      </List.Item>
                })}
                </List>
            }

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