import React from 'react';
import { Popconfirm, Button } from 'antd';
import { connect } from 'umi';

const btnProps = (item:any,type:string) => ({
  style:{
    marginRight: type === 'link' ? 0 : 12,
    marginTop: 4,
    marginBottom:4,
  }
});
const simpleButton = (item:any,type:any) => (
    <Button
      ghost
      type={type}
      size={'small'}
      danger={item.key === 'remove'}
      key={item.key}
      onClick={item.onClick}
      disabled={!!item.disabled}
      {...btnProps(item,type)}
    >
      {item.title}
    </Button>
);
const confirmButton = (item:any,type:any) =>(
    <Popconfirm
      key={item.key}
      title={item.message}
      onConfirm={item.onClick}
      disabled={!!item.disabled}
    >
      <Button
        ghost
        type={type}
        size={'small'}
        danger={item.key === 'remove'}
        disabled={!!item.disabled}
        {...btnProps(item,type)}
      >
        {item.title}
      </Button>
    </Popconfirm>
);

const CommonAuth = (props:any) => {
  const { btns, permissions, type } = props;
  const authBtns = btns.filter((item:any) => !permissions.includes(item.auth)).filter((i:any) => !i.hide);
  return authBtns.map((item:any) => !!item['pop'] ? confirmButton(item,type) : simpleButton(item,type));
};
CommonAuth.defaultProps={
  type:'primary'
};
export default connect(({ login }:any) => ({
  permissions:login.permissions
}))(CommonAuth)
/**
 *      btns【】数组       type【link】展示为a标签
 *      key    唯一标识    key若为remove，则添加danger样式
 *      title  名称
 *      auth   权限
 *      onClick  点击事件
 *      disabled？  是否禁用
 *      hide？  是否隐藏
 *      pop？  是否二次确认
 *      message？ 二次确认信息
 */
