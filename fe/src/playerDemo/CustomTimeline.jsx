import {useEffect} from 'react';
import {createProjectPlayer, parseTimeline} from "../playerUtil";


export default function CustomTimeline() {

  const containerRef = useRef();
  const playerRef = useRef();
  const mediaMapRef = useRef();
  const [custTimeline, setCustTimeline] = useState(customSimpleTimeline());
  const [timelineStr, setTimelineStr] = useState(customFontTimeline());

  useEffect(() => {

    if (!containerRef.current) {
      return null;
    }

    const createPlayer = async () => {
      playerRef.current = createProjectPlayer({
        container: containerRef.current,
        controls: true,
        beforeMediaInfo: async (mediaId) => {
          const mediaMap = mediaMapRef.current;
          if (!mediaMap) {
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

  useEffect(() => {
    if (!playerRef.current) {
      return
    }

    const timeineInfo = JSON.parse(timelineStr);
    const outputInfo = {
      outputWidth: Number(timeineInfo.FECanvas.Width),
      outputHeight: Number(timeineInfo.FECanvas.Height),
    }
    const parsedData = parseTimeline(timeineInfo, outputInfo);
    const {mediaMap, timeline} = parsedData;
    console.log('PARSED_DATA', parsedData);
    mediaMapRef.current = mediaMap;
    playerRef.current.timeline = timeline;
  }, [timelineStr])

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
        try{
          JSON.parse(custTimeline);
        }catch(ex){
         alert(`timeline 错误:${ex.message}`);
         return;
        }
        setTimelineStr(custTimeline)
      }}  >修改</Button>
    </div>
    <div className="player-container" style={{width: '100%', height: '450px', margin: '30px auto', background: '#efefef'}}
      ref={containerRef} />

  </div>
  }