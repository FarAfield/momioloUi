import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import { message, Button, Row, Col, Spin, Card, Form, Input, Radio, Tree, Tag } from 'antd';
import { useUnmount } from 'ahooks';
import PageCard from '../../../components/PageCard';
import { history } from 'umi';
import { CloseOutlined, CheckOutlined, RollbackOutlined } from '@ant-design/icons';
import styles from './index.less';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const TreeNode = Tree.TreeNode;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const TYPE = {
  1: { value: '菜单', color: '#1890ff' },
  2: { value: '页面', color: '#f5222d' },
  3: { value: '按钮', color: '#52c41a' },
};
const UpdateRole = (props: any) => {
  const [form] = Form.useForm();
  const {
    location: { query },
    loading,
    dispatch,
  } = props;
  const [menuData, setMenuData] = useState([]); // 全部的菜单数据
  const [checkedKeys, setCheckedKeys] = useState([]); // 选中的节点（全选）
  const [checked, setChecked] = useState<any>([]); // 所有被选中的节点（全选以及半选）
  const [disabled, setDisabled] = useState(false); // 是否处于查看

  useEffect(() => {
    searchMenuData();
    // 编辑
    if (query?.sid) {
      findDetail(query.sid);
    } else {
      // 新增时组装面包屑
      dispatch({
        type: 'global/update',
        payload: {
          breadcrumbData: [
            {
              path: '/',
              breadcrumbName: '首页',
            },
            {
              path: '/system',
              breadcrumbName: '系统管理',
            },
            {
              path: '/updateRole',
              breadcrumbName: '角色新增',
            },
          ],
        },
      });
    }
    // 查看
    if (query.disabled) {
      setDisabled(true);
    }
  }, []);

  useUnmount(() => {
    dispatch({
      type: 'global/update',
      payload: {
        breadcrumbData: [],
      },
    });
  });

  const searchMenuData = useCallback(() => {
    dispatch({
      type: 'base/getData',
      payload: { url: '/resource/findCurrentMenu' },
      callback: (res: any) => {
        setMenuData(res.data?.children || []);
      },
    });
  }, []);
  const findDetail = useCallback((sid: any) => {
    dispatch({
      type: 'base/getData',
      payload: { url: '/role/findDetail', sid },
      callback: (res: any) => {
        form.setFieldsValue({ ...res.data?.role });
        setCheckedKeys(res.data.checked?.map(String));
        setChecked((res.data.checked || []).concat(res.data.halfChecked || []));
      },
    });
  }, []);

  const onFinish = (values: any) => {
    dispatch({
      type: 'base/postData',
      payload: {
        url: query?.sid ? '/role/update' : '/role/create',
        ...values,
        resourceSids: checked,
        sid: query?.sid,
      },
      callback: (res: any) => {
        message.success(query?.sid ? '编辑成功' : '新增成功');
        history.goBack();
      },
    });
  };
  const renderTreeNodes = (data: any) => {
    return data.map((item: any) => {
      if (item?.children?.length || item?.buttonChildren?.length) {
        return (
          <TreeNode
            key={item.sid}
            title={
              <span>
                <Tag color={TYPE[item.resourceType]['color']}>
                  {TYPE[item.resourceType]['value']}
                </Tag>
                {item.resourceName}
              </span>
            }
          >
            {renderTreeNodes(item.children || item.buttonChildren)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.sid}
          title={
            <span>
              <Tag color={TYPE[item.resourceType]['color']}>{TYPE[item.resourceType]['value']}</Tag>
              {item.resourceName}
            </span>
          }
        />
      );
    });
  };
  const onCheck = (checkedKeys: any, e: any) => {
    setChecked([...new Set(checkedKeys.concat(e.halfCheckedKeys))]);
    setCheckedKeys(checkedKeys);
  };
  return (
    <PageCard>
      <Spin spinning={false}>
        <Row gutter={24}>
          <Col span={8}>
            <Card bordered={false} title={<h3>基本信息</h3>}>
              <Form form={form} onFinish={onFinish} {...formItemLayout}>
                <FormItem
                  name={'roleName'}
                  label={'角色名称'}
                  rules={[{ required: true, message: '请输入角色名称' }]}
                >
                  <Input
                    disabled={disabled}
                    allowClear
                    placeholder={'请输入角色名称'}
                    maxLength={20}
                  />
                </FormItem>
                <FormItem
                  name={'roleStatus'}
                  label={'状态'}
                  rules={[{ required: true, message: '请选择角色状态' }]}
                >
                  <Radio.Group disabled={disabled}>
                    <Radio value={0}>{'正常'}</Radio>
                    <Radio value={1}>{'锁定'}</Radio>
                  </Radio.Group>
                </FormItem>
                <FormItem
                  name={'roleDesc'}
                  label={'角色说明'}
                  rules={[{ required: true, message: '请输入角色说明' }]}
                >
                  <TextArea
                    disabled={disabled}
                    allowClear
                    placeholder={'请输入角色说明'}
                    maxLength={200}
                    rows={4}
                  />
                </FormItem>
                <FormItem>
                  <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '30%' }}>
                    {disabled ? (
                      <Button onClick={() => history.goBack()}>
                        <RollbackOutlined />
                        {'返回'}
                      </Button>
                    ) : (
                      <>
                        <Button onClick={() => history.goBack()} style={{ marginRight: 12 }}>
                          <CloseOutlined />
                          {'取消'}
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                          <CheckOutlined />
                          {'保存'}
                        </Button>
                      </>
                    )}
                  </div>
                </FormItem>
              </Form>
            </Card>
          </Col>
          <Col span={16}>
            <Card bordered={false} title={<h3>权限配置</h3>}>
              <Tree
                disabled={disabled}
                className={styles.tree}
                checkable={true}
                checkedKeys={checkedKeys}
                onCheck={(checkedKeys: any, e: any) => onCheck(checkedKeys, e)}
              >
                {renderTreeNodes(menuData)}
              </Tree>
            </Card>
          </Col>
        </Row>
      </Spin>
    </PageCard>
  );
};
export default connect(({ loading }: any) => ({
  loading: loading.effects['base/getData'] || loading.effects['base/postData'],
}))(UpdateRole);
