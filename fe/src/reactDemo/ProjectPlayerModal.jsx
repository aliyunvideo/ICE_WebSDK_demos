import {Modal} from "antd";
import { useCallback, useEffect, useState } from "react";
import createPreviewPlayer from "../PreviewPlayer"

export default function ProjectPlayerModel({open,onClose,getTimeline}){

const [player,setPlayer] = useState();

useEffect(()=>{

  return ()=>{
    player && player.destroy();
  }
},[player]);

useEffect(()=>{
   if(!player||!getTimeline) return
   player.timeline = getTimeline()
},[getTimeline,player])

const onContainerCreate = useCallback((container)=>{
  if(!container){
    if(player){
      player.destroy();
    }
    return
  }
  const newPlayer = createPreviewPlayer({
    container: container,
    controls: true,
    minWidth:'450px'
  });
  setPlayer(newPlayer);
 },[]);




  return <Modal open footer={false} onCancel={onClose}  width={500} height={300} >
       <div ref={onContainerCreate}  style={{width:'450px',height:'270px',margin:'0 auto'}} />
  </Modal>
}