import { useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router'
import { message} from 'antd'
import SearchMediaModal from './SearchMediaModal'
import {request} from '../utils'
import ProduceVideoModal from './ProduceVideoModal'
import {createEditor} from '../common/editorUtil'


const myLocale = 'zh-CN';
function ProjectDetail() {
  const [showSearchMediaModal, setShowSearchMediaModal] = useState(false)
  const [showProduceVideoModal, setShowProduceVideoModal] = useState(false)
  const containerRef = useRef();
  const searchMediaRef = useRef({})
  const produceVideoRef = useRef({})
  const params = useParams()
  const {projectId} = params
  useEffect(() => {
    if(!containerRef.current){
      return
    }
    const {init,destroy} = createEditor({
      container:containerRef.current,
      locale:  myLocale,
      projectId,
      onSearchMedia:  ()=>{
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
      onUpdateEditingProject:  (isAuto)=>{
       !isAuto && message.success('保存成功')
      },
      onProduceEditingProjectVideo: ({coverUrl, duration = 0, aspectRatio, timeline, recommend})=>{
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
      onExportVideoClipsMerge:  (success)=>{
       if (success) {
         message.success('导出成功')
       } else {
         message.error('导出失败');
       }
      },
      onExportVideoClipsSplit: (success)=>{
       if (success) {
         message.success('导出成功')
       } else {
         message.error('导出失败');
       }
      },
      onExportFromMediaMarks: (success)=>{
       if (success) {
         message.success('导出成功')
       } else {
         message.error('导出失败');
       }
      },
    })
    init();
    return () => {
      destroy()
    }
  }, [projectId,containerRef,searchMediaRef])

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
            const mediaURL = `${ ossBucket }${ fileName }.${ format }`
            const [width, height] = resolution
            await request('SubmitMediaProducingJob', { // https://help.aliyun.com/document_detail/197853.html
              OutputMediaConfig: JSON.stringify({
                mediaURL,
                bitrate,
                width,
                height
              }),
              OutputMediaTarget: 'oss-object',
              ProjectId: projectId,
              Timeline: JSON.stringify(produceVideoRef.current.timeline)
            })
            message.success('生成视频成功')
            setShowProduceVideoModal(false)
            produceVideoRef.current.resolve()
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
