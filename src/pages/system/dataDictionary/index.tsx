import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import { message, Button } from 'antd';
import CommonTable from '../../../components/Momiolo/CommonTable';
import CommonAuth from '../../../components/Momiolo/CommonAuth';
import CommonModalForm from '../../../components/Momiolo/CommonModalForm';
import CommonSearchForm from '../../../components/Momiolo/CommonSearchForm';
import PageCard from '../../../components/PageCard';
import { PlusOutlined } from '@ant-design/icons';

const DataDictionary = (props: any) => {
  const {
    dispatch,
    loading,
    pageData: { list, pagination },
  } = props;
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [formValues, setFormValues] = useState({});
  useEffect(() => {
    handleSearch();
  }, []);
  const handleSearch = useCallback(() => {
    dispatch({
      type: 'base/getPage',
      payload: { url: '/dataDictionary/findByPage' },
    });
  }, []);
  const handleDelete = useCallback((sid) => {
    dispatch({
      type: 'base/postData',
      payload: { url: '/dataDictionary/delete', sid },
      callback: (res: any) => {
        message.success('删除成功');
        handleSearch();
      },
    });
  }, []);
  const searchItems = [
    {
      key: 'rootName',
      title: '根名称',
      type: 'input',
    },
    {
      key: 'dictCode',
      title: '数据字典编码',
      type: 'input',
    },
    {
      key: 'dictKey',
      title: '数据字典key',
      type: 'input',
    },
    {
      key: 'dictValue',
      title: '数据字典value',
      type: 'input',
    },
    {
      key: 'dictDesc',
      title: '数据字典描述',
      type: 'input',
    },
  ];
  const formItems = [
    {
      key: 'rootName',
      title: '根名称',
      type: 'input',
      rules: [
        { required: true, message: '请输入根名称' },
        { max: 20, message: '最大字符长度20' },
      ],
      maxLength: 20,
      readOnly: [false, true],
    },
    {
      key: 'dictCode',
      title: '数据字典编码',
      type: 'input',
      rules: [
        { required: true, message: '请输入数据字典编码' },
        { max: 20, message: '最大字符长度20' },
      ],
      maxLength: 20,
      readOnly: [false, true],
    },
    {
      key: 'dictKey',
      title: '数据字典key',
      type: 'input',
      rules: [{ required: true, message: '请输入数据字典key' }],
    },
    {
      key: 'dictValue',
      title: '数据字典value',
      type: 'input',
      rules: [{ required: true, message: '请输入数据字典value' }],
    },
    {
      key: 'dictDesc',
      title: '数据字典描述',
      type: 'textArea',
      rules: [{ max: 200, message: '最大字符长度200' }],
      maxLength: 200,
    },
  ];
  const columns = [
    {
      title: '根名称',
      dataIndex: 'rootName',
      width: '15%',
    },
    {
      title: '数据字典编码',
      dataIndex: 'dictCode',
      width: '15%',
    },
    {
      title: '数据字典key',
      dataIndex: 'dictKey',
      width: '15%',
    },
    {
      title: '数据字典value',
      dataIndex: 'dictValue',
      width: '15%',
    },
    {
      title: '数据字典描述',
      dataIndex: 'dictDesc',
      width: '25%',
    },
    {
      title: '操作',
      dataIndex: '操作',
      render: (text: string, record: any) => {
        const btns = [
          {
            key: 'edit',
            title: '编辑',
            auth: 'dataDictionary_update',
            onClick: () => {
              setVisible(true);
              setFormData(record);
            },
          },
          {
            title: '删除',
            key: 'remove',
            auth: 'dataDictionary_delete',
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
        fetchParams={{ type: 'base/getPage', url: '/dataDictionary/findByPage' }}
        saveFormValues={(v: any) => setFormValues({ ...formValues, ...v })}
        handleFormReset={() => setFormValues({})}
      />
      <div style={{ display: 'flex', marginBottom: 12 }}>
        <Button type="primary" onClick={() => setVisible(true)}>
          <PlusOutlined />
          新增
        </Button>
      </div>
      <CommonTable
        fetchParams={{ type: 'base/getPage', url: '/dataDictionary/findByPage' }}
        formValues={formValues}
        tableProps={tableProps}
      />
      <CommonModalForm
        visible={visible}
        saveUrl={['/dataDictionary/create', '/dataDictionary/update']}
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
}))(DataDictionary);
