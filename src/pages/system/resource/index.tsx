import React,{ useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import { Tag, message } from 'antd';
import CommonTable from '../../../components/Momiolo/CommonTable';
import CommonAuth from '../../../components/Momiolo/CommonAuth';
import CommonModalForm from '../../../components/Momiolo/CommonModalForm';
import PageCard from '../../../components/PageCard';


const TYPE = [
  { value:1, label: '菜单'},
  { value:2, label: '路由'},
  { value:3, label: '按钮'},
];
// @ts-ignore
const getType = (record:any) => {
  if(record.resourceType === 1){
    // 不存在菜单/路由/按钮
    if(!record?.children?.length && !record?.buttonChildren?.length){
      return TYPE;
    }
    // 存在菜单/路由
    if(record?.children?.length && !record?.buttonChildren?.length){
      return TYPE.slice(0,2);
    }
    // 存在按钮
    if(!record?.children?.length && record?.buttonChildren?.length){
      return TYPE.slice(2,3);
    }
  } else if(record.resourceType === 2){
    return TYPE.slice(2,3);
  } else {
    return [];
  }
};
const Resource = (props:any) => {
  const { dispatch,loading } = props;
  const [list,setList] = useState([]); // 列表
  const [visible,setVisible] = useState(false);
  const [formData,setFormData] = useState({});
  // 新增时上级资源下拉选项   新增/编辑时资源类型下拉   新增时上级资源初始值
  const [configData,setConfigData] = useState({ resourceParentOptions:[],resourceTypeOptions:[],initialValues:{} });

  useEffect(() => {
    handleSearch();
  },[]);
  const handleSearch = useCallback(() => {
    dispatch({
      type: 'base/getData',
      payload: {url: '/resource/findMenuTree'},
      callback: (res:any) => {
        setList(res.data);
      }
    });
  },[]);
  const handleDelete = useCallback((sid) =>{
    dispatch({
      type: 'base/postData',
      payload: {url: '/resource/delete',sid},
      callback: (res:any) => {
        message.success('删除成功');
        handleSearch();
      }
    })
  },[]);
  const formItems = [
    {
      key:'resourceParentSid',
      title:'资源上级',
      type:'select',
      rules:[{ required:true }],
      readOnly:[true,true],
      selectOptions:configData.resourceParentOptions,
      hide:Object.keys(formData).length
    },
    {
      key:'resourceName',
      title:'资源名称',
      type:'input',
      rules:[{ required:true, message:'请输入资源名称' }],
    },
    {
      key:'resourceCode',
      title:'资源编码',
      type:'input',
      rules:[{ required:true, message:'请输入资源编码' }],
      readOnly:[false,true],
    },
    {
      key:'resourceType',
      title:'资源类型',
      type:'select',
      rules:[{ required:true, message:'请选择资源类型' }],
      readOnly:[false,true],
      selectOptions:configData.resourceTypeOptions,
    },
    {
      key:'resourceIcon',
      title:'资源图标',
      type:'input',
      rules:[{ required:true, message:'请输入资源图标' }],
    },
  ];
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'resourceName',
      width: '30%',
      render:(text:string, record:any) => {
        switch (record.resourceType) {
          case 1: return <span><Tag color="processing">菜单</Tag>{text}</span>;
          case 2: return <span><Tag color="error">路由</Tag>{text}</span>;
          default: return null;
        }
      }
    },
    {
      title: '下级功能清单',
      dataIndex: 'resourceType',
      width: '50%',
      render:(text:string, record:any) => {
        if(record.children && record.children.length){
          return record.children.map((item:any,index:number) => <span key={index}><Tag color="warning">{item.resourceName}</Tag></span>)
        } else if(record.buttonChildren && record.buttonChildren.length){
          return record.buttonChildren.map((item:any,index:number) => <span key={index}><Tag color="success">{item.resourceName}</Tag></span>)
        } else {
          return null;
        }
      }
    },
    {
      title: '操作',
      dataIndex: '操作',
      render: (text:string, record:any) => {
        const btns = [
          {
            key: 'add',
            title: '新增',
            auth:'resource_create',
            hide:record.resourceType === 3,
            onClick: () => {
              setVisible(true);
              setConfigData({
                resourceParentOptions:[{ value:record.sid,label:record.resourceName }],
                resourceTypeOptions:getType(record),
                initialValues:{ resourceParentSid:record.sid },
              })
            }
          },
          {
            key: 'edit',
            title: '编辑',
            auth:'resource_update',
            onClick: () => {
              setVisible(true);
              setFormData(record);
              setConfigData({
                ...configData,
                resourceTypeOptions:TYPE,
              })
             }
            },
          {
            title: '删除',
            key: 'remove',
            auth:'resource_delete',
            onClick: () => handleDelete(record.sid),
            pop: true,
            message: '是否确认删除？',
          }
        ];
        return <CommonAuth btns={btns} />;
      },
    },
  ];
  const tableProps = {
    columns,
    dataSource: list,
    loading,
    rowKey: (record:any) => record.sid,
    pagination: false,
  };
  return (
      <PageCard>
        <CommonTable
          tableProps={tableProps}
        />
        <CommonModalForm
          visible={visible}
          saveUrl={['/resource/create','/resource/update']}
          formItems={formItems}
          formData={formData}
          initialValues={configData.initialValues}
          handleCallback={() => handleSearch()}
          handleCancel={() => { setVisible(false); setFormData({})}}
        />
      </PageCard>
  )
};
export default connect(({ loading }:any) => ({
  loading:loading.effects['base/getData']
}))(Resource)
