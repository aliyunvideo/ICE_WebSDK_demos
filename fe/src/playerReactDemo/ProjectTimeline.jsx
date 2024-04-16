import {useEffect, useRef} from 'react';
import {createProjectPlayer, parseTimeline} from "../playerUtil";
import {useParams} from 'react-router';
import {request} from '../utils';

export default function ProjectTimeline() {

  const containerRef = useRef();
  const params = useParams();
  const {projectId} = params;

  useEffect(() => {

    if (!containerRef.current) {
      return null;
    }

    const createPlayer = async () => {
      if (!projectId) {
        return
      }

      const res = await request('GetEditingProject', { // https://help.aliyun.com/document_detail/197837.html
        ProjectId: projectId
      }) ;
      if(!res.data.Project.Timeline){
        alert('Timeline数据为空')
        return;
      }
      const timeineInfo = JSON.parse(res.data.Project.Timeline);
      const outputInfo = {
        outputWidth: Number(timeineInfo.FECanvas.Width),
        outputHeight: Number(timeineInfo.FECanvas.Height)
      }
      const parsedData = parseTimeline(timeineInfo,outputInfo);
      const {mediaMap,timeline} = parsedData;
      console.log('PARSED_DATA',parsedData);
      const player =  createProjectPlayer({
        container: containerRef.current,
        controls: true,
        beforeMediaInfo: async (mediaId) => {
          if (mediaMap && mediaMap[mediaId]) {
            return mediaMap[mediaId].mediaUrl;
          }
          return null;
        }
      });
      player.timeline = timeline;

    }

    createPlayer();

  }, [projectId]);


  return <div className="player-container"
  style={{width: '100%', height: '450px', margin: '30px auto', background: '#efefef'}}
  ref={containerRef} >

  </div>

}