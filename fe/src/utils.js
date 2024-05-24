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
  return axios.post('/openApiPost', {
    ...params,
    Action: action
  })
}

export function requestGet(action, params){
  return axios.get('/openApi', {
    params:{
        ...params,
      Action: action
    },

  })
}

export function formatTime (s) {
  const minutes = Math.floor(s / 60)
  const seconds = s - minutes * 60
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${Math.floor(seconds)}`
}


// 轮询
export async function poll(fn, fnCondition, ms, timeout = 1000 * 60 * 30) {
  const startTime = Date.now();
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
  let result = await fn();
  while (fnCondition(result)) {
    const currentTime = Date.now();
    if (currentTime - startTime > timeout - ms) {
      return {
        timeout: true,
        result,
      };
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
    // eslint-disable-next-line no-await-in-loop
    result = await fn();
  }
  return {
    timeout: false,
    result,
  };
}


export function pageData(items, pageSize) {
  const total = items.length;
  const pageCount = Math.ceil(total / pageSize);
  return {
    total,
    pageSize,
    pageCount,
    getData: (page) => {
      if (page > pageCount) {
        page = pageCount;
      }
      if (page < 1) {
        page = 1;
      }
      const pageNo = page - 1;
      const startIndex = pageNo * pageSize;
      let endIndex = startIndex + pageSize;
      if (endIndex > total) {
        endIndex = total;
      }
      const data = items.slice(startIndex, endIndex);
      return data;
    },
  };
}