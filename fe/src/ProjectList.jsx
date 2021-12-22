import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Form, Input, Modal } from 'antd'
import { request } from './utils'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}

function ProjectList () {
  const [list, setList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [version, setVersion] = useState(1)
  const [form] = Form.useForm()

  useEffect(() => {
    request('SearchEditingProject', {
      TemplateType: 'None',
      PageSize: 10,
      PageNo: 1
    }).then(res => {
      if (res.status === 200) {
        setList(res.data.ProjectList)
      }
    })
  }, [version])

  const handleSubmit = (values) => {
    setConfirmLoading(true)
    request('CreateEditingProject', {
      Title: values.title
    }).then(() => {
      setConfirmLoading(false)
      setShowModal(false)
      setVersion(v => v + 1)
    })
  }

  return (
    <Card
      extra={<Button type='primary' onClick={() => setShowModal(true)}>创建工程</Button>}
      title='工程列表'
      style={{ width: 300, margin: '50px auto' }}
    >
      <div>
        {list.map((p, i) => (
          <Link style={{ display: 'block' }} key={p.ProjectId} to={`/detail/${p.ProjectId}`}>
            {i + 1}. {p.Title}
          </Link>
        ))}
      </div>
      {showModal && (
        <Modal
          visible
          title='创建剪辑工程'
          okText='提交'
          cancelText='取消'
          onOk={() => form.submit()}
          onCancel={() => setShowModal(false)}
          confirmLoading={confirmLoading}
        >
          <Form
            {...layout}
            form={form}
            onFinish={handleSubmit}
          >
            <Form.Item name='title' label='工程名称' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </Card>
  )
}

export default ProjectList
