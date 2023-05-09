import { Form, Input, Modal, Select } from 'antd'
import { useState } from 'react'

const supportedFormats = ['mp4', 'mov'] // ICE 支持导出的视频格式完整列表见：https://help.aliyun.com/document_detail/197846.html
const resolutionMap = {
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

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}

const OSS_BUCKET_LOCAL_STORAGE_KEY = 'oss-bucket-local-storage-key'

function ProduceVideoModal (props) {
  const { onSubmit, onClose, aspectRatio, recommend } = props
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

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
          <Input placeholder='http://example-bucket.oss-cn-shanghai.aliyuncs.com/' />
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
