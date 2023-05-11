import {request } from './utils'
import {get} from 'lodash'

export default function createPreviewPlayer({container,controls,minWidth}){
    const player = new window.AliyunTimelinePlayer({
      container,
      controls,
      minWidth,
      getMediaInfo: (mediaId) => {
        return request('GetMediaInfo', { // https://help.aliyun.com/document_detail/197842.html
          MediaId: mediaId
        }).then((res) => {
          // 注意，这里仅作为示例，实际中建议做好错误处理，避免如 FileInfoList 为空数组时报错等异常情况
          const fileInfoList = get(res, 'data.MediaInfo.FileInfoList', []);
          let mediaUrl, maskUrl;
          let sourceFile = fileInfoList.find((item) => {
            return item?.FileBasicInfo?.FileType === 'source_file';
          })
          if (!sourceFile) {
            sourceFile = fileInfoList[0]
          }
          const maskFile = fileInfoList.find((item) => {
            return (
              item.FileBasicInfo &&
              item.FileBasicInfo.FileUrl &&
              item.FileBasicInfo.FileUrl.indexOf('_mask') > 0
            );
          });
          if (maskFile) {
            maskUrl = get(maskFile, 'FileBasicInfo.FileUrl');
          }
          mediaUrl = get(sourceFile, 'FileBasicInfo.FileUrl');
          if (!maskUrl) {
            return mediaUrl;
          }
          return {
            url: mediaUrl,
            maskUrl
          }
        })
      }
    });

    return player;
}