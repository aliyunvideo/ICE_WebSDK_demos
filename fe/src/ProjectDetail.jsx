import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { message } from 'antd'
import SearchMediaModal from './SearchMediaModal'
import { request, transMediaList } from './utils'
import ProduceVideoModal from './ProduceVideoModal'

function ProjectDetail () {
  const [showSearchMediaModal, setShowSearchMediaModal] = useState(false)
  const [showProduceVideoModal, setShowProduceVideoModal] = useState(false)
  const searchMediaRef = useRef({})
  const produceVideoRef = useRef({})
  const params = useParams()
  const { projectId } = params

  useEffect(() => {
    const myLocale = 'zh-CN'

    window.AliyunVideoEditor.init({
      container: document.getElementById('container'),
      locale: myLocale,
      useDynamicSrc: true, // 媒资库默认情况下播放地址会过期，所以需要动态获取
      getDynamicSrc: (mediaId, mediaType) => {
        return request('GetMediaInfo', { // https://help.aliyun.com/document_detail/197842.html
          MediaId: mediaId
        }).then((res) => {
          // 注意，这里仅作为示例，实际中建议做好错误处理，避免如 FileInfoList 为空数组时报错等异常情况
          return res.data.MediaInfo.FileInfoList[0].FileBasicInfo.FileUrl
        })
      },
      getEditingProjectMaterials: () => {
        return request('GetEditingProjectMaterials', { // https://help.aliyun.com/document_detail/209068.html
          ProjectId: projectId
        }).then((res) => {
          const data = res.data.MediaInfos
          return transMediaList(data) // 需要做一些数据变换
        })
      },
      searchMedia: (mediaType) => { // mediaType 为用户当前所在的素材 tab，可能为 video | audio | image，您可以根据这个参数对应地展示同类型的可添加素材
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
      deleteEditingProjectMaterials: async (mediaId, mediaType) => {
        return request('DeleteEditingProjectMaterials', { // https://help.aliyun.com/document_detail/209067.html
          ProjectId: projectId,
          MaterialType: mediaType,
          MaterialIds: mediaId
        })
      },
      getStickerCategories: async () => {
        const res = await request('ListAllPublicMediaTags', { // https://help.aliyun.com/document_detail/207796.html
          BusinessType: 'sticker',
          WebSdkVersion: window.AliyunVideoEditor.version
        })

        const stickerCategories = res.data.MediaTagList.map(item => ({
          id: item.MediaTagId,
          name: myLocale === 'zh-CN' ? item.MediaTagNameChinese : item.MediaTagNameEnglish // myLocale 是您期望的语言
        }))
        return stickerCategories
      },
      getStickers: async ({ categoryId, page, size }) => {
        const params = {
          PageNo: page,
          PageSize: size,
          IncludeFileBasicInfo: true,
          MediaTagId: categoryId
        }

        const res = await request('ListPublicMediaBasicInfos', params) // https://help.aliyun.com/document_detail/207797.html

        const fileList = res.data.MediaInfos.map(item => ({
          mediaId: item.MediaId,
          src: item.FileInfoList[0].FileBasicInfo.FileUrl
        }))

        return {
          total: res.data.TotalCount,
          stickers: fileList
        }
      },
      getEditingProject: async () => {
        const res = await request('GetEditingProject', { // https://help.aliyun.com/document_detail/197837.html
          ProjectId: projectId
        })

        const timelineString = res.data.Project.Timeline

        return {
          projectId,
          timeline: timelineString ? JSON.parse(timelineString) : undefined,
          modifiedTime: res.data.Project.ModifiedTime
        }
      },
      updateEditingProject: ({ coverUrl, duration, timeline, isAuto }) => {
        return request('UpdateEditingProject', { // https://help.aliyun.com/document_detail/197835.html
          ProjectId: projectId,
          CoverURL: coverUrl,
          Duration: duration,
          Timeline: JSON.stringify(timeline)
        }).then(() => {
          // WebSDK 本身会进行自动保存，isAuto 则是告诉调用方这次保存是否自动保存，调用方可以控制只在手动保存时才展示保存成功的提示
          !isAuto && message.success('保存成功')
        })
      },
      produceEditingProjectVideo: ({ coverUrl, duration = 0, aspectRatio, timeline, recommend }) => {
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
      }
    })

    return () => {
      window.AliyunVideoEditor.destroy()
    }
  }, [projectId])

  return (
    <div>
      <div id='container' style={{ height: '100vh' }} />
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
          onSubmit={async ({ fileName, format, bitrate, resolution, ossBucket }) => { // 假设提交合成任务的界面让你获得了这些数据
            // 先根据 fileName 和 format 拼接出存储的 mediaURL
            const mediaURL = `${ossBucket}${fileName}.${format}`
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
