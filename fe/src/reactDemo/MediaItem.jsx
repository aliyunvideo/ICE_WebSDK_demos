import { formatTime } from '../utils'

function MediaItem (props) {
  const { item, onClick, selected } = props
  const mediaType = item.MediaBasicInfo.MediaType

  let coverUrl
  let title
  let duration

  if (mediaType === 'image') {
    coverUrl = item.FileInfoList[0].FileBasicInfo.FileUrl
    title = item.FileInfoList[0].FileBasicInfo.FileName
  } else {
    coverUrl = item.MediaBasicInfo.CoverURL || 'https://img.alicdn.com/imgextra/i2/O1CN01fRTy3n1ZM1jvBOiyO_!!6000000003179-2-tps-240-136.png'
    title = item.FileInfoList[0].FileBasicInfo.FileName
    duration = item.FileInfoList[0].FileBasicInfo.Duration
  }

  const style = {
    backgroundImage: `url(${coverUrl})`
  }

  return (
    <div className={`item ${selected ? 'selected' : ''}`} onClick={onClick}>
      <div className='cover' style={style} />
      {mediaType !== 'image' && (
        <div className='duration'>{formatTime(duration)}</div>
      )}
      <div className='title'>{title}</div>
    </div>
  )
}

export default MediaItem
