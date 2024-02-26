import {useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router'
import { message} from 'antd'
import {get,lowerFirst} from 'lodash'
import SearchMediaModal from './SearchMediaModal'
import {request, requestGet, transMediaList, poll} from './utils'
import ProduceVideoModal from './ProduceVideoModal'


const FONT_FAMILIES = [
  'alibaba-sans', // 阿里巴巴普惠体
  'fangsong', // 仿宋字体
  'kaiti', // 楷体
  'SimSun', // 宋体
  'siyuan-heiti', // 思源黑体
  'siyuan-songti', // 思源宋体
  'wqy-zenhei-mono', // 文泉驿等宽正黑
  'wqy-zenhei-sharp', // 文泉驿点阵正黑
  'wqy-microhei', // 文泉驿微米黑
  'zcool-gaoduanhei', // 站酷高端黑体
  'zcool-kuaile', // 站酷快乐体
  'zcool-wenyiti', // 站酷文艺体
];

export const transVoiceGroups = (data = []) => {
  return data.map(({ Type: type, VoiceList = [] }) => {
    return {
      type,
      voiceList: VoiceList.map((item) => {
        const obj = {};
        Object.keys(item).forEach((key) => {
          obj[lowerFirst(key)] = item[key];
        });
        return obj;
      }),
    };
  });
};

function ProjectDetail() {
  const [showSearchMediaModal, setShowSearchMediaModal] = useState(false)
  const [showProduceVideoModal, setShowProduceVideoModal] = useState(false)

  const [customVoiceGroups,setCustomVoiceGroups] = useState();
  const searchMediaRef = useRef({})
  const produceVideoRef = useRef({})
  const params = useParams()
  const {projectId} = params

  useEffect(()=>{
      requestGet('ListSmartVoiceGroups').then((res)=>{
         const commonItems = transVoiceGroups(get(res, 'data.VoiceGroups', []));
         const customItems = [
          {
            type: '基础',
            category: '专属人声',
            emptyContent: {
              description: '暂无人声 可通过',
              link: '',
              linkText: '创建专属人声',
            },
            getVoiceList: async (page, pageSize) => {
              const custRes = await requestGet('ListCustomizedVoices',{ PageNo: page, PageSize: pageSize });
              const items = get(custRes, 'data.Data.CustomizedVoiceList');
              const total = get(custRes, 'data.Data.Total');
              const kv = {
                story: '故事',
                interaction: '交互',
                navigation: '导航',
              };
              return {
                items: items.map((it) => {
                  return {
                    desc: it.VoiceDesc || kv[it.Scenario] || it.Scenario,
                    voiceType: it.Gender === 'male' ? 'Male' : 'Female',
                    voiceUrl: it.VoiceUrl || '',
                    tag: it.VoiceDesc || it.Scenario,
                    voice: it.VoiceId,
                    name: it.VoiceName || it.VoiceId,
                    remark: it.Scenario,
                    demoMediaId: it.DemoAudioMediaId,
                    custom: true,
                  };
                }),
                total,
              };
            },
            getVoice: async (voiceId) => {
              const custRes = await requestGet('GetCustomizedVoice',{ VoiceId: voiceId });
              const item = get(custRes, 'data.Data.CustomizedVoice');
              const kv = {
                story: '故事',
                interaction: '交互',
                navigation: '导航',
              };

              return {
                desc: item.VoiceDesc || kv[item.Scenario] || item.Scenario,
                voiceType: item.Gender === 'male' ? 'Male' : 'Female',
                voiceUrl: item.VoiceUrl || '',
                tag: item.VoiceDesc || item.Scenario,
                voice: item.VoiceId,
                name: item.VoiceName || item.VoiceId,
                remark: item.Scenario,
                demoMediaId: item.DemoAudioMediaId,
                custom: true,
              };
            },
            getDemo: async (mediaId) => {
              const mediaInfo = await requestGet('GetMediaInfo',{ MediaId: mediaId });
              const src = get(mediaInfo, 'data.MediaInfo.FileInfoList[0].FileBasicInfo.FileUrl');
              return {
                src: src,
              };
            },
          },
          {
            type: '大众',
            category: '专属人声',
            emptyContent: {
              description: '暂无人声 可通过',
              link: '',
              linkText: '创建专属人声',
            },
            getVoiceList: async (page, pageSize) => {
              const custRes = await requestGet('ListCustomizedVoices',{ PageNo: page, PageSize: pageSize, Type: 'Standard', });
              const items = get(custRes, 'data.Data.CustomizedVoiceList');
              const total = get(custRes, 'data.Data.Total');

              return {
                items: items.map((it) => {
                  return {
                    desc: it.VoiceDesc,
                    voiceType: it.Gender === 'male' ? 'Male' : 'Female',
                    voiceUrl: it.VoiceUrl || '',
                    tag: it.VoiceDesc,
                    voice: it.VoiceId,
                    name: it.VoiceName || it.VoiceId,
                    remark: it.Scenario,
                    demoMediaId: it.DemoAudioMediaId,
                    custom: true,
                  };
                }),
                total,
              };
            },
            getVoice: async (voiceId) => {
              const custRes = await requestGet('GetCustomizedVoice',{ VoiceId: voiceId });
              const item = get(custRes, 'data.Data.CustomizedVoice');
              const kv = {
                story: '故事',
                interaction: '交互',
                navigation: '导航',
              };

              return {
                desc: item.VoiceDesc || kv[item.Scenario] || item.Scenario,
                voiceType: item.Gender === 'male' ? 'Male' : 'Female',
                voiceUrl: item.VoiceUrl || '',
                tag: item.VoiceDesc || item.Scenario,
                voice: item.VoiceId,
                name: item.VoiceName || item.VoiceId,
                remark: item.Scenario,
                demoMediaId: item.DemoAudioMediaId,
                custom: true,
              };
            },
            getDemo: async (mediaId) => {
              const mediaInfo = await requestGet('GetMediaInfo',{ MediaId: mediaId });
              const src = get(mediaInfo, 'data.MediaInfo.FileInfoList[0].FileBasicInfo.FileUrl');
              return {
                src: src,
              };
            },
          },
        ].concat(commonItems);
         setCustomVoiceGroups(customItems);
      })
  },[])

  useEffect(() => {
    const myLocale = 'zh-CN';
    if(!customVoiceGroups){
       return;
    }

    window.AliyunVideoEditor.init({
      browser32:true,
      // 模板模式 参考模板模式接入相关文档：https://help.aliyun.com/document_detail/453481.html?spm=a2c4g.453478.0.0.610148d1ikCUxq
      // mode: 'template',
      // 默认字幕文案
      defaultSubtitleText: '默认文案',
      // 自定义画布比例
      // defaultAspectRatio: '9:16',
      // 自定义画布比例列表
      customAspectRatioList: ['1:1', '2:1', '4:3', '3:4', '9:16', '16:9', '21:9', '16:10'],
      // 自定义按钮文案
      customTexts: {
         importButton: '自定义导入',
         updateButton: '自定义保存',
          produceButton: '自定义生成',
        // logoUrl: 'https://www.example.com/assets/example-logo-url.png' 自定义logo
      },
      // 自定义人声
      customVoiceGroups,
      // 自定义字体
      customFontList: FONT_FAMILIES.concat([{
        key: '阿朱泡泡体', // 需要是唯一的key，不能与与其他字体相同，中英文均可
        name: '阿朱泡泡体', // 展示在页面的名称
        // url 是字体文件的地址
        url: 'https://test-shanghai.oss-cn-shanghai.aliyuncs.com/xxxxx/阿朱泡泡体.ttf',
      }]),
      // 页面容器
      container: document.getElementById('container'),
      // 多语言
      locale: myLocale,
      // 媒资库默认情况下播放地址会过期，所以需要动态获取
      useDynamicSrc: true,
      getDynamicSrc: (mediaId, mediaType) => {
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
          const codec = get(sourceFile, 'VideoStreamInfoList[0].CodecName');

          return {
            url: mediaUrl,
            codec,
            maskUrl
          }
        })
      },
      // exportTemplate: async ({ coverUrl, duration, timeline })=>{
      //   await request('UpdateEditingProject', { // https://help.aliyun.com/document_detail/197835.html
      //     ProjectId: projectId,
      //     CoverURL: coverUrl,
      //     Duration: duration,
      //     Timeline: JSON.stringify(timeline)
      //   });
      //   console.log('export template >>>',coverUrl,duration,timeline);
      // },
      // 获取剪辑工程关联素材
      getEditingProjectMaterials: () => {
        return request('GetEditingProjectMaterials', { // https://help.aliyun.com/document_detail/209068.html
          ProjectId: projectId
        }).then((res) => {
          const data = res.data.MediaInfos
          return transMediaList(data) // 需要做一些数据变换
        })
      },
      // 资源库导入素材
      searchMedia: (mediaType) => { // mediaType 为用户当前所在的素材 tab，可能为 video | audio | image，您可以根据这个参数对应地展示同类型的可添加素材
        return new Promise((resolve, reject) => {
          // 调用方需要自己实现展示媒资、选择媒资添加的界面
          // 关于展示媒资，请参考：https://help.aliyun.com/document_detail/197964.html
          searchMediaRef.current = {
            resolve,
            reject
          }
          setShowSearchMediaModal(true)
        })
      },
      deleteEditingProjectMaterials: async (mediaId, mediaType) => {
        return request('DeleteEditingProjectMaterials', { // https://help.aliyun.com/document_detail/209067.html
          ProjectId: projectId,
          MaterialType: mediaType,
          MaterialIds: mediaId
        })
      },
      getStickerCategories: async () => {
        const res = await request('ListAllPublicMediaTags', { // https://help.aliyun.com/document_detail/207796.html
          BusinessType: 'sticker',
          WebSdkVersion: window.AliyunVideoEditor.version
        })

        const stickerCategories = res.data.MediaTagList.map(item => ({
          id: item.MediaTagId,
          name: myLocale === 'zh-CN' ? item.MediaTagNameChinese : item.MediaTagNameEnglish // myLocale 是您期望的语言
        }))
        return stickerCategories
      },
      getStickers: async ({categoryId, page, size}) => {
        const params = {
          PageNo: page,
          PageSize: size,
          IncludeFileBasicInfo: true,
          MediaTagId: categoryId
        }

        const res = await request('ListPublicMediaBasicInfos', params) // https://help.aliyun.com/document_detail/207797.html

        const fileList = res.data.MediaInfos.map(item => ({
          mediaId: item.MediaId,
          src: item.FileInfoList[0].FileBasicInfo.FileUrl
        }))

        return {
          total: res.data.TotalCount,
          stickers: fileList
        }
      },
      getEditingProject: async () => {
        const res = await request('GetEditingProject', { // https://help.aliyun.com/document_detail/197837.html
          ProjectId: projectId
        })

        const timelineString = res.data.Project.Timeline;
        const timeline = timelineString ? JSON.parse(timelineString): undefined;

        return {
          projectId,
          timeline: timeline,
          title:res.data.Project.Title,
          modifiedTime: res.data.Project.ModifiedTime
        }
      },
      updateEditingProject: ({coverUrl, duration, timeline, isAuto}) => {
        return request('UpdateEditingProject', { // https://help.aliyun.com/document_detail/197835.html
          ProjectId: projectId,
          CoverURL: coverUrl,
          Duration: duration,
          Timeline: JSON.stringify(timeline)
        }).then(() => {
          // WebSDK 本身会进行自动保存，isAuto 则是告诉调用方这次保存是否自动保存，调用方可以控制只在手动保存时才展示保存成功的提示
          !isAuto && message.success('保存成功')
        })
      },
      produceEditingProjectVideo: ({coverUrl, duration = 0, aspectRatio, timeline, recommend}) => {
        return new Promise((resolve, reject) => {
          produceVideoRef.current = {
            aspectRatio,
            recommend,
            timeline,
            resolve,
            reject
          }
          setShowProduceVideoModal(true)
        })
      },
      // 各片段合成导出
      exportVideoClipsMerge: async (data) => {
        //  以下参数可复用导出视频的弹框对参数进行处理，生成合成任务请求参数
        const storageListReq = await requestGet('GetStorageList');
        // 示例这里采用临时文件路径，业务实现可以自己根据需要进行改动
        const tempFileStorageLocation = storageListReq.data.StorageInfoList.find((item) => {
          return item.EditingTempFileStorage
        });
        const {StorageLocation, Path} = tempFileStorageLocation;
        const filename = `${ projectId }`;
        const outputUrl = `https://${ StorageLocation }/${ Path }${ filename }_clips_merge.mp4`;
        const reqParam = {
          ProjectId: '',//填空字符串，会自动创建新项目，不为空可能覆盖当前项目timeline
          Timeline: JSON.stringify(data.timeline),
          OutputMediaTarget: 'oss-object',
          OutputMediaConfig: JSON.stringify({
            //设置业务文件名
            MediaURL: `${ outputUrl }`,
            // 使用推荐分辨率码率
            Bitrate: data.recommend.bitrate ? parseInt(data.recommend.bitrate, 10) : 1500,
            Width: data.recommend.width,
            Height: data.recommend.height,
          }),
        };
        //业务方自定义请求提交合成的API
        const res = await request('SubmitMediaProducingJob', reqParam);
        if (res.status === 200) {
          message.success('导出成功')
        } else {
          message.error('导出失败');
        }
      },
      // 各片段独立导出
      exportVideoClipsSplit: async (data) => {
        //  以下参数可复用导出视频的弹框对参数进行处理，生成合成任务请求参数
        const storageListReq = await requestGet('GetStorageList');
        // 示例这里采用临时文件路径，业务实现可以自己根据需要进行改动
        const tempFileStorageLocation = storageListReq.data.StorageInfoList.find((item) => {
          return item.EditingTempFileStorage
        });
        const {StorageLocation, Path} = tempFileStorageLocation;
        const filename = `${ projectId }`;
        const outputUrl = `https://${ StorageLocation }/${ Path }${ filename }_`;
        const reqParams = data.map((item, index) => {
          return {
            ProjectId: '',//填空字符串，会自动创建新项目，不为空可能覆盖当前项目timeline
            Timeline: JSON.stringify(item.timeline),
            OutputMediaTarget: 'oss-object',
            OutputMediaConfig: JSON.stringify({
              //设置业务文件名，导出多个可根据序号设置
              MediaURL: `${ outputUrl }_${ index }.mp4`,
              // 使用推荐分辨率码率
              Bitrate: item.recommend.bitrate ? parseInt(item.recommend.bitrate, 10) : 1500,
              Width: item.recommend.width,
              Height: item.recommend.height,
            }),

          };
        });
        let success = true;
        //提交多个合成任务
        await Promise.all(
          reqParams.map(async (params) => {
            //业务方自定义请求提交合成的API
            const res = await request('SubmitMediaProducingJob', params);
            success = success && res.status === 200;
          }),
        );
        if (success) {
          message.success('导出成功')
        } else {
          message.error('导出失败');
        }
      },
      // 标记片段独立导出
      exportFromMediaMarks: async (data) => {
        //  以下参数可复用导出视频的弹框对参数进行处理，生成合成任务请求参数
        const storageListReq = await requestGet('GetStorageList')
        // 示例这里采用临时文件路径，业务实现可以自己根据需要进行改动
        const tempFileStorageLocation = storageListReq.data.StorageInfoList.find((item) => {
          return item.EditingTempFileStorage
        });
        const {StorageLocation, Path} = tempFileStorageLocation;
        const filename = `${ projectId }`;
        const outputUrl = `https://${ StorageLocation }/${ Path }${ filename }_`;
        const reqParams = data.map((item, index) => {
          return {
            ProjectId: '',//填空字符串，会自动创建新项目，不为空可能覆盖当前项目timeline
            Timeline: JSON.stringify(item.timeline),
            OutputMediaTarget: 'oss-object',
            OutputMediaConfig: JSON.stringify({
              //设置业务文件名，导出多个可根据序号设置
              MediaURL: `${ outputUrl }_${ index }.mp4`,
              // 使用推荐分辨率码率
              Bitrate: item.recommend.bitrate ? parseInt(item.recommend.bitrate, 10) : 1500,
              Width: item.recommend.width,
              Height: item.recommend.height,
            }),

          };
        });
        let success = true;
        //提交多个合成任务
        await Promise.all(
          reqParams.map(async (params) => {
            //业务方自定义请求提交合成的API
            const res = await request('SubmitMediaProducingJob', params);
            success = success && res.status === 200;
          }),
        );
        if (success) {
          message.success('导出成功')
        } else {
          message.error('导出失败');
        }
      },
      // 智能生成字幕
      submitASRJob: async (mediaId, startTime, duration) => {
        const res = await request('SubmitASRJob', { // https://help.aliyun.com/document_detail/203425.html
          InputFile: mediaId,
          StartTime: startTime,
          Duration: duration
        });

        if (res.status === 200) {
          const jobId = res.data.JobId;

          const interval = 10000; // 轮询的时间间隔，接入方可以自定义
          const totalTimes = 10; // 轮询次数，接入方可以自定义
          let result = {};
          for (let i = 0; i < totalTimes; i++) {
            await new Promise(resolve => {
              window.setTimeout(resolve, interval);
            });

            // 获取智能任务结果
            result = await requestGet('GetSmartHandleJob', { // https://help.aliyun.com/document_detail/203429.html
              JobId: jobId
            });
            if (result.status !== 200) break; // 任务失败，结束轮询
            const state = res.data.State;
            if (state !== 'Creating' && state !== 'Executing') break;
          }

          if (result.status === 200 && result.data.State === 'Finished') {
            return JSON.parse(result.data.Output);
          } else {
            throw new Error('智能识别字幕失败')
          }
        } else {
          throw new Error(res.message);
        }
      },
      // 智能生成配音
      submitAudioProduceJob: async (text, voice, voiceConfig = {}) => {
        const storageListReq = await requestGet('GetStorageList')
        const tempFileStorageLocation = storageListReq.data.StorageInfoList.find((item) => {
          return item.EditingTempFileStorage
        });
        if (!tempFileStorageLocation) {
          throw new Error('未设置临时存储路径');
        }

        const {StorageLocation, Path} = tempFileStorageLocation;
        // 智能生成配音会生成一个音频文件存放到接入方的 OSS 上，这里 bucket, path 和 filename 是一种命名的示例，接入方可以自定义
        const bucket = StorageLocation.split('.')[0];
        const path = Path;
        const filename = `${ text.slice(0, 10) }${ Date.now() }`;
        const editingConfig = voiceConfig.custom
        ? {
            customizedVoice: voice,
            format: 'mp3',
            ...voiceConfig,
          }
        : {
            voice,
            format: 'mp3',
            ...voiceConfig,
          };
        // 1-提交智能配音任务
        const res1 = await request('SubmitAudioProduceJob', { // https://help.aliyun.com/document_detail/212273.html
          EditingConfig: JSON.stringify(editingConfig),
          InputConfig: text,
          OutputConfig: JSON.stringify({
            bucket,
            object: `${ path }${ filename }`
          })
        });

        if (res1.status !== 200) {
          throw new Error('暂未识别当前文字内容');
        }

        // 2-智能配音任务是否完成【轮询】
        const getJobStatus = () => {
          return requestGet('GetSmartHandleJob', { // https://help.aliyun.com/document_detail/203429.html
            JobId: res1.data.JobId,
          });
        };
        const shouldContinueGetJobStatus = (res) => {
          if (res.status !== 200 || res.data.State === 'Finished') return false;
          return true;
        };
        const {result: res2} = await poll(
          getJobStatus,
          shouldContinueGetJobStatus,
          2000,
          20000
        );

        // 3-智能配音任务完成则拉取生成的音频【轮询】
        if (res2.status === 200 && res2.data.State === 'Finished') {
          const mediaId = res2.data.Output;

          const getProducedAudioInfo = () => {
            return request('GetMediaInfo', {
              MediaId: mediaId,
            });
          };
          const shouldContinueGetProducedAudioInfo = (res) => {
            if (res.status !== 200) return false;
            if (res.data?.MediaInfo?.MediaBasicInfo?.Status === 'Normal') return false;
            return true;
          };
          const res3 = await poll(
            getProducedAudioInfo,
            shouldContinueGetProducedAudioInfo,
            5000,
            15000,
          );

          if (res3.timeout) {
            throw new Error('智能配音任务超时，请重新发起');
          } else {
            const result = transMediaList([res3.result.data.MediaInfo]); // transMediaList 同前文中的定义
            const newAudio = result[0];
            // 4-将新的音频素材与工程进行绑定
            await request('AddEditingProjectMaterials', {
              ProjectId: projectId,
              MaterialMaps: JSON.stringify({
                audio: newAudio.mediaId,
              }),
            });
            return newAudio;
          }
        } else {
          throw new Error(res2.data.ErrorMsg || '抱歉，暂未识别当前文字内容');
        }
      },
      avatarConfig: {
        // 视频输出分辨率码率

        filterOutputConfig: (item, configs) => {
          if (item.outputMask === false) {
            return [
              { width: 1920, height: 1080, bitrates: [4000] },
              { width: 1080, height: 1920, bitrates: [4000] },
            ];
          }
          return configs;
        },
        // 任务轮询时间（单位毫秒）
        refreshInterval: 2000,
        // 获取官方数字人列表
        getAvatarList: () => {
          return [
            {
              id: 'default',
              default: true,
              name: '官方数字人',
              getItems: async (pageNo, pageSize) => {
                const res = await requestGet("ListSmartSysAvatarModels", {
                  PageNo: pageNo,
                  PageSize: pageSize,
                  SdkVersion: window.AliyunVideoEditor.version,
                });
                if (res && res.status === 200) {
                  return {
                    total: get(res, 'data.TotalCount'),
                    items: get(res, 'data.SmartSysAvatarModelList', []).map((item) => {
                      return {
                        avatarName: item.AvatarName,
                        avatarId: item.AvatarId,
                        coverUrl: item.CoverUrl,
                        videoUrl: item.VideoUrl,
                        outputMask: item.OutputMask,
                      };
                    }),
                  };
                }
                return {
                  total: 0,
                  items: [],
                };
              },
            },
            {
              id: 'custom',
              default: false,
              name: '我的数字人',
              getItems: async (pageNo, pageSize) => {
                const res = await requestGet("ListAvatars",{
                  PageNo: pageNo,
                  PageSize: pageSize,
                  SdkVersion: window.AliyunVideoEditor.version,
                });
                if (res && res.status === '200') {
                  const avatarList = get(res, 'data.Data.AvatarList', []);
                  const coverMediaIds = avatarList.map((aitem) => {
                    return aitem.Portrait;
                  });

                  const coverListRes = await requestGet("BatchGetMediaInfos",{
                    MediaIds: coverMediaIds.join(','),
                    AdditionType: 'FileInfo',
                  });
                  const mediaInfos = get(coverListRes, 'data.MediaInfos');

                  const idCoverMapper = mediaInfos.reduce((result, m) => {
                    result[m.MediaId] = get(m, 'FileInfoList[0].FileBasicInfo.FileUrl');
                    return result;
                  }, {});

                  return {
                    total: get(res, 'data.TotalCount'),
                    items: avatarList.map((item) => {
                      return {
                        avatarName: item.AvatarName || '',
                        avatarId: item.AvatarId,
                        coverUrl: idCoverMapper[item.Portrait],
                        videoUrl: undefined,
                        outputMask: false,
                        transparent: item.Transparent,
                      };
                    }),
                  };
                }
                return {
                  total: 0,
                  items: [],
                };
              },
            },
          ];
        },
        // 提交数字人任务
        submitAvatarVideoJob: async (job) => {

          const storageListReq = await requestGet('GetStorageList')
          const tempFileStorageLocation = storageListReq.data.StorageInfoList.find((item) => {
            return item.EditingTempFileStorage
          });
          if (tempFileStorageLocation) {
            const {StorageLocation, Path} = tempFileStorageLocation;
            /**
             * 判断数字人是否输出背景透明等格式
             * outputMask：boolean,需要输出遮罩视频，此时输出的视频格式需要是mp4，会生成一个遮罩视频和纯色背景mp4视频
             * transparent: boolean,是否透明视频，如果transparent为false，则表示该数字人是带背景的，不能生成透明背景的webm视频
             * */
            const { outputMask, transparent } = job.avatar;
            const filename =
              outputMask || transparent === false
                ? `${encodeURIComponent(job.title)}-${Date.now()}.mp4`
                : `${encodeURIComponent(job.title)}-${Date.now()}.webm`;

            const outputUrl = `https://${ StorageLocation }/${ Path }${ filename }`;
            const params = {
              UserData: JSON.stringify(job),
            };
            if (job.type === 'text') {
              params.InputConfig = JSON.stringify({
                Text: job.data.text,
              });
              params.EditingConfig = JSON.stringify({
                AvatarId: job.avatar.avatarId,
                Voice: job.data.params.voice, // 发音人，仅输入为Text有效，必填
                SpeechRate: job.data.params.speechRate, // 语速，仅输入为Text有效，取值范围：-500～500，默认值：0
                PitchRate: job.data.params.pitchRate, // 音调，仅输入为Text有效，取值范围：-500～500，默认值：0
                Volume: job.data.params.volume,
              });
              params.OutputConfig = JSON.stringify({
                MediaURL: outputUrl,
                Bitrate: job.data.output.bitrate,
                Width: job.data.output.width,
                Height: job.data.output.height,
              });
            } else {
              params.InputConfig = JSON.stringify({
                MediaId: job.data.mediaId,
              });
              params.EditingConfig = JSON.stringify({
                AvatarId: job.avatar.avatarId,
              });
              params.OutputConfig = JSON.stringify({
                MediaURL: outputUrl,
                Bitrate: job.data.output.bitrate,
                Width: job.data.output.width,
                Height: job.data.output.height,
              });
            }
            const res = await request('SubmitAvatarVideoJob', params);
            if (res.status === 200) {
              return {
                jobId: res.data.JobId,
                mediaId: res.data.MediaId,
              };
            } else {
              throw new Error('提交任务失败');
            }
          } else {
            throw new Error('无法获取临时路径');
          }
        },
        // 获取数字人任务状态，定时轮询调用
        getAvatarVideoJob: async (jobId) => {
          try {
            const res = await requestGet("GetSmartHandleJob", {JobId: jobId});
            if (res.status !== 200) {
              throw new Error(`response error:${ res.data && res.data.ErrorMsg }`);
            }

            let job;
            if (res.data.UserData) {
              job = JSON.parse(res.data.UserData);
            }
            let video;
            let done = false;
            let subtitleClips;
            // 解析生成的字幕
            if (res.data.JobResult && res.data.JobResult.AiResult) {
              const apiResult = JSON.parse(res.data.JobResult.AiResult);
              if (
                apiResult &&
                apiResult.subtitleClips &&
                typeof apiResult.subtitleClips === 'string'
              ) {
                subtitleClips = JSON.parse(apiResult.subtitleClips);
              }
            }
            const mediaId = res.data.JobResult.MediaId;
            if (res.data.State === 'Finished') {
              // 获取生成的媒资状态
              const res2 = await request("GetMediaInfo", {
                MediaId: mediaId,
              });
              if (res2.status !== 200) {
                throw new Error(`response error:${ res2.data && res2.data.ErrorMsg }`);
              }
              // 判断生成的视频及透明遮罩视频是否成功
              const fileLength = get(res2, 'data.MediaInfo.FileInfoList', []).length;
              const { avatar } = job;
              const statusOk =
              get(res2, 'data.MediaInfo.MediaBasicInfo.Status') === 'Normal' &&
              (avatar.outputMask ? fileLength >= 2 : fileLength > 0);

              const result = statusOk ? transMediaList([get(res2, 'data.MediaInfo')]) : [];
              video = result[0];
              done = !!video && statusOk;

              if (done) {
                // 将新的数字人素材与工程进行绑定
                await request('AddEditingProjectMaterials', {
                  ProjectId: projectId,
                  MaterialMaps: JSON.stringify({
                    video: mediaId,
                  }),
                });
              }
            } else if (res.data.State === 'Failed') {
              return {
                done: false,
                jobId,
                mediaId,
                job,
                errorMessage: `job status fail,status:${ res.data.State }`,
              };
            }
            // 返回任务状态，done后不再轮询
            return {
              done,
              jobId: res.data.JobId,
              mediaId,
              job,
              video,
              subtitleClips,
            };
          } catch (ex) {
            return {
              done: false,
              jobId,
              errorMessage: ex.message,
            };
          }
        },
      }
    })

    return () => {
      window.AliyunVideoEditor.destroy()
    }
  }, [projectId,customVoiceGroups])

  return (
    <div>
      <div id='container' style={{height: '100vh'}} />
      {showSearchMediaModal && (
        <SearchMediaModal
          onSubmit={(info) => {
            setShowSearchMediaModal(false)
            searchMediaRef.current.resolve(info)
          }}
          onClose={() => {
            setShowSearchMediaModal(false)
            searchMediaRef.current.reject()
          }}
          projectId={projectId}
        />
      )}
      {showProduceVideoModal && (
        <ProduceVideoModal
          aspectRatio={produceVideoRef.current.aspectRatio}
          recommend={produceVideoRef.current.recommend}
          onSubmit={async ({fileName, format, bitrate, resolution, ossBucket}) => { // 假设提交合成任务的界面让你获得了这些数据
            // 先根据 fileName 和 format 拼接出存储的 mediaURL
            const mediaURL = `${ ossBucket }${ fileName }.${ format }`
            const [width, height] = resolution
            await request('SubmitMediaProducingJob', { // https://help.aliyun.com/document_detail/197853.html
              OutputMediaConfig: JSON.stringify({
                mediaURL,
                bitrate,
                width,
                height
              }),
              OutputMediaTarget: 'oss-object',
              ProjectId: projectId,
              Timeline: JSON.stringify(produceVideoRef.current.timeline)
            })
            message.success('生成视频成功')
            setShowProduceVideoModal(false)
            produceVideoRef.current.resolve()
          }}
          onClose={() => {
            setShowProduceVideoModal(false)
            produceVideoRef.current.reject()
          }}
        />
      )}
    </div>
  )
}

export default ProjectDetail
