import React,{ useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import { message,Button } from 'antd';
import CommonTable from '../../../components/Momiolo/CommonTable';
import CommonAuth from '../../../components/Momiolo/CommonAuth';
import CommonModalForm from '../../../components/Momiolo/CommonModalForm';
import PageCard from '../../../components/PageCard';


const Notice = (props:any) => {
  const { dispatch,loading, pageData:{ list, pagination } } = props;
  const [visible,setVisible] = useState(false);
  const [formData,setFormData] = useState({});
  useEffect(() => {
    handleSearch();
  },[]);
  const handleSearch = useCallback(() => {
    dispatch({
      type: 'base/getPage',
      payload: {url: '/notice/findByPage'},
    });
  },[]);
  const handleDelete = useCallback((sid) =>{
    dispatch({
      type: 'base/postData',
      payload: {url: '/notice/delete',sid},
      callback: (res:any) => {
        message.success('删除成功');
        handleSearch();
      }
    })
  },[]);
  const formItems = [
    {
      key:'title',
      title:'公告标题',
      type:'input',
      rules:[{ required:true }],
    },
    {
      key:'type',
      title:'公告类型',
      type:'select',
      rules:[{ required:true }],
      selectOptions:[
        { value:'1', label:'类型一'},
        { value:'2', label:'类型二'},
        { value:'3', label:'类型三'},
      ],
    },
    {
      key:'content',
      title:'公告内容',
      type:'textArea',
    },
  ];
  const columns = [
    {
      title: '公告标题',
      dataIndex: 'title',
      width: '10%',
    },
    {
      title: '公告类型',
      dataIndex: 'type',
      width: '10%',
    },
    {
      title: '公告内容',
      dataIndex: 'content',
      width: '45%',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      width: '10%',
    },
    {
      title: '更新时间',
      dataIndex: 'updateDate',
      width: '10%',
    },
    {
      title: '操作',
      dataIndex: '操作',
      render: (text:string, record:any) => {
        const btns = [
          {
            key: 'edit',
            title: '编辑',
            auth:'1',
            onClick: () => {
              setVisible(true);
              setFormData(record);
            }
          },
          {
            title: '删除',
            key: 'remove',
            auth:'2',
            onClick: () => handleDelete(record.sid),
            pop: true,
            message: '是否确认删除？',
          }
        ];
        return <CommonAuth btns={btns} />;
      },
    },
  ];
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    ...pagination,
    showTotal: () => (
        <span>共&nbsp;{pagination === undefined ? 0 : pagination.total}&nbsp;条</span>
    ),
  };
  const tableProps = {
    columns,
    dataSource: list,
    loading,
    rowKey: (record:any) => record.sid,
    pagination: paginationProps,
  };
  return (
      <PageCard>
        <div style={{ display:'flex',marginBottom:12}}>
          <Button type='primary' onClick={() => setVisible(true)}>
            新增
          </Button>
        </div>
        <CommonTable
           tableProps={tableProps}
        />
        <CommonModalForm
          visible={visible}
          saveUrl={['/notice/create','/notice/update']}
          formItems={formItems}
          formData={formData}
          handleCallback={() => handleSearch()}
          handleCancel={() => { setVisible(false); setFormData({})}}
        />
      </PageCard>
  )
};
export default connect(({ loading, base }:any) => ({
  loading:loading.effects['base/getPage'],
  pageData:base.pageData,
}))(Notice)
