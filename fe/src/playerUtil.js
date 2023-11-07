import {request } from './utils';
import {get} from 'lodash';

export function customFontTimeline() {
  return JSON.stringify({
    "Version": 1,
    "SdkVersion": "4.12.0",
    "VideoTracks": [
       {
          "Id": 1,
          "Type": "Image",
          "Visible": true,
          "Disabled": false,
          "Count": 1,
          "VideoTrackClips": [
             {
                "Id": 3,
                "TrackId": 1,
                "Type": "Image",
                "MediaURL": "https://img.alicdn.com/imgextra/i4/O1CN01TDN7Gw1SCgVv61T4s_!!6000000002211-0-tps-1920-1046.jpg",
                "Title": "test.png",
                "X": 0,
                "Y": 0,
                "Width": 1,
                "Height": 1,
                "TimelineIn": 0,
                "TimelineOut": 5,
                "Duration": 5,
                "VirginDuration": 5
             }
          ]
       }
    ],
    "AudioTracks": [],
    "SubtitleTracks":[
       {
          "Id": 2,
          "Type": "Text",
          "Visible": true,
          "Disabled": false,
          "Count": 1,
          "SubtitleTrackClips": [
             {
                "Id": 1,
                "TrackId": 2,
                "Type": "Text",
                "X": 0,
                "Y": 0,
                "TimelineIn": 0,
                "TimelineOut": 2,
                "Duration": 2,
                "VirginDuration": 2,
                "FontSize":30,
                "FontColor":"#333333",
                "FontColorOpacity":1,
                "Content":'测试字幕',
                "Alignment":"BottomCenter",
                "FontUrl":"https://ice-pub-media.myalicdn.com/mts-fonts/%E7%AB%99%E9%85%B7%E6%96%87%E8%89%BA%E4%BD%93.ttf"
             }
          ]
       }
    ],
    "AspectRatio": "16:9",
    "From": "websdk",
    "FECanvas": {
       "Width": 800,
       "Height": 450
    },
    "FEConfig": {
       "AutoProportion": "681:383"
    }
 });
}

export function customSimpleTimeline() {
  return JSON.stringify({
     "Version": 1,
     "SdkVersion": "4.12.0",
     "VideoTracks": [
        {
           "Id": 1,
           "Type": "Image",
           "Visible": true,
           "Disabled": false,
           "Count": 1,
           "VideoTrackClips": [
              {
                 "Id": 3,
                 "TrackId": 1,
                 "Type": "Image",
                 "MediaURL": "https://img.alicdn.com/imgextra/i4/O1CN01TDN7Gw1SCgVv61T4s_!!6000000002211-0-tps-1920-1046.jpg",
                 "Title": "test.png",
                 "X": 0,
                 "Y": 0,
                 "Width": 1,
                 "Height": 1,
                 "TimelineIn": 0,
                 "TimelineOut": 5,
                 "Duration": 5,
                 "VirginDuration": 5
              }
           ]
        }
     ],
     "AudioTracks": [],
     "SubtitleTracks":[
        {
           "Id": 2,
           "Type": "Text",
           "Visible": true,
           "Disabled": false,
           "Count": 1,
           "SubtitleTrackClips": [
              {
                 "Id": 1,
                 "TrackId": 2,
                 "Type": "Text",
                 "X": 0,
                 "Y": 0,
                 "TimelineIn": 0,
                 "TimelineOut": 2,
                 "Duration": 2,
                 "VirginDuration": 2,
                 "FontSize":30,
                 "FontColor":"#ffffff",
                 "FontColorOpacity":1,
                 "Content":'测试字幕',
                 "Alignment":"BottomCenter"
              }
           ]
        }
     ],
     "AspectRatio": "16:9",
     "From": "websdk",
     "FECanvas": {
        "Width": 800,
        "Height": 450
     },
     "FEConfig": {
        "AutoProportion": "681:383"
     }
  });
}

export function parseTimeline(timeline,options ){
  return  window.AliyunTimelinePlayer.parseTimeline(timeline,options);
}


export   function createProjectPlayer({container,controls,minWidth,beforeMediaInfo}){
  const player = new window.AliyunTimelinePlayer({
    container,
    controls,
    minWidth,
    getMediaInfo:async (mediaId) => {
      if(beforeMediaInfo){
        const result = await beforeMediaInfo(mediaId);
        if(result){
          return result;
        }
      }
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