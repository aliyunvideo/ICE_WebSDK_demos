import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {Button, Form, Input, Modal, List, Pagination, Card} from 'antd'
import {request} from '../utils'
import {   useNavigate } from 'react-router-dom';

const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20}
}
const PageSize = 10;


function TemplateList() {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    request('ListTemplates', {
      Type: 'Timeline',
      PageSize: PageSize,
      PageNo: pageNo
    }).then(res => {
      if (res.status === 200) {
        setList(res.data.Templates)
        setTotal(res.data.TotalCount)
      }
    }).finally(()=>{
      setLoading(false);
    });
  }, [ pageNo])


  return (<div style={{margin: '16px'}} >
    <Card
      title="模板列表"
    >

      <List
        dataSource={list}
        loading={loading}
        renderItem={(item, index) => {
          return <List.Item  >
            <Link style={{display: 'block'}} to={`/home/template/${ item.TemplateId }`}>
              {index + 1}. {item.Name}
            </Link>
            <div>
              <Link to={`/home/template/${ item.TemplateId }`}   >
                <Button style={{marginRight: '10px'}} >编辑</Button>
              </Link>
            </div>
          </List.Item>
        }}
      />
      <Pagination current={pageNo} total={total} pageSize={PageSize} pageSizeOptions={[10]} onChange={(n) => {
        setPageNo(n);
      }} />
    </Card>


  </div>
  )
}

export default TemplateList
