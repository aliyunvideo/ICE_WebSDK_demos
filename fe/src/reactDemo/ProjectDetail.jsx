import {useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router'
import {message} from 'antd'
import SearchMediaModal from './SearchMediaModal'
import {request} from '../utils'
import ProduceVideoModal from './ProduceVideoModal'
import {createEditor} from '../common/editorUtil'


const myLocale = 'zh-CN';
function ProjectDetail({mode}) {
  const [showSearchMediaModal, setShowSearchMediaModal] = useState(false)
  const [showProduceVideoModal, setShowProduceVideoModal] = useState(false)
  const containerRef = useRef();
  const searchMediaRef = useRef({})
  const produceVideoRef = useRef({})
  const params = useParams()
  const {projectId,templateId} = params
  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    const {init, destroy} = createEditor({
      container: containerRef.current,
      locale: myLocale,
      mode,
      projectId,
      templateId,
      message,
      onSearchMedia: () => {
        return new Promise((resolve, reject) => {
          // 调用方需要自己实现展示媒资、选择媒资添加的界面
          // 关于展示媒资，请参考：https://help.aliyun.com/document_detail/197964.html
          searchMediaRef.current = {
            resolve,
            reject
          }
          setShowSearchMediaModal(true)
        })
      },

      onProduceEditingProjectVideo: ({coverUrl, duration = 0, aspectRatio, timeline, recommend}) => {
        return new Promise((resolve, reject) => {
          produceVideoRef.current = {
            aspectRatio,
            recommend,
            timeline,
            resolve,
            reject
          }
          setShowProduceVideoModal(true)
        })
      },

    })
    init();
    return () => {
      destroy()
    }
  }, [projectId, containerRef, searchMediaRef, mode, templateId])

  return (
    <div>
      <div ref={containerRef} style={{height: '100vh'}} />
      {showSearchMediaModal && (
        <SearchMediaModal
          onSubmit={(info) => {
            setShowSearchMediaModal(false)
            searchMediaRef.current.resolve(info)
          }}
          onClose={() => {
            setShowSearchMediaModal(false)
            searchMediaRef.current.reject()
          }}
          projectId={projectId}
        />
      )}
      {showProduceVideoModal && (
        <ProduceVideoModal
          aspectRatio={produceVideoRef.current.aspectRatio}
          recommend={produceVideoRef.current.recommend}
          onSubmit={async ({fileName, format, bitrate, resolution, ossBucket}) => { // 假设提交合成任务的界面让你获得了这些数据
            // 先根据 fileName 和 format 拼接出存储的 mediaURL
            let mediaURL ;
            let OutputMediaTarget = 'oss-object';
            let  StorageLocation;
            let FileName;
            if(ossBucket.indexOf('vod://') === 0){
              OutputMediaTarget = 'vod-media';
              StorageLocation = ossBucket.replace('vod://','')
              FileName = `${ fileName }.${ format }`;
            } else{
              mediaURL  = `${ ossBucket }${ fileName }.${ format }`;
            }
            const [width, height] = resolution;
            try {
              await request('SubmitMediaProducingJob', { // https://help.aliyun.com/document_detail/197853.html
                OutputMediaConfig: JSON.stringify({
                  mediaURL,
                  bitrate,
                  width,
                  height,
                  StorageLocation,
                  FileName
                }),
                OutputMediaTarget ,
                ProjectId: projectId,
                Timeline: JSON.stringify(produceVideoRef.current.timeline)
              })
              message.success('生成视频成功')
              setShowProduceVideoModal(false)
              produceVideoRef.current.resolve();
            } catch (ex) {
              message.success('生成视频失败');
              setShowProduceVideoModal(false);
              produceVideoRef.current.resolve();
            }
          }}
          onClose={() => {
            setShowProduceVideoModal(false)
            produceVideoRef.current.reject()
          }}
        />
      )}
    </div>
  )
}

export default ProjectDetail
