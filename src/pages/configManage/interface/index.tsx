/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { connect } from 'umi';
import { message, Badge, Button } from 'antd';
import CommonTable from '../../../components/Momiolo/CommonTable';
import CommonAuth from '../../../components/Momiolo/CommonAuth';
import CommonSearchForm from '../../../components/Momiolo/CommonSearchForm';
import PageCard from '../../../components/PageCard';
import { getValueByKey } from '@/utils/support';
import { PlusOutlined, NodeExpandOutlined } from '@ant-design/icons';
import { history } from 'umi';
import GlobalContext from '../../../layouts/GlobalContext';

const InterfacePro = (props: any) => {
  const {
    dispatch,
    loading,
    pageData: { list, pagination },
  } = props;
  const [formValues, setFormValues] = useState({});
  const { permissions }: any = useContext(GlobalContext);
  useEffect(() => {
    handleSearch();
  }, []);
  const handleSearch = useCallback(() => {
    dispatch({
      type: 'base/getPage',
      payload: { url: '/interface/findByPage', ...formValues },
    });
  }, []);
  const handleDelete = useCallback((sid: any) => {
    dispatch({
      type: 'base/postData',
      payload: { url: '/interface/delete', sid },
      callback: () => {
        message.success('删除成功');
        handleSearch();
      },
    });
  }, []);
  const searchItems = [
    {
      key: 'name',
      title: '接口名称',
      type: 'input',
    },
    {
      key: 'path',
      title: '接口路径',
      type: 'input',
    },
    {
      key: 'methods',
      title: '请求方式',
      type: 'select',
      selectOptions: [
        {
          value: 'get',
          label: 'GET',
        },
        {
          value: 'post',
          label: 'POST',
        },
        {
          value: 'put',
          label: 'PUT',
        },
        {
          value: 'delete',
          label: 'DELETE',
        },
      ],
    },
    {
      key: 'isPaging',
      title: '是否分页',
      type: 'select',
      selectOptions: [
        {
          value: '0',
          label: '是',
        },
        {
          value: '1',
          label: '否',
        },
      ],
    },
  ];
  const columns = [
    {
      title: '接口名称',
      dataIndex: 'name',
      width: '15%',
    },
    {
      title: '接口路径',
      dataIndex: 'path',
      width: '15%',
    },
    {
      title: '接口描述',
      dataIndex: 'description',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '请求方式',
      dataIndex: 'methods',
      width: '10%',
      render: (text: any) =>
        getValueByKey(
          [
            {
              value: 'get',
              label: 'GET',
            },
            {
              value: 'post',
              label: 'POST',
            },
            {
              value: 'put',
              label: 'PUT',
            },
            {
              value: 'delete',
              label: 'DELETE',
            },
          ],
          ['value', 'label'],
          text,
        ),
    },
    {
      title: '是否分页',
      dataIndex: 'isPaging',
      width: '10%',
      render: (text: any) => (
        <Badge
          status={text ? 'error' : 'success'}
          text={getValueByKey(
            [
              {
                value: '0',
                label: '是',
              },
              {
                value: '1',
                label: '否',
              },
            ],
            ['value', 'label'],
            String(text),
          )}
        />
      ),
    },
    {
      title: '延时',
      dataIndex: 'delay',
      width: '10%',
      render: (text: any) => `${text  }s`,
    },
    {
      title: '操作',
      dataIndex: '操作',
      render: (text: string, record: any) => {
        const btns = [
          {
            key: 'edit',
            title: '编辑',
            auth: 'interface_update',
            onClick: () =>
              history.push({
                pathname: '/configManage/updateInterface',
                query: { sid: record.sid },
              }),
          },
          {
            key: 'debug',
            title: '调试',
            auth: 'interface_debug',
            onClick: () =>
              history.push({
                pathname: '/configManage/debugInterface',
                query: { sid: record.sid },
              }),
          },
          {
            title: '删除',
            key: 'remove',
            auth: 'interface_delete',
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
        fetchParams={{ type: 'base/getPage', url: '/interface/findByPage' }}
        saveFormValues={(v: any) => setFormValues({ ...formValues, ...v })}
        handleFormReset={() => setFormValues({})}
      />
      <div style={{ display: 'flex', marginBottom: 12 }}>
        {permissions.includes('interface_create') && (
          <Button type="primary" onClick={() => history.push('/configManage/updateInterface')}>
            <PlusOutlined />
            新增
          </Button>
        )}
        {permissions.includes('interface_format') && (
          <Button
            type="primary"
            onClick={() => history.push('/configManage/formatInterface')}
            style={{ marginLeft: 24 }}
          >
            <NodeExpandOutlined />
            数据格式化
          </Button>
        )}
      </div>
      <CommonTable
        fetchParams={{ type: 'base/getPage', url: '/interface/findByPage' }}
        formValues={formValues}
        tableProps={tableProps}
      />
    </PageCard>
  );
};
export default connect(({ loading, base }: any) => ({
  loading: loading.effects['base/getPage'],
  pageData: base.pageData,
}))(InterfacePro);
