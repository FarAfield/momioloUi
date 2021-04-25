/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import { Row, Col, Card, Tree, message, Descriptions, Spin } from 'antd';
import PageCard from '../../../components/PageCard';
import CommonModalForm from '../../../components/Momiolo/CommonModalForm';
import CommonAuth from '../../../components/Momiolo/CommonAuth';
import { isSuccess } from '@/utils/utils';
import { getValueByKey } from '@/utils/support';

const TYPE = [
  { value: 'SysAdmin', label: '超级管理员' },
  { value: 'Admin', label: '管理员' },
  { value: 'User', label: '用户' },
  { value: 'Guest', label: '访客' },
];
const { TreeNode } = Tree;
const DescriptionItem = Descriptions.Item;
const Org = (props: any) => {
  const { dispatch, loading, detailLoading } = props;
  const [treeList, setTreeList] = useState<any>([]);
  const [record, setRecord] = useState<any>({}); // 树选择
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [configData, setConfigData] = useState<any>({ orgParentOptions: [], initialValues: {} });
  useEffect(() => {
    handleSearch();
  }, []);
  const handleSearch = useCallback(() => {
    dispatch({
      type: 'base/getData',
      payload: { url: '/org/findOrgTree' },
      callback: (res: any) => {
        setTreeList([res.data]);
      },
    });
  }, []);
  const handleDelete = useCallback((sid) => {
    dispatch({
      type: 'base/postData',
      payload: { url: '/org/delete', sid },
      callback: () => {
        message.success('删除成功');
        handleSearch();
        setRecord({});
      },
    });
  }, []);

  const onSelect = (selectedKeys: any[]) => {
    if (selectedKeys.length === 1) {
      dispatch({
        type: 'base/getDataWithRes',
        payload: { url: '/org/findDetail', sid: selectedKeys[0] },
        callback: (res: any) => {
          if (isSuccess(res)) {
            setRecord(res.data);
          }
        },
      });
    } else {
      setRecord({});
    }
  };
  // 构造树节点
  const transferTree = useCallback(() => {
    const loop = (list: any = []) => {
      return list.map((item: any) => {
        return (
          <TreeNode key={item.sid} title={item.orgName}>
            {loop(item.orgChildList)}
          </TreeNode>
        );
      });
    };
    return loop(treeList);
  }, [treeList]);

  const formItems = [
    {
      key: 'orgParentSid',
      title: '所属上级',
      type: 'select',
      rules: [{ required: true, message: '请输入所属上级' }],
      readOnly: [true, true],
      selectOptions: configData.orgParentOptions,
    },
    {
      key: 'orgName',
      title: '组织名称',
      type: 'input',
      rules: [
        { required: true, message: '请输入组织名称' },
        { max: 20, message: '最大字符长度20' },
      ],
      maxLength: 20,
    },
    {
      key: 'orgType',
      title: '组织类型',
      type: 'select',
      rules: [{ required: true, message: '请选择组织类型' }],
      selectOptions: TYPE,
    },
    {
      key: 'orgCode',
      title: '组织编码',
      type: 'input',
      rules: [
        { required: true, message: '请输入组织编码' },
        { message: '由数字、26个英文字母或者下划线组成的2-20位字符!', pattern: /^[\w]{2,20}$/ },
      ],
    },
    {
      key: 'orgDesc',
      title: '组织简介',
      type: 'textArea',
      rules: [{ max: 200, message: '最大字符长度200' }],
      maxLength: 200,
    },
  ];
  const renderHead = () => {
    const btns = [
      {
        key: 'add',
        title: '新增',
        auth: 'org_create',
        onClick: () => {
          setVisible(true);
          setConfigData({
            orgParentOptions: [{ value: record.sid, label: record.orgName }],
            initialValues: { orgParentSid: record.sid },
          });
        },
        hide: !record.sid,
      },
      {
        key: 'edit',
        title: '编辑',
        auth: 'org_update',
        hide: !record.sid || record.orgCode === 'root',
        onClick: () => {
          setVisible(true);
          setFormData(record);
          setConfigData({
            orgParentOptions: [{ value: record.orgParentSid, label: record.orgParentName }],
            initialValues: { orgParentSid: record.orgParentSid },
          });
        },
      },
      {
        title: '删除',
        key: 'remove',
        auth: 'org_delete',
        onClick: () => handleDelete(record.sid),
        pop: true,
        message: '是否确认删除？',
        hide: !record.sid || record.orgCode === 'root',
      },
    ];
    return (
      <div style={{ height: 32, width: '100%', marginLeft: 18 }}>
        <CommonAuth btns={btns} type={'link'} />
      </div>
    );
  };
  return (
    <PageCard>
      <Row>
        <Col span={8}>
          <Card bordered={false} style={{ height: 600 }}>
            <Spin spinning={loading === true}>
              <p style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 0 }}>组织管理</p>
              {renderHead()}
              <Tree onSelect={onSelect}>{transferTree()}</Tree>
            </Spin>
          </Card>
        </Col>
        <Col span={16}>
          <Card bordered={false}>
            <Spin spinning={detailLoading === true}>
              <Descriptions title="组织信息">
                <DescriptionItem span={3} label="组织名称">
                  {record.orgName}
                </DescriptionItem>
                <DescriptionItem span={3} label="组织类型">
                  {getValueByKey(TYPE, ['value', 'label'], record.orgType)}
                </DescriptionItem>
                <DescriptionItem span={3} label="组织编码">
                  {record.orgCode}
                </DescriptionItem>
                <DescriptionItem span={3} label="组织简介">
                  {record.orgDesc}
                </DescriptionItem>
              </Descriptions>
            </Spin>
          </Card>
        </Col>
      </Row>
      <CommonModalForm
        visible={visible}
        initialValues={configData.initialValues}
        saveUrl={['/org/create', '/org/update']}
        formItems={formItems}
        formData={formData}
        handleCallback={() => {
          handleSearch();
          onSelect([record.sid]);
        }}
        handleCancel={() => {
          setVisible(false);
          setFormData({});
        }}
      />
    </PageCard>
  );
};
export default connect(({ loading }: any) => ({
  loading: loading.effects['base/getData'] || loading.effects['base/postData'],
  detailLoading: loading.effects['base/getDataWithRes'],
}))(Org);
