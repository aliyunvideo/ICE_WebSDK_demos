import ProjectTimeline from './ProjectTimeline';
import ServerTimeline from './ServerTimeline';
import CustomTimeline from './CustomTimeline';
import CustomFont  from './CustomFontTimeline';
import {Button, Input} from 'antd';
import EventDemo from './EventDemo';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import ProjectTimelineCode from './ProjectTimeline?raw';
import ServerTimelineCode from './ServerTimeline?raw';
import CustomTimelineCode from './CustomTimeline?raw';
import CustomFontCode  from './CustomFontTimeline?raw';
import EventDemoCode  from './EventDemo?raw';
import {useEffect, useRef} from 'react';
import 'highlight.js/styles/github.css';

hljs.registerLanguage('javascript', javascript);


function ProjectTimelineCard({path, code}) {
  const elref = useRef();

  useEffect(() => {
    if (!elref.current) {
      return;
    }
    hljs.highlightElement(elref.current);
  }, [])

  return <div>
    <div>projectId: <Input type='text' id="projectId" style={{width: '200px', margin: 10}} /> <Button type='primary' style={{margin: 10}} onClick={() => {
      const projectId = document.getElementById('projectId').value;
      if (!projectId) {
        alert('projectId不能为空');
        return;
      }
      window.open(`/player.html#${ path.replace(':projectId', projectId) }`)
    }} >打开demo</Button></div>

    <h2>示例代码：</h2>
    <div style={{border: '1px dashed #ccc', padding: '10px'}}>
      <code ref={elref} style={{whiteSpace: 'pre'}} >{code}</code>
    </div>
  </div>
}

function CommonCodeCard({path, code}) {
  const elref = useRef();

  useEffect(() => {
    if (!elref.current) {
      return;
    }
    hljs.highlightElement(elref.current);
  }, [])
  return <div>
    <div>
    <Button type='primary' style={{margin: 10}} onClick={() => {
      window.open(`/player-react.html#${ path }`)
    }} >打开demo</Button>
    </div>
    <h2>示例代码：</h2>
    <div style={{border: '1px dashed #ccc', padding: '10px'}}>
      <code ref={elref} style={{whiteSpace: 'pre'}} >{code}</code>
    </div>
  </div>
}


export const ROUTERS = [{
  title: '项目Timeline预览',
  path: '/projectTimeline/:projectId',
  element: <ProjectTimeline />,
  card: (params) => <ProjectTimelineCard {...params} code={ProjectTimelineCode} />
}, {
  title: '后端Timeline转换',
  path: '/serverTimeline',
  element: <ServerTimeline />,
  card: (params) => <CommonCodeCard {...params} code={ServerTimelineCode} />
}, {
  title: '自定义Timeline预览',
  path: '/customTimeline',
  element: <CustomTimeline />,
  card: (params) => <CommonCodeCard {...params} code={CustomTimelineCode} />
}, {
  title: '自定义字体预览',
  path: '/customFont',
  element: <CustomFont />,
  card: (params) => <CommonCodeCard {...params} code={CustomFontCode} />

}, {
  title: '自定义事件demo',
  path: '/eventDemo',
  element: <EventDemo />,
  card: (params) => <CommonCodeCard {...params} code={EventDemoCode} />
}];