import React from 'react';
import styles from './index.less';
import { connect } from 'umi';
import { GridContent } from '@ant-design/pro-layout';
import { Row, Col, Card, Divider } from 'antd';
import { nickNameAndAvatar } from '../../../utils/constant';

const Center = (props: any) => {
  const { currentUser } = props;
  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={7} md={24}>
          <Card bordered={false} style={{ marginBottom: 24 }}>
            <div>
              <div className={styles.avatarHolder}>
                <img alt="" src={currentUser.avatar || nickNameAndAvatar[1]} />
                <div className={styles.name}>{currentUser.name || nickNameAndAvatar[0]}</div>
                <div>
                  {currentUser.userSex === 0 ? '男' : currentUser.userSex === 1 ? '女' : ''}
                </div>
              </div>
              <div className={styles.detail}>
                <p>手机号：{currentUser.userMobile}</p>
                <p>地址：{currentUser.userLocation}</p>
                <p>邮箱：{currentUser.userMail}</p>
              </div>
              <Divider dashed />
              <div className={styles.team}>
                <div className={styles.teamTitle}>标签</div>
              </div>
              <Divider style={{ marginTop: 16 }} dashed />
              <div className={styles.team}>
                <div className={styles.teamTitle}>风格</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col lg={17} md={24}>
          <Card className={styles.tabsCard} bordered={false} />
        </Col>
      </Row>
    </GridContent>
  );
};
export default connect(({ login }: any) => ({
  currentUser: login.currentUser,
}))(Center);
