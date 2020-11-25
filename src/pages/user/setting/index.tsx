import React,{ useState } from 'react';
import {GridContent} from '@ant-design/pro-layout';
import {Menu} from 'antd';
import BaseView from './components/base';
import SecurityView from './components/security';
import styles from './index.less';

const {Item} = Menu;
const menuMap = [
  { value: "base", label: "基本设置" },
  { value: "security", label: "修改密码" },
  { value: "binding", label: "账号绑定" },
  { value: "notification", label: "新消息通知" },
];
const getRightTitle = (selectKey:string) => {
  const item:any = menuMap.find((item:any) => item.value === selectKey);
  return item.label;
};
const renderChildren = (selectKey:any) => {
  switch (selectKey) {
    case 'base':
      return <BaseView />;
    case "security":
      return <SecurityView />;
    default:
      break;
  }
  return null;
};
const getMenu = () => menuMap.map(item => <Item key={item.value}>{item.label}</Item>);
const Setting = () => {
  const [selectKey, setSelectKey] = useState('base');
  return (
      <GridContent>
        <div className={styles.main}>
          <div className={styles.leftMenu}>
            <Menu
              mode={"inline"}
              selectedKeys={[selectKey]}
              onClick={({key}:any) => setSelectKey(key)}
            >
              {getMenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{getRightTitle(selectKey)}</div>
            {renderChildren(selectKey)}
          </div>
        </div>
      </GridContent>
  )
};
export default Setting;
