import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import { message, Badge, Button } from 'antd';
import CommonTable from '../../../components/Momiolo/CommonTable';
import CommonAuth from '../../../components/Momiolo/CommonAuth';
import CommonSearchForm from '../../../components/Momiolo/CommonSearchForm';
import PageCard from '../../../components/PageCard';
import { getValueByKey } from '@/utils/support';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';

const STATUS = [
  { value: '0', label: '正常' },
  { value: '1', label: '锁定' },
];
const Role = (props: any) => {
  const {
    dispatch,
    loading,
    pageData: { list, pagination },
  } = props;
  const [formValues, setFormValues] = useState({});
  useEffect(() => {
    handleSearch();
  }, []);
  const handleSearch = useCallback(() => {
    dispatch({
      type: 'base/getPage',
      payload: { url: '/role/findByPage' },
    });
  }, []);
  const handleDelete = useCallback((sid) => {
    dispatch({
      type: 'base/postData',
      payload: { url: '/role/delete', sid },
      callback: (res: any) => {
        message.success('删除成功');
        handleSearch();
      },
    });
  }, []);
  const searchItems = [
    {
      key: 'roleName',
      title: '角色名称',
      type: 'input',
    },
    {
      key: 'roleStatus',
      title: '角色状态',
      type: 'select',
      selectOptions: STATUS,
    },
  ];
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      width: '15%',
    },
    {
      title: '角色简介',
      dataIndex: 'roleDesc',
      width: '25%',
      ellipsis: true,
    },
    {
      title: '角色状态',
      dataIndex: 'roleStatus',
      width: '10%',
      render: (text: any) => (
        <Badge
          status={text ? 'error' : 'success'}
          text={getValueByKey(STATUS, ['value', 'label'], String(text))}
        />
      ),
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
            auth: 'role_update',
            onClick: () =>
              history.push({ pathname: '/system/updateRole', query: { sid: record.sid } }),
          },
          {
            key: 'view',
            title: '查看',
            auth: 'role_view',
            onClick: () =>
              history.push({
                pathname: '/system/role/updateRole',
                query: { sid: record.sid, disabled: true },
              }),
          },
          {
            title: '删除',
            key: 'remove',
            auth: 'role_delete',
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
        fetchParams={{ type: 'base/getPage', url: '/role/findByPage' }}
        saveFormValues={(v: any) => setFormValues({ ...formValues, ...v })}
        handleFormReset={() => setFormValues({})}
      />
      <div style={{ display: 'flex', marginBottom: 12 }}>
        <Button type="primary" onClick={() => history.push('/system/updateRole')}>
          <PlusOutlined />
          新增
        </Button>
      </div>
      <CommonTable
        fetchParams={{ type: 'base/getPage', url: '/role/findByPage' }}
        formValues={formValues}
        tableProps={tableProps}
      />
    </PageCard>
  );
};
export default connect(({ loading, base }: any) => ({
  loading: loading.effects['base/getPage'] || loading.effects['base/postData'],
  pageData: base.pageData,
}))(Role);
