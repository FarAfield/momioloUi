import React,{ useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import { Row, Col, Card, Tree, message } from 'antd';
import PageCard from '../../../components/PageCard';
import CommonModalForm from '../../../components/Momiolo/CommonModalForm';
import CommonAuth from '../../../components/Momiolo/CommonAuth';


const { TreeNode } = Tree;
const Org = (props:any) => {
  const { dispatch } = props;
  const [treeList,setTreeList] = useState<any>([]);
  const [record,setRecord] = useState<any>({}); // 树选择
  const [visible,setVisible] = useState(false);
  const [formData,setFormData] = useState({});
  useEffect(() => {
    handleSearch();
  },[]);
  const handleSearch = useCallback(() => {
    dispatch({
      type: 'base/getData',
      payload: {url: '/org/findOrgTree'},
      callback:(res:any) => {
        setTreeList([res.data]);
      }
    });
  },[]);
  const handleDelete = useCallback((sid) =>{
    dispatch({
      type: 'base/postData',
      payload: {url: '/org/delete',sid},
      callback: (res:any) => {
        message.success('删除成功');
        handleSearch();
      }
    })
  },[]);


  const onSelect = () => {};
  const onExpand = () => {};

  // 构造树节点
  const transferTree = useCallback(() => {
    const loop = (list:any =[]) => {
      return list.map((item:any) => {
        return <TreeNode key={item.sid} title={item.orgName}>{loop(item.orgChildList)}</TreeNode>
      })
    };
    return loop(treeList);
  },[treeList]);


  const formItems = [
    {
      key:'orgParentSid',
      title:'所属上级',
      type:'input',
      rules:[{ required:true, message:'请输入所属上级' }],
      readOnly:[true,true],
    },
    {
      key:'orgName',
      title:'组织名称',
      type:'input',
      rules:[{ required:true, message:'请输入组织名称' }],
    },
    {
      key:'orgType',
      title:'组织类型',
      type:'select',
      rules:[{ required:true, message:'请选择组织类型' }],
    },
    {
      key:'orgCode',
      title:'组织编码',
      type:'select',
      rules:[{ required:true, message:'请输入组织编码' }, { message: '由数字、26个英文字母或者下划线组成的2-20位字符!', pattern: /^[\w]{2,20}$/ }],
    },
    {
      key:'orgDesc',
      title:'组织简介',
      type:'textArea',
      rules:[{ max: 200, message:'最大字符200' }],
      maxLength:200,
    },
  ];
  const renderHead = () => {
    const btns = [
      {
        key: 'add',
        title: '新增',
        auth:'org_create',
        onClick: () => setVisible(true),
      },
      {
        key: 'edit',
        title: '编辑',
        auth:'org_update',
        onClick: () => {
          setVisible(true);
          setFormData(record);
        }
      },
      {
        title: '删除',
        key: 'remove',
        auth:'org_delete',
        onClick: () => handleDelete(record.sid),
        pop: true,
        message: '是否确认删除？',
      },
    ];
    return (
        <div>
          <CommonAuth btns={btns} type={"link"}/>
        </div>
        )
  };


  return (
      <PageCard>
        <Row>
          <Col span={8}>
            <Card bordered={false}>
              { renderHead() }
              <Tree
                onSelect={onSelect}
                onExpand={onExpand} //展开收起节点时触发
                //expandedKeys={expandedKeys} //展开指定的树节点
              >
                {transferTree()}
              </Tree>
            </Card>
          </Col>
          <Col span={16}>
            <Card bordered={false}>

            </Card>
          </Col>
        </Row>
        <CommonModalForm
          visible={visible}
          saveUrl={['/org/create','/org/update']}
          formItems={formItems}
          formData={formData}
          handleCallback={() => handleSearch()}
          handleCancel={() => { setVisible(false); setFormData({})}}
        />
      </PageCard>
  )
};
export default connect(({ loading }:any) => ({
  loading:loading.effects['base/getData'] || loading.effects['base/postData'],
}))(Org)
