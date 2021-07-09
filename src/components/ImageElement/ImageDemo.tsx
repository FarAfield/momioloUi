import React from 'react';
import ImageElement from './index';
import { Row, Col } from 'antd';

const imgList = [
  { img: 'https://img.alicdn.com/tfs/TB1m561ntTfau8jSZFwXXX1mVXa-1240-632.jpg' },
  { img: 'https://img.alicdn.com/tfs/TB1hDfN2xv1gK0jSZFFXXb0sXXa-980-500.jpg' },
  { img: 'https://img.alicdn.com/tfs/TB1FtgXsaNj0u4jSZFyXXXgMVXa-980-500.jpg' },
  { img: 'https://img.alicdn.com/tfs/TB1Hc2G2EH1gK0jSZSyXXXtlpXa-980-500.jpg' },
  { img: 'https://img.alicdn.com/tfs/TB123pnmhvbeK8jSZPfXXariXXa-980-500.jpg' },
  { img: 'https://img.alicdn.com/tfs/TB1szrB2xD1gK0jSZFsXXbldVXa-1240-632.jpg' },
];

const ImageDemo = () => {
  return (
    <div>
      <Row gutter={24}>
        {imgList.map((item: any, index: number) => {
          return (
            <Col span={8} key={index}>
              <ImageElement src={item.img} useAnimate usePreview ratio={2} />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
export default ImageDemo;
