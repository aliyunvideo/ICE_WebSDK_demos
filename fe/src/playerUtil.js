import {request, pageData,transMediaList } from './utils';
import {get} from 'lodash';
import { createEditor  } from './editorUtil';

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
                "Content":'FontUrl自定义字体',
                "Alignment":"BottomCenter",
               //  "SizeRequestType":"RealDim",
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
 },null,4);
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
  },null,4);
}

export function customServerTimeline() {
    // 服务端精简Timeline，需要调用API进行转换，前端暂时不支持直接预览
   return JSON.stringify({
      "VideoTracks": [
          {
              "VideoTrackClips": [
               {
                  "Type":"Image",
                  "MediaId": "37504d00f09b71eda7baf7e7d6786301",// 需要替换成可用的媒资ID
                  "TimelineIn":0,
                  "TimelineOut": 5
              },{
                  "MediaId": "51b40fa0884571eea24de7f7c7486302"
              },{
                  "Type":"Image",
                  "MediaId": "35166290f09b71eda7baf7e7d6786301",
                  "Duration":5
              }
              ]
          }
      ]
  },null,4);
 }

export function parseTimeline(timeline,options ){
  return  window.AliyunTimelinePlayer.parseTimeline(timeline,options);
}


export function createProjectPlayer({container,controls,minWidth,beforeMediaInfo}){
   const {initConfig} = createEditor({container,projectId:''});
   const {ttsConfig,asrConfig,avatarConfig,getTimelineMaterials} = initConfig();
  const player = new window.AliyunTimelinePlayer({
    container,
    controls,
    minWidth,
    getMediaInfo:async (mediaId,  mediaType, mediaOrigin, InputURL) => {

      if(beforeMediaInfo){
        const result = await beforeMediaInfo(mediaId);
        if(result){
          return result;
        }
      }
      let params = {
         MediaId: mediaId,
         OutputType: 'cdn',
       };
       // 从媒资库动态获取字体地址的例子，使用 InputURL 查询
       if (mediaType === 'font') {
         params.InputURL = InputURL;
         delete params.MediaId;
       }
       const apiName = mediaOrigin === 'public' ? 'GetPublicMediaInfo' : 'GetMediaInfo';

       if(mediaOrigin === 'mediaURL'){
         params = {
            InputURL: mediaId,
            OutputType: 'cdn',
          };
       }
       // https://help.aliyun.com/document_detail/197842.html
      return request(apiName,params).then((res) => {
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
    },
    getTimelineMaterials,
    ttsConfig,
    asrConfig,
    avatarConfig
  });

  return player;
}
