import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import { Badge } from 'antd';
import CommonTable from '../../../components/Momiolo/CommonTable';
import CommonSearchForm from '../../../components/Momiolo/CommonSearchForm';
import PageCard from '../../../components/PageCard';
import ContentModal from './ContentModal';
import dayjs from 'dayjs';

const HandleLog = (props: any) => {
  const {
    dispatch,
    loading,
    pageData: { list, pagination },
  } = props;
  const [formValues, setFormValues] = useState({});
  const [contentConfig, setContentConfig] = useState({ title: '', visible: false, text: {} });
  useEffect(() => {
    handleSearch();
  }, []);
  const handleSearch = useCallback(() => {
    dispatch({
      type: 'base/getPage',
      payload: { url: '/handleLog/findByPage' },
    });
  }, []);
  const handleDetailParams = useCallback((text: any) => {
    setContentConfig({ title: '操作入参详细信息', visible: true, text });
  }, []);
  const handleDetailResult = useCallback((text: any) => {
    setContentConfig({ title: '操作返回详细信息', visible: true, text });
  }, []);
  const handleFieldsValue = (values: any) => {
    if (values?.handleDateRange?.length) {
      values.startTime = dayjs(values.handleDateRange[0]).format('YYYY-MM-DD HH:mm:ss');
      values.endTime = dayjs(values.handleDateRange[1]).format('YYYY-MM-DD HH:mm:ss');
      delete values.handleDateRange;
    }
    return values;
  };
  const searchItems = [
    {
      title: '操作账号',
      type: 'input',
      key: 'accountName',
    },
    {
      title: '操作模块',
      type: 'input',
      key: 'handleModule',
    },
    {
      title: '操作方法',
      type: 'input',
      key: 'handleMethod',
    },
    {
      title: '操作结果',
      type: 'select',
      key: 'handleResult',
      selectOptions: [
        { value: '0', label: '成功' },
        { value: '1', label: '失败' },
        { value: '2', label: '异常' },
      ],
    },
    {
      title: '操作入参',
      type: 'input',
      key: 'handleParams',
    },
    {
      type: 'blank',
      key: 'blank1',
      span: 8,
    },
    {
      title: '操作时间',
      type: 'rangePicker',
      key: 'handleDateRange',
      span: 12,
      showTime:true,
    },
    {
      type: 'blank',
      key: 'blank2',
      span: 4,
    },
  ];
  const columns = [
    {
      title: '序号',
      dataIndex: 'no',
      width: '8%',
      render: (text: any, record: any, index: number) => {
        return index + 1 + (pagination.current - 1) * pagination.pageSize;
      },
    },
    {
      title: '操作账号',
      dataIndex: 'accountName',
      width: '8%',
    },
    {
      title: '操作模块',
      dataIndex: 'handleModule',
      width: '8%',
    },
    {
      title: '操作方法',
      dataIndex: 'handleMethod',
      width: '10%',
    },
    {
      title: '操作结果',
      dataIndex: 'handleResult',
      width: '8%',
      render: (text: any) => {
        switch (text) {
          case 0:
            return <Badge status="success" text="成功" />;
          case 1:
            return <Badge status="warning" text="失败" />;
          case 2:
            return <Badge status="error" text="异常" />;
          default:
            return <Badge status="default" text="未知" />;
        }
      },
    },
    {
      title: '操作入参',
      dataIndex: 'handleParams',
      width: '12%',
      ellipsis: true,
      render: (text: any) => <a onClick={() => handleDetailParams(text)}>{text}</a>,
    },
    {
      title: '操作返回',
      dataIndex: 'handleResponse',
      width: '12%',
      ellipsis: true,
      render: (text: any) => <a onClick={() => handleDetailResult(text)}>{text}</a>,
    },
    {
      title: '操作异常',
      width: '8%',
      dataIndex: 'handleException',
      ellipsis: true,
    },
    {
      title: '操作IP',
      width: '10%',
      dataIndex: 'handleIp',
      ellipsis: true,
    },
    {
      title: '操作时间',
      width: '16%',
      dataIndex: 'handleDate',
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
        fetchParams={{ type: 'base/getPage', url: '/handleLog/findByPage' }}
        saveFormValues={(v: any) => setFormValues({ ...formValues, ...v })}
        handleFormReset={() => setFormValues({})}
        handleFieldsValue={handleFieldsValue}
      />
      <CommonTable
        fetchParams={{ type: 'base/getPage', url: '/handleLog/findByPage' }}
        formValues={formValues}
        tableProps={tableProps}
      />
      <ContentModal
        title={contentConfig.title}
        visible={contentConfig.visible}
        text={contentConfig.text}
        onCancel={() => setContentConfig({ title: '', visible: false, text: {} })}
      />
    </PageCard>
  );
};
export default connect(({ loading, base }: any) => ({
  loading: loading.effects['base/getPage'],
  pageData: base.pageData,
}))(HandleLog);
