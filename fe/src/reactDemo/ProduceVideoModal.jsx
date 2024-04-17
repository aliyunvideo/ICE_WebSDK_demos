import { Form, Input, Modal, Select } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { resolutionMap,supportedFormats ,OSS_BUCKET_LOCAL_STORAGE_KEY} from '../const';
import {requestGet} from '../utils';
import {get} from 'lodash';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}



function ProduceVideoModal (props) {
  const { onSubmit, onClose, aspectRatio, recommend } = props
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [storageList,setStorageList] = useState([]);

  let resolutions = resolutionMap[aspectRatio] || []
  if (recommend && recommend.width && recommend.height) {
    // 根据 WebSDK 传入的预览比例来决定合成的宽高
    const fromRecommend = {
      label: `推荐分辨率 ${recommend.width} x ${recommend.height}`,
      width: recommend.width,
      height: recommend.height,
      bitrate: recommend.bitrate || 1500
    }
    resolutions = [fromRecommend].concat(resolutions)
  }

  const handleResolutionChange = (value) => {
    const target = resolutions.find(r => r.width === Number(value))
    if (target) {
      form.setFieldsValue({ bitrate: target.bitrate })
    }
  }

  const handleSubmit = (values) => {
    setConfirmLoading(true)
    const { fileName, format, ossBucket, resolution, bitrate } = values
    const target = resolutions.find(r => r.width === Number(resolution))
    window.localStorage.setItem(OSS_BUCKET_LOCAL_STORAGE_KEY, ossBucket)
    onSubmit({
      fileName,
      format,
      ossBucket,
      bitrate,
      resolution: [target.width, target.height]
    })
  }

  const fetchStorageList = useCallback(async ()=>{
    const storageListReq = await requestGet("GetStorageList");
    const list =  get(storageListReq,'data.StorageInfoList',[]);
    setStorageList(list.map((item)=>{
       return {
         label: `${item.StorageLocation}`,
         value: `${item.StorageType === 'vod_oss_bucket'?'vod':'http'}://${item.StorageLocation}`,
       };
    }));
  },[]);

  useEffect(()=>{
    fetchStorageList();
  },[fetchStorageList]);


  return (
    <Modal
      open
      title='提交合成任务'
      okText='提交'
      cancelText='取消'
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={confirmLoading}
    >
      <Form
        {...layout}
        form={form}
        onFinish={handleSubmit}
        initialValues={{ format: 'mp4', resolution: `${resolutions[0].width}`, bitrate: resolutions[0].bitrate, ossBucket: window.localStorage.getItem(OSS_BUCKET_LOCAL_STORAGE_KEY) || '' }}
      >
        <Form.Item name='fileName' label='文件名' rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name='format' label='格式' rules={[{ required: true }]}>
          <Select>
            {supportedFormats.map(f => (
              <Select.Option key={f}>{f}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name='ossBucket' label='存储地址' rules={[{ required: true }]}>
          {/** 一般不需要给用户填写，直接在代码里指定存储地址即可 */}
          {storageList.length===0?<Input placeholder='http://example-bucket.oss-cn-shanghai.aliyuncs.com/' />:
          <Select>
             {storageList.map((item)=>{
              return   <Select.Option key={item.value} value={item.value} >{item.label}</Select.Option>
             })}
          </Select>
        }
        </Form.Item>
        <Form.Item name='resolution' label='分辨率' rules={[{ required: true }]}>
          <Select onChange={handleResolutionChange}>
            {resolutions.map(r => (
              <Select.Option key={r.width}>{r.label}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name='bitrate' label='码率'>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ProduceVideoModal
