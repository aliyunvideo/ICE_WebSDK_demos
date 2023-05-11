import {useEffect, useRef, useState} from "react"
import createPreviewPlayer from "./PreviewPlayer"
import {useParams} from 'react-router'
import {request} from './utils'

export default function ProjectPlayer(){
   const containerRef = useRef();
   const [timeline,setTimeline] = useState();
   const playerRef = useRef();
   const params = useParams()
   const {projectId} = params

   useEffect(()=>{
      if(!containerRef.current){
         return;
      }
     const player = createPreviewPlayer({
        container: containerRef.current,
        controls: true
      });
      playerRef.current = player;
      request('GetEditingProject', { // https://help.aliyun.com/document_detail/197837.html
        ProjectId: projectId
      }).then((res)=>{
         const timelineData = JSON.parse(res.data.Project.Timeline);
         setTimeline(timelineData);
      })
      return ()=>{
         player.destroy();
      }
   },[projectId]);

   useEffect(()=>{
     if(!timeline||!playerRef.current){
      return
     }
     playerRef.current.timeline = timeline;
   },[timeline])


    return <div >
       <div className="player-container" style={{width:'800px',height:'450px',margin:'30px auto'}} ref={containerRef} />
    </div>
}