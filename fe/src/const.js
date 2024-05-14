export const supportedFormats = ['mp4', 'mov','webm','m3u8' ] // ICE 支持导出的视频格式完整列表见：https://help.aliyun.com/document_detail/197846.html
export const resolutionMap = {
  '16:9': [
    { label: '640 x 360', width: 640, height: 360, bitrate: 400 },
    { label: '960 x 540', width: 960, height: 540, bitrate: 900 },
    { label: '1280 x 720', width: 1280, height: 720, bitrate: 1500 },
    { label: '1920 x 1080', width: 1920, height: 1080, bitrate: 3000 },
    { label: '2560 x 1440', width: 2560, height: 1440, bitrate: 6000 }
  ],
  '9:16': [
    { label: '360 x 640', width: 360, height: 640, bitrate: 400 },
    { label: '540 x 960', width: 540, height: 960, bitrate: 900 },
    { label: '720 x 1280', width: 720, height: 1280, bitrate: 1500 },
    { label: '1080 x 1920', width: 1080, height: 1920, bitrate: 3000 },
    { label: '1440 x 2560', width: 1440, height: 2560, bitrate: 6000 }
  ]
}

export const OSS_BUCKET_LOCAL_STORAGE_KEY = 'oss-bucket-local-storage-key'