import React, { useState } from 'react';
import PageCard from '../../../components/PageCard';
import { Card, Descriptions, Row, Col, Checkbox } from 'antd';
import styles from './index.less';
import SliceUpload from '../../../components/SliceUpload';
import ColorPicker from '../../../components/ColorPicker';
import WaterMark from '../../../components/WaterMark';
import MonacoEditor from '../../../components/MonacoEditor';
import HighLightKeyword from '../../../components/HighLightKeyword';

const defaultList = [
  { key: 'sliceUpload', value: '分片上传组件' },
  { key: 'colorPicker', value: '拾色器组件' },
  { key: 'waterMark', value: '水印组件' },
  { key: 'monacoEditor', value: '代码编辑器组件' },
  { key: 'highLightKeyword', value: '关键词高亮组件' },
];

const ComponentList = () => {
  const [keyArr, setKeyArr] = useState(defaultList.map((i) => i.key));
  const isHidden = (key: any) => {
    return !keyArr.includes(key);
  };
  return (
    <PageCard>
      <Card className={styles.card}>
        <Descriptions title="组件列表" />
        <Checkbox.Group
          style={{ width: '100%' }}
          onChange={(value: any) => setKeyArr(value)}
          value={keyArr}
        >
          <Row gutter={24}>
            {defaultList.map((item: any, index: number) => {
              return (
                <Col span={6} key={index}>
                  <Checkbox value={item.key}>{item.value}</Checkbox>
                </Col>
              );
            })}
          </Row>
        </Checkbox.Group>
      </Card>
      <Card className={`${styles.card} ${isHidden('sliceUpload') ? styles.hidden : ''}`}>
        <Descriptions title="分片上传组件" />
        <SliceUpload />
      </Card>
      <Card className={`${styles.card} ${isHidden('colorPicker') ? styles.hidden : ''}`}>
        <Descriptions title="拾色器组件" />
        <Row gutter={24}>
          <Col span={8} offset={2} push={2}>
            <ColorPicker
              type="Sketch"
              defaultValue={'#2CCCE4'}
              onChange={(v: any) => console.log(v)}
            />
          </Col>
          <Col span={8} offset={2} push={2}>
            <ColorPicker
              type="Block"
              defaultValue={'#2CCCE4'}
              onChange={(v: any) => console.log(v)}
            />
          </Col>
        </Row>
      </Card>
      <Card className={`${styles.card} ${isHidden('waterMark') ? styles.hidden : ''}`}>
        <Descriptions title="水印组件" />
        <WaterMark>
          <div className={styles.center}>
            <p>枫桥叶泊</p>
            <p>月落乌啼霜满天，</p>
            <p>江枫渔火对愁眠。</p>
            <p>姑苏城外寒山寺，</p>
            <p>夜半钟声到客船。</p>
            <p>毕竟西湖六月中，风光不与四时同。接天莲叶无穷碧，映日荷花别样红。</p>
            <p>去年今日此门中，人面桃花相映红。人面不知何处去，桃花依旧笑春风。</p>
          </div>
        </WaterMark>
      </Card>
      <Card className={`${styles.card} ${isHidden('monacoEditor') ? styles.hidden : ''}`}>
        <Descriptions title="代码编辑器组件（当前语言JavaScript）" />
        <div className={styles.center}>
          <MonacoEditor
            width={'50%'}
            language={'javascript'}
            onChange={(v: any) => console.log(v)}
          />
        </div>
      </Card>
      <Card className={`${styles.card} ${isHidden('highLightKeyword') ? styles.hidden : ''}`}>
        <Descriptions title="关键词高亮组件" />
        <HighLightKeyword
          config={[
            { keyword: '苦其心志', color: '#7BDCB5' },
            { keyword: '劳其筋骨', color: '#8ED1FC' },
            { keyword: '饿其体肤', color: '#EB144C' },
            {
              keyword: '空乏其身',
              markRender: (k: string) => `<span style="color: #9900EF">【${k}】</span>`,
            },
          ]}
        >
          天将降大任于是人也，必先苦其心志，劳其筋骨，饿其体肤，空乏其身，行拂乱其所为，所以动心忍性，曾益其所不能！
        </HighLightKeyword>
      </Card>
    </PageCard>
  );
};

export default ComponentList;
