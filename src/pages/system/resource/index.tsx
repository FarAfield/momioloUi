/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'umi';
import { Tag, message, Popconfirm, Button } from 'antd';
import CommonTable from '../../../components/Momiolo/CommonTable';
import CommonAuth from '../../../components/Momiolo/CommonAuth';
import CommonModalForm from '../../../components/Momiolo/CommonModalForm';
import PageCard from '../../../components/PageCard';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import GlobalContext from '../../../layouts/GlobalContext';

const TYPE = [
  { value: 1, label: '菜单' },
  { value: 2, label: '路由' },
  { value: 3, label: '按钮' },
];

// eslint-disable-next-line consistent-return
const getType = (record: any) => {
  if (record.resourceType === 1) {
    // 不存在菜单/路由/按钮
    if (!record?.children?.length && !record?.buttonChildren?.length) {
      return TYPE;
    }
    // 存在菜单/路由
    if (record?.children?.length && !record?.buttonChildren?.length) {
      return TYPE.slice(0, 2);
    }
    // 存在按钮
    if (!record?.children?.length && record?.buttonChildren?.length) {
      return TYPE.slice(2, 3);
    }
    return [];
  } else if (record.resourceType === 2) {
    return TYPE.slice(2, 3);
  } else {
    return [];
  }
};
const Resource = (props: any) => {
  const { dispatch, loading } = props;
  const [list, setList] = useState<any[]>([]); // 列表
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({});
  // 新增时上级资源下拉选项   新增/编辑时资源类型下拉   新增时上级资源初始值
  const [configData, setConfigData] = useState<any>({
    resourceParentOptions: [],
    resourceTypeOptions: [],
    initialValues: {},
  });
  const [resourceType, setResourceType] = useState(undefined);
  const { permissions }: any = useContext(GlobalContext);

  useEffect(() => {
    handleSearch();
  }, []);
  const handleSearch = () => {
    dispatch({
      type: 'base/getData',
      payload: { url: '/resource/findMenuTree' },
      callback: (res: any) => {
        setList(res.data);
      },
    });
  };
  const handleDelete = (sid: any) => {
    dispatch({
      type: 'base/postData',
      payload: { url: '/resource/delete', sid },
      callback: () => {
        message.success('删除成功');
        handleSearch();
      },
    });
  };
  const handleMove = (sid: number, type: 'up' | 'down') => {
    dispatch({
      type: 'base/postData',
      payload: { url: '/resource/move', sid, type },
      callback: () => {
        message.success(type === 'up' ? '上移成功' : '下移成功');
        handleSearch();
      },
    });
  };
  const formItems = [
    {
      key: 'resourceParentSid',
      title: '资源上级',
      type: 'select',
      rules: [{ required: true }],
      readOnly: [true, true],
      selectOptions: configData.resourceParentOptions,
      hide: Object.keys(formData).length,
    },
    {
      key: 'resourceName',
      title: '资源名称',
      type: 'input',
      rules: [
        { required: true, message: '请输入资源名称' },
        { max: 10, message: '最大字符长度10' },
      ],
      maxLength: 10,
    },
    {
      key: 'resourceCode',
      title: '资源编码',
      type: 'input',
      rules: [
        { required: true, message: '请输入资源编码' },
        { max: 45, message: '最大字符长度45' },
      ],
      readOnly: [false, true],
      maxLength: 45,
    },
    {
      key: 'resourceType',
      title: '资源类型',
      type: 'select',
      rules: [{ required: true, message: '请选择资源类型' }],
      readOnly: [false, true],
      selectOptions: configData.resourceTypeOptions,
      onSelectChange: (v: any) => setResourceType(v),
    },
    {
      key: 'resourceIcon',
      title: '资源图标',
      type: 'input',
      rules: [{ max: 20, message: '最大字符长度20' }],
      hide: resourceType === 3 || resourceType === 2,
      maxLength: 20,
    },
  ];
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'resourceName',
      width: '30%',
      render: (text: string, record: any) => {
        switch (record.resourceType) {
          case 1:
            return (
              <span>
                <Tag color="processing">菜单</Tag>
                {text}
              </span>
            );
          case 2:
            return (
              <span>
                <Tag color="error">路由</Tag>
                {text}
              </span>
            );
          default:
            return null;
        }
      },
    },
    {
      title: '下级功能清单',
      dataIndex: 'resourceType',
      width: '50%',
      render: (text: string, record: any) => {
        if (record.children && record.children.length) {
          return record.children.map((item: any) => (
            <Tag key={item.sid} color="warning" style={{ margin: 6 }}>
              {item.resourceName}
            </Tag>
          ));
        }
        if (record.buttonChildren && record.buttonChildren.length) {
          return record.buttonChildren.map((item: any) => (
            <Tag
              style={{ margin: 6 }}
              color="success"
              key={item.sid}
              closable={permissions.includes('resource_delete')}
              onClose={(e) => e.preventDefault()}
              closeIcon={
                <Popconfirm title={'是否确认删除'} onConfirm={() => handleDelete(item.sid)}>
                  <CloseOutlined />
                </Popconfirm>
              }
            >
              {item.resourceName}
            </Tag>
          ));
        }
        return null;
      },
    },
    {
      title: '操作',
      dataIndex: '操作',
      render: (text: string, record: any) => {
        const btns = [
          {
            key: 'add',
            title: '新增',
            auth: 'resource_create',
            hide: record.resourceType === 3,
            onClick: () => {
              setVisible(true);
              setConfigData({
                resourceParentOptions: [{ value: record.sid, label: record.resourceName }],
                resourceTypeOptions: getType(record),
                initialValues: { resourceParentSid: record.sid },
              });
            },
          },
          {
            key: 'edit',
            title: '编辑',
            auth: 'resource_update',
            onClick: () => {
              setVisible(true);
              setFormData(record);
              setConfigData({
                ...configData,
                resourceTypeOptions: TYPE,
              });
            },
          },
          {
            title: '上移',
            key: 'up',
            auth: 'resource_move',
            onClick: () => handleMove(record.sid, 'up'),
            pop: true,
            message: '是否确定上移？',
            hide: !record.showUp,
          },
          {
            title: '下移',
            key: 'down',
            auth: 'resource_move',
            onClick: () => handleMove(record.sid, 'down'),
            pop: true,
            message: '是否确定下移？',
            hide: !record.showDown,
          },
          {
            title: '删除',
            key: 'remove',
            auth: 'resource_delete',
            onClick: () => handleDelete(record.sid),
            pop: true,
            message: '是否确认删除？',
          },
        ];
        return <CommonAuth btns={btns} />;
      },
    },
  ];
  const footer = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Button
        ghost
        type={'primary'}
        onClick={() => {
          setVisible(true);
          setConfigData({
            resourceParentOptions: [{ value: list?.[0]?.resourceParentSid, label: '根资源' }],
            resourceTypeOptions: TYPE.slice(0, 1),
            initialValues: { resourceParentSid: list?.[0]?.resourceParentSid },
          });
        }}
      >
        <PlusOutlined />
        新增一级菜单
      </Button>
    </div>
  );
  const tableProps = {
    columns,
    dataSource: list,
    loading,
    rowKey: (record: any) => record.sid,
    pagination: false,
    footer: () => (permissions.includes('resource_create') ? footer : null),
  };
  return (
    <PageCard>
      <CommonTable tableProps={tableProps} />
      <CommonModalForm
        visible={visible}
        saveUrl={['/resource/create', '/resource/update']}
        formItems={formItems}
        formData={formData}
        initialValues={configData.initialValues}
        handleCallback={() => handleSearch()}
        handleCancel={() => {
          setVisible(false);
          setFormData({});
          setResourceType(undefined);
        }}
      />
    </PageCard>
  );
};
export default connect(({ loading }: any) => ({
  loading: loading.effects['base/getData'] || loading.effects['base/postData'],
}))(Resource);
