import React, { useContext } from 'react';
import PageCard from '../../../components/PageCard';
import GlobalContext from '../../../layouts/GlobalContext';
import { Row, Col, Card } from 'antd';
import MenuConfig from './components/MenuConfig';

const SuperConfig = (props: any) => {
  const { isSuperAdmin }: any = useContext(GlobalContext);

  return (
    <PageCard>
      <Card style={{ minHeight: 500 }}>
        <Row gutter={24}>
          <Col span={12}/>
          <Col span={12}>
            <MenuConfig isSuperAdmin={isSuperAdmin}/>
          </Col>
        </Row>
      </Card>
    </PageCard>
  );
};
export default SuperConfig;
