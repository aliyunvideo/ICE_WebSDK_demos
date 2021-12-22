import { formatTime } from './utils'

function MediaItem (props) {
  const { item, onClick, selected } = props

  const url = item.MediaBasicInfo.CoverURL
  const title = item.FileInfoList[0].FileBasicInfo.FileName
  const duration = item.FileInfoList[0].FileBasicInfo.Duration

  const style = {
    backgroundImage: `url(${url})`
  }

  return (
    <div className={`item ${selected ? 'selected' : ''}`} onClick={onClick}>
      <div className='cover' style={style} />
      <div className='duration'>{formatTime(duration)}</div>
      <div className='title'>{title}</div>
    </div>
  )
}

export default MediaItem
