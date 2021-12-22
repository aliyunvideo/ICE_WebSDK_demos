import { useEffect, useState } from 'react'
import { Modal } from 'antd'
import { request, transMediaList } from './utils'
import MediaItem from './MediaItem'

function SearchMediaModal (props) {
  const { onSubmit, onClose, projectId } = props
  const [selectedMedia, setSelectedMedia] = useState([])
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [media, setMedia] = useState([])

  useEffect(() => {
    request('ListMediaBasicInfos', { // https://help.aliyun.com/document_detail/197964.html
      PageSize: 20,
      PageNo: 1,
      MediaType: 'video', // 可填写 all, video, audio, image
      IncludeFileBasicInfo: true,
      Status: 'Normal'
    }).then(res => {
      setMedia(res.data.MediaInfos)
    })
  }, [])

  const handleSubmit = async () => {
    setConfirmLoading(true)
    // 组装数据
    const valueObj = {}
    selectedMedia.forEach((item) => {
      const mediaType = item.MediaBasicInfo.MediaType
      const mediaId = item.MediaId
      if (!valueObj[mediaType]) {
        valueObj[mediaType] = mediaId
      } else {
        valueObj[mediaType] += `,${mediaId}`
      }
    })
    const res = await request('AddEditingProjectMaterials', { // https://help.aliyun.com/document_detail/209069.html
      ProjectId: projectId,
      MaterialMaps: JSON.stringify(valueObj)
    })
    setConfirmLoading(false)
    onSubmit(transMediaList(res.data.MediaInfos))
  }

  const handleClick = (item) => {
    const index = selectedMedia.findIndex(m => m.MediaId === item.MediaId)
    if (index > -1) {
      setSelectedMedia(
        selectedMedia.filter((_, i) => i !== index)
      )
    } else {
      setSelectedMedia([...selectedMedia, item])
    }
  }

  const selectedMediaIds = selectedMedia.map(m => m.MediaId)

  return (
    <Modal
      visible
      title='选择媒资导入'
      onOk={handleSubmit}
      onCancel={onClose}
      width={720}
      okButtonProps={{ disabled: selectedMedia.length === 0 }}
      bodyStyle={{ height: '700px' }}
      okText='导入'
      cancelText='取消'
      confirmLoading={confirmLoading}
    >
      {media.length
        ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
            {media.map(item => (
              <MediaItem
                onClick={() => handleClick(item)}
                selected={selectedMediaIds.indexOf(item.MediaId) > -1}
                key={item.MediaId}
                item={item}
              />
            ))}
          </div>
          )
        : (
          <div style={{ height: '100%', textAlign: 'center' }}>加载中...</div>
          )}
    </Modal>
  )
}

export default SearchMediaModal
