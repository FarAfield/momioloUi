import React, { useState, useEffect, useCallback } from 'react';
import { Tree, Tag, Spin, Switch, message } from 'antd';
import { connect } from 'umi';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import styles from './index.less';

const TreeNode = Tree.TreeNode;
const TYPE = {
  1: { value: '菜单', color: '#1890ff' },
  2: { value: '页面', color: '#f5222d' },
  3: { value: '按钮', color: '#52c41a' },
};
const MenuConfig = (props: any) => {
  const { dispatch } = props;
  const [menuData, setMenuData] = useState([]); // 全部的菜单数据

  useEffect(() => {
    searchMenuData();
  }, []);
  const searchMenuData = useCallback(() => {
    dispatch({
      type: 'base/getData',
      payload: { url: '/resource/findMenuTree' },
      callback: (res: any) => {
        setMenuData(res.data || []);
      },
    });
  }, []);
  const onChange = (checked: any, e: any, sid: any) => {
    e.stopPropagation();
    message.info('敬请期待!');
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
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  defaultChecked={item.sysRoot === 'N'}
                  onChange={(checked, event) => onChange(checked, event, item.sid)}
                />
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
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked={item.sysRoot === 'N'}
                onChange={(checked, event) => onChange(checked, event, item.sid)}
              />
            </span>
          }
        />
      );
    });
  };
  return (
    <Spin spinning={false}>
      <Tree className={styles.tree} selectable={false}>
        {renderTreeNodes(menuData)}
      </Tree>
    </Spin>
  );
};
export default connect(({ loading }: any) => ({
  loading: loading.effects['base/getData'],
}))(MenuConfig);
