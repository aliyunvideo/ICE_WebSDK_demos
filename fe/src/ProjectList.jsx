import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {Button, Card, Form, Input, Modal, List, Pagination} from 'antd'
import {request} from './utils'

const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20}
}
const PageSize = 10;
function ProjectList() {
  const [list, setList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [version, setVersion] = useState(1)
  const [total, setTotal] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [form] = Form.useForm()

  useEffect(() => {
    request('SearchEditingProject', {
      TemplateType: 'None',
      PageSize: PageSize,
      PageNo: pageNo
    }).then(res => {
      if (res.status === 200) {
        setList(res.data.ProjectList)
        setTotal(res.data.TotalCount)
      }
    })
  }, [version, pageNo])

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

  return (<div>

    <Card
      extra={
        <div>
          <Button type='primary' onClick={() => setShowModal(true)}>创建工程</Button>
          <Button style={{marginLeft: '10px'}} onClick={() => {
            window.location.href = '/player.html'
          }} >预览播放器</Button>
        </div>
      }
      title='工程列表'
      style={{width: '80%', margin: '50px auto'}}
    >
      <div>

        <List
          dataSource={list}
          renderItem={(item, index) => {
            return <List.Item  >
              <Link style={{display: 'block'}} to={`/detail/${ item.ProjectId }`}>
                {index + 1}. {item.Title}
              </Link>
              <div>
                <Link to={`/detail/${ item.ProjectId }`} target='_blank' >
                  <Button style={{marginRight: '10px'}} >编辑</Button>
                </Link>
                <Button style={{marginLeft: '10px'}} onClick={() => {
                  window.location.href = `/player.html#/projectTimeline/${ item.ProjectId }`
                }} >预览</Button>
              </div>
            </List.Item>
          }}
        />
        <Pagination current={pageNo} total={total} pageSize={PageSize} pageSizeOptions={[10]} onChange={(n) => {
          setPageNo(n);
        }} />
      </div>
      {showModal && (
        <Modal
          open
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
            <Form.Item name='title' label='工程名称' rules={[{required: true}]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </Card>
  </div>
  )
}

export default ProjectList
