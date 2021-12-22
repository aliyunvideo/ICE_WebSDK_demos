import axios from 'axios'

/**
 * 将服务端的素材信息转换成 WebSDK 需要的格式
 */
export function transMediaList (data) {
  if (!data) return []

  if (Array.isArray(data)) {
    return data.map((item) => {
      const basicInfo = item.MediaBasicInfo
      const fileBasicInfo = item.FileInfoList[0].FileBasicInfo
      const mediaId = basicInfo.MediaId
      const result = {
        mediaId
      }
      const mediaType = basicInfo.MediaType
      result.mediaType = mediaType

      if (mediaType === 'video') {
        result.video = {
          title: fileBasicInfo.FileName,
          duration: Number(fileBasicInfo.Duration),
          // 源视频的宽高、码率等数据，用于推荐合成数据，不传入或是0时无推荐数据
          width: Number(fileBasicInfo.Width) || 0,
          height: Number(fileBasicInfo.Height) || 0,
          bitrate: Number(fileBasicInfo.Bitrate) || 0,
          coverUrl: basicInfo.CoverURL
        }
        const spriteImages = basicInfo.SpriteImages
        if (spriteImages) {
          try {
            const spriteArr = JSON.parse(spriteImages)
            const sprite = spriteArr[0]
            const config = JSON.parse(sprite.Config)
            result.video.spriteConfig = {
              num: config.Num,
              lines: config.SpriteSnapshotConfig?.Lines,
              cols: config.SpriteSnapshotConfig?.Columns,
              cellWidth: config.SpriteSnapshotConfig?.CellWidth,
              cellHeight: config.SpriteSnapshotConfig?.CellHeight
            }
            result.video.sprites = sprite.SnapshotUrlList
          } catch (e) {
            console.log(e)
          }
        }
      } else if (mediaType === 'audio') {
        result.audio = {
          title: fileBasicInfo.FileName,
          duration: Number(fileBasicInfo.Duration),
          coverURL: '' // 您可以给音频文件一个默认的封面图
        }
      } else if (mediaType === 'image') {
        result.image = {
          title: fileBasicInfo.FileName,
          coverUrl: fileBasicInfo.FileUrl,
          // 图片的宽高等数据，用于推荐合成数据，不传入或是0时无推荐数据
          width: Number(fileBasicInfo.Width) || 0,
          height: Number(fileBasicInfo.Height) || 0
        }
      }

      return result
    })
  } else {
    return [data]
  }
}

export function request (action, params) {
  return axios.post('http://localhost:7001/openApiPost', {
    ...params,
    Action: action
  })
}

export function formatTime (s) {
  const minutes = Math.floor(s / 60)
  const seconds = s - minutes * 60
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${Math.floor(seconds)}`
}
