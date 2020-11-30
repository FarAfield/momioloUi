import React,{ useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import { Row, Col, Card, Tree } from 'antd';
import PageCard from '../../../components/PageCard';


const { TreeNode } = Tree;
const Org = (props:any) => {
  const { dispatch } = props;
  const [treeList,setTreeList] = useState([]);

  useEffect(() => {
    handleSearch();
  },[]);
  const handleSearch = useCallback(() => {
    dispatch({
      type: 'base/getData',
      payload: {url: '/org/findOrgTree'},
      callback:(res:any) => {
        // @ts-ignore
        setTreeList([res.data]);
      }
    });
  },[]);


  const onSelect = () => {};
  const onExpand = () => {};

  // 构造树节点
  const transferTree = useCallback(() => {
    const loop = (list:any =[]) => {
      return list.map((item:any) => {
        return <TreeNode key={item.sid} title={item.orgName}>{loop(item.orgChildList)}</TreeNode>
      })
    };
    return loop(treeList);
  },[treeList]);


  return (
      <PageCard>
        <Row>
          <Col span={8}>
            <Card bordered={false}>
              <Tree
                onSelect={onSelect}
                onExpand={onExpand} //展开收起节点时触发
                //expandedKeys={expandedKeys} //展开指定的树节点
              >
                {transferTree()}
              </Tree>
            </Card>
          </Col>
          <Col span={16}>
            <Card bordered={false}>

            </Card>
          </Col>
        </Row>
      </PageCard>
  )
};
export default connect(({ loading }:any) => ({
  loading:loading.effects['base/getData'] || loading.effects['base/postData'],
}))(Org)
