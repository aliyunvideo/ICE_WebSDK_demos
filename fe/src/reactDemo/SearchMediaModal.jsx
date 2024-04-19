import { useEffect, useState } from 'react'
import { Modal, Pagination, Radio } from 'antd'
import { request, transMediaList } from '../utils'
import MediaItem from './MediaItem'

const options = [
  { label: '全部', value: 'all' },
  { label: '视频', value: 'video' },
  { label: '音频', value: 'audio' },
  { label: '图片', value: 'image' },
]

const PAGE_SIZE = 20

function SearchMediaModal (props) {
  const { onSubmit, onClose } = props
  const [selectedMedia, setSelectedMedia] = useState([])
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [mediaType, setMediaType] = useState(options[0].value)
  const [status, setStatus] = useState('loading')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [media, setMedia] = useState([])

  useEffect(() => {
    setStatus('loading')
    request('ListMediaBasicInfos', { // https://help.aliyun.com/document_detail/197964.html
      PageSize: PAGE_SIZE,
      PageNo: page,
      MediaType: mediaType, // 可填写 all, video, audio, image
      IncludeFileBasicInfo: true,
      Status: 'Normal'
    }).then(res => {
      setStatus('done')
      setMedia(res.data.MediaInfos)
      setTotal(res.data.TotalCount)
    }).catch(() => {
      setStatus('error')
      setTotal(0)
    })
  }, [mediaType, page])

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
    // const res = await request('AddEditingProjectMaterials', { // https://help.aliyun.com/document_detail/209069.html
    //   ProjectId: projectId,
    //   MaterialMaps: JSON.stringify(valueObj)
    // })
    setConfirmLoading(false)
    onSubmit(transMediaList(selectedMedia))
  }

  const handleMediaTypeChange = (e) => {
    setMediaType(e.target.value)
    setPage(1)
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
      open
      title='选择媒资导入'
      onOk={handleSubmit}
      onCancel={onClose}
      width={720}
      okButtonProps={{ disabled: selectedMedia.length === 0 }}
      okText='导入'
      cancelText='取消'
      confirmLoading={confirmLoading}
    >
      <Radio.Group
        style={{ marginBottom: '20px' }}
        options={options}
        onChange={handleMediaTypeChange}
        value={mediaType}
        optionType="button"
        buttonStyle="solid"
      />
      {status === 'done' && (
        media.length
          ? (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
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
            <div style={{ height: '615px', textAlign: 'center' }}>暂无数据</div>
            )
      )}
      {status === 'loading' && (
        <div style={{ height: '615px', textAlign: 'center' }}>加载中...</div>
      )}
      {status === 'error' && (
        <div style={{ color: 'red', height: '615px', textAlign: 'center' }}>加载出错</div>
      )}
      <Pagination
        style={{ textAlign: 'center' }}
        defaultPageSize={PAGE_SIZE}
        current={page}
        total={total}
        showSizeChanger={false}
        onChange={(p) => setPage(p)}
      />
    </Modal>
  )
}

export default SearchMediaModal
