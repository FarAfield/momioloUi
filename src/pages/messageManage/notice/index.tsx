/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { connect } from 'umi';
import { message, Button } from 'antd';
import CommonTable from '../../../components/Momiolo/CommonTable';
import CommonAuth from '../../../components/Momiolo/CommonAuth';
import CommonModalForm from '../../../components/Momiolo/CommonModalForm';
import CommonSearchForm from '../../../components/Momiolo/CommonSearchForm';
import PageCard from '../../../components/PageCard';
import { getValueByKey } from '@/utils/support';
import { PlusOutlined } from '@ant-design/icons';
import GlobalContext from '../../../layouts/GlobalContext';

const TYPE = [
  { value: '1', label: '即时通知' },
  { value: '2', label: '延时通知' },
  { value: '3', label: '定时通知' },
];
const Notice = (props: any) => {
  const {
    dispatch,
    loading,
    pageData: { list, pagination },
  } = props;
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [formValues, setFormValues] = useState({});
  const { permissions }: any = useContext(GlobalContext);
  useEffect(() => {
    handleSearch();
  }, []);
  const handleSearch = useCallback(() => {
    dispatch({
      type: 'base/getPage',
      payload: { url: '/notice/findByPage', ...formValues },
    });
  }, []);
  const handleDelete = useCallback((sid) => {
    dispatch({
      type: 'base/postData',
      payload: { url: '/notice/delete', sid },
      callback: () => {
        message.success('删除成功');
        handleSearch();
      },
    });
  }, []);
  const searchItems = [
    {
      key: 'title',
      title: '通知标题',
      type: 'input',
    },
    {
      key: 'type',
      title: '通知类型',
      type: 'select',
      selectOptions: TYPE,
    },
  ];
  const formItems = [
    {
      key: 'title',
      title: '通知标题',
      type: 'input',
      rules: [
        { required: true, message: '请输入通知标题' },
        { max: 50, message: '最大字符长度50' },
      ],
    },
    {
      key: 'type',
      title: '通知类型',
      type: 'select',
      rules: [{ required: true, message: '请选择通知类型' }],
      selectOptions: TYPE,
    },
    {
      key: 'content',
      title: '通知内容',
      type: 'textArea',
      rules: [{ max: 500, message: '最大字符长度500' }],
    },
  ];
  const columns = [
    {
      title: '通知标题',
      dataIndex: 'title',
      width: '10%',
      ellipsis: true,
    },
    {
      title: '通知类型',
      dataIndex: 'type',
      width: '10%',
      render: (text: any) => getValueByKey(TYPE, ['value', 'label'], text),
    },
    {
      title: '通知内容',
      dataIndex: 'content',
      width: '30%',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      width: '15%',
    },
    {
      title: '更新时间',
      dataIndex: 'updateDate',
      width: '15%',
    },
    {
      title: '操作',
      dataIndex: '操作',
      render: (text: string, record: any) => {
        const btns = [
          {
            key: 'edit',
            title: '编辑',
            auth: 'notice_update',
            onClick: () => {
              setVisible(true);
              setFormData(record);
            },
          },
          {
            title: '删除',
            key: 'remove',
            auth: 'notice_delete',
            onClick: () => handleDelete(record.sid),
            pop: true,
            message: '是否确认删除？',
          },
        ];
        return <CommonAuth btns={btns} />;
      },
    },
  ];
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    ...pagination,
    showTotal: () => <span>共&nbsp;{pagination === undefined ? 0 : pagination.total}&nbsp;条</span>,
  };
  const tableProps = {
    columns,
    dataSource: list,
    loading,
    rowKey: (record: any) => record.sid,
    pagination: paginationProps,
  };
  return (
    <PageCard>
      <CommonSearchForm
        searchItems={searchItems}
        fetchParams={{ type: 'base/getPage', url: '/notice/findByPage' }}
        saveFormValues={(v: any) => setFormValues({ ...formValues, ...v })}
        handleFormReset={() => setFormValues({})}
      />
      <div style={{ display: 'flex', marginBottom: 12 }}>
        {permissions.includes('notice_create') && (
          <Button type="primary" onClick={() => setVisible(true)}>
            <PlusOutlined />
            新增
          </Button>
        )}
      </div>
      <CommonTable
        fetchParams={{ type: 'base/getPage', url: '/notice/findByPage' }}
        formValues={formValues}
        tableProps={tableProps}
      />
      <CommonModalForm
        visible={visible}
        saveUrl={['/notice/create', '/notice/update']}
        formItems={formItems}
        formData={formData}
        handleCallback={() => handleSearch()}
        handleCancel={() => {
          setVisible(false);
          setFormData({});
        }}
      />
    </PageCard>
  );
};
export default connect(({ loading, base }: any) => ({
  loading: loading.effects['base/getPage'] || loading.effects['base/postData'],
  pageData: base.pageData,
}))(Notice);
