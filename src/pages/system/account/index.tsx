/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { connect } from 'umi';
import { message, Button, Badge, Tag } from 'antd';
import CommonTable from '../../../components/Momiolo/CommonTable';
import CommonAuth from '../../../components/Momiolo/CommonAuth';
import CommonModalForm from '../../../components/Momiolo/CommonModalForm';
import CommonSearchForm from '../../../components/Momiolo/CommonSearchForm';
import PageCard from '../../../components/PageCard';
import { getValueByKey } from '@/utils/support';
import { PlusOutlined } from '@ant-design/icons';
import { isSuccess } from '@/utils/utils';
import GlobalContext from '../../../layouts/GlobalContext';
import md5 from 'md5';

const STATUS = [
  { value: '0', label: '正常' },
  { value: '1', label: '锁定' },
];
const transferTree = (list: any = []) => {
  return list.map((item: any) => {
    const obj: any = {};
    obj.title = item.orgName;
    obj.value = item.sid;
    if (item.orgChildList?.length) {
      obj.children = transferTree(item.orgChildList);
    }
    return obj;
  });
};
const Account = (props: any) => {
  const {
    dispatch,
    loading,
    pageData: { list, pagination },
  } = props;
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [formValues, setFormValues] = useState({});
  const [roleOption, setRoleOption] = useState([]);
  const [orgTree, setOrgTree] = useState<any>([]);
  const { permissions }: any = useContext(GlobalContext);
  useEffect(() => {
    handleSearch();
    getOption();
  }, []);
  const getOption = useCallback(() => {
    // 获取角色选项
    dispatch({
      type: 'base/getDataWithRes',
      payload: { url: '/role/findRoleList' },
      callback: (res: any) => {
        if (isSuccess(res)) {
          setRoleOption(res.data);
        }
      },
    });
    // 获取组织树
    dispatch({
      type: 'base/getDataWithRes',
      payload: { url: '/org/findOrgTree' },
      callback: (res: any) => {
        if (isSuccess(res)) {
          setOrgTree([res.data]);
        }
      },
    });
  }, []);
  const handleSearch = () => {
    dispatch({
      type: 'base/getPage',
      payload: { url: '/account/findByPage', ...formValues },
    });
  };
  const handleDelete = (sid: any) => {
    dispatch({
      type: 'base/postData',
      payload: { url: '/account/delete', sid },
      callback: () => {
        message.success('删除成功');
        handleSearch();
      },
    });
  };
  const handleLock = (sid: any) => {
    dispatch({
      type: 'base/postData',
      payload: { url: '/account/lock', sid },
      callback: () => {
        message.success('锁定成功');
        handleSearch();
      },
    });
  };
  const handleUnlock = (sid: any) => {
    dispatch({
      type: 'base/postData',
      payload: { url: '/account/unlock', sid },
      callback: () => {
        message.success('解锁成功');
        handleSearch();
      },
    });
  };
  const handleReset = (sid: any) => {
    dispatch({
      type: 'base/postData',
      payload: { url: '/account/resetPassword', sid, accountPassword: md5('123456') },
      callback: () => {
        message.success('重置密码成功');
        handleSearch();
      },
    });
  };
  const handleFieldsValue = (values: any) => {
    if (Object.keys(formData).length === 0) {
      values.accountPassword = md5(values.accountPassword);
    }
    return values;
  };
  const mapPropsToFields = (values: any) => {
    values.roleSid = values?.roleSid?.split(',')?.map(Number) || [];
    return values;
  };
  const searchItems = [
    {
      key: 'accountName',
      title: '登陆账号',
      type: 'input',
    },
    {
      key: 'userName',
      title: '账号名称',
      type: 'input',
    },
    {
      key: 'accountStatus',
      title: '账号状态',
      type: 'select',
      selectOptions: STATUS,
    },
    {
      key: 'roleName',
      title: '所属角色',
      type: 'select',
      selectOptions: roleOption,
      keyValue: ['roleName', 'roleName'],
    },
    {
      key: 'orgName',
      title: '所属组织',
      type: 'input',
    },
    {
      key: 'userMobile',
      title: '手机号码',
      type: 'input',
    },
  ];
  const formItems = [
    {
      key: 'accountName',
      title: '登录账号',
      type: 'input',
      rules: [
        { required: true, message: '请输入登录账号' },
        { pattern: /^[0-9A-Za-z]{6,20}$/, message: '账号必须为6-20位数字或字母，区分大小写' },
      ],

      maxLength: 20,
      readOnly: [false, true],
    },
    {
      key: 'accountPassword',
      title: '登录密码',
      type: 'input',
      rules: [
        { required: true, message: '请输入登录密码' },
        { pattern: /^[0-9A-Za-z]{6,12}$/, message: '密码必须为6-12位数字或字母，区分大小写' },
      ],
      maxLength: 12,
      hide: Object.keys(formData).length,
    },
    {
      key: 'orgSid',
      title: '组织',
      type: 'treeSelect',
      rules: [{ required: true, message: '请选择组织' }],
      treeData: transferTree(orgTree),
    },
    {
      key: 'roleSid',
      title: '角色',
      type: 'select',
      mode: 'multiple',
      rules: [{ required: true, message: '请选择角色' }],
      selectOptions: roleOption,
      keyValue: ['sid', 'roleName'],
    },
  ];
  const columns = [
    {
      title: '登录账号',
      dataIndex: 'accountName',
      width: '12%',
    },
    {
      title: '账号名称（昵称）',
      dataIndex: 'userName',
      width: '12%',
    },
    {
      title: '账号状态',
      dataIndex: 'accountStatus',
      width: '10%',
      render: (text: any) => (
        <Badge
          status={text ? 'error' : 'success'}
          text={getValueByKey(STATUS, ['value', 'label'], String(text))}
        />
      ),
    },
    {
      title: '所属角色',
      dataIndex: 'roleName',
      width: '12%',
      render: (text: any) =>
        text
          ? text.split(',').map((item: any, index: number) => (
              <Tag color="purple" key={index} style={{ margin: '6px' }}>
                {item}
              </Tag>
            ))
          : null,
    },
    {
      title: '所属组织',
      dataIndex: 'orgName',
      width: '12%',
      render: (text: any) => (text ? <Tag color="green">{text}</Tag> : null),
    },
    {
      title: '手机号',
      dataIndex: 'userMobile',
      width: '12%',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
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
            auth: 'account_update',
            onClick: () => {
              setVisible(true);
              setFormData(record);
            },
          },
          {
            key: 'lock',
            title: '锁定',
            auth: 'account_lock',
            hide: record.accountStatus === 1,
            onClick: () => {
              handleLock(record.sid);
            },
            pop: true,
            message: '是否确认锁定？',
          },
          {
            key: 'unlock',
            title: '解锁',
            auth: 'account_unlock',
            hide: record.accountStatus === 0,
            onClick: () => {
              handleUnlock(record.sid);
            },
            pop: true,
            message: '是否确认解锁？',
          },
          {
            key: 'reset',
            title: '重置密码',
            auth: 'account_reset',
            onClick: () => handleReset(record.sid),
            pop: true,
            message: '该账号的密码将会被重置为123456，是否确认？',
          },
          {
            title: '删除',
            key: 'remove',
            auth: 'account_delete',
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
        fetchParams={{ type: 'base/getPage', url: '/account/findByPage' }}
        saveFormValues={(v: any) => setFormValues({ ...formValues, ...v })}
        handleFormReset={() => setFormValues({})}
      />
      <div style={{ display: 'flex', marginBottom: 12 }}>
        {permissions.includes('account_create') && (
          <Button type="primary" onClick={() => setVisible(true)}>
            <PlusOutlined />
            新增
          </Button>
        )}
      </div>

      <CommonTable
        fetchParams={{ type: 'base/getPage', url: '/account/findByPage' }}
        formValues={formValues}
        tableProps={tableProps}
      />
      <CommonModalForm
        visible={visible}
        saveUrl={['/account/create', '/account/update']}
        formItems={formItems}
        formData={formData}
        handleCallback={() => handleSearch()}
        handleCancel={() => {
          setVisible(false);
          setFormData({});
        }}
        handleFieldsValue={handleFieldsValue}
        mapPropsToFields={mapPropsToFields}
      />
    </PageCard>
  );
};
export default connect(({ loading, base }: any) => ({
  loading: loading.effects['base/getPage'] || loading.effects['base/postData'],
  pageData: base.pageData,
}))(Account);
