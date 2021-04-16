import React from 'react';
import PageCard from '../../../components/PageCard';
import { Card, Descriptions, Row, Col } from 'antd';
import styles from './index.less';
import SliceUpload from '../../../components/SliceUpload';
import ColorPicker from '../../../components/ColorPicker';
import WaterMark from '../../../components/WaterMark';

const ComponentTest = () => {
  return (
    <PageCard>
      <Card className={styles.card}>
        <Descriptions title="分片上传组件" />
        <SliceUpload />
      </Card>
      <Card className={styles.card}>
        <Descriptions title="拾色器组件" />
        <Row gutter={24}>
          <Col span={8} offset={2} push={2}>
            <ColorPicker type="Sketch" defaultValue={'#2CCCE4'} onChange={(v:any) => console.log(v)}/>
          </Col>
          <Col span={8} offset={2} push={2}>
            <ColorPicker type="Block" defaultValue={'#2CCCE4'} onChange={(v:any) => console.log(v)}/>
          </Col>
        </Row>
      </Card>
      <Card className={styles.card}>
        <Descriptions title="水印组件" />
        <WaterMark >
          <p>这是一段文字</p>
          <p>这是一段文字</p>
          <p>这是一段文字</p>
          <p>这是一段文字</p>
          <p>这是一段文字</p>
          <p>这是一段文字</p>
          <p>这是一段文字</p>
        </WaterMark>
      </Card>
    </PageCard>
  );
};

export default ComponentTest;
