import React, { useState } from 'react';
import { Button, Row, Col, Card, Form, Input, Space, message } from 'antd';
import PageCard from '../../../components/PageCard';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import MonacoEditor from '../../../components/MonacoEditor';
import { formatJson } from '@/utils/support';

const FormatInterface = () => {
  const [form] = Form.useForm();
  const [code, setCode] = useState('');

  const handleParse = () => {
    try {
      const jsonData = JSON.parse(code);
      if (Array.isArray(jsonData) && jsonData.length) {
        const init = Object.keys(jsonData[0]).map((item: any) => {
          return { sourceField: item };
        });
        form.setFieldsValue({
          array: init,
        });
      } else {
        message.warn('非数组格式数据或数组无数据！');
      }
    } catch (e) {
      message.warn('JSON解析异常，请检查！');
    }
  };

  const onFinish = ({ array }: any) => {
    if (!array?.length) {
      message.warn('无字段需要映射！');
      return;
    }
    const sourceData = JSON.parse(code);
    const sourceFields = array.map((i: any) => i.sourceField);
    const mappingFields = array.map((i: any) => i.mappingField);
    const defaultValues = array.map((i: any) => i.defaultValue);
    // 额外需要附加的字段
    const extraFields = sourceFields.filter((i: any) => !Object.keys(sourceData[0]).includes(i));
    const result = sourceData.map((item: any) => {
      for (const k in item) {
        // 完成字段删除、映射、默认值赋予
        const index = sourceFields.findIndex((i: any) => i === k);
        if (index > -1) {
          if (mappingFields[index]) {
            item[mappingFields[index]] = defaultValues[index] ? defaultValues[index] : item[k];
            delete item[k];
          }
          if (defaultValues[index]) {
            item[k] = defaultValues[index];
          }
        } else {
          delete item[k];
        }
      }
      // 添加附加参数
      extraFields.forEach((e: any) => {
        const eIndex = sourceFields.findIndex((i: any) => i === e);
        item[sourceFields[eIndex]] = defaultValues[eIndex] || '';
      });
      return item;
    });
    setCode(formatJson(JSON.stringify(result)));
  };

  return (
    <PageCard>
      <Row gutter={24}>
        <Col span={10}>
          <Card bordered={false} title={<h3>JSON转换配置</h3>}>
            <Form onFinish={onFinish} autoComplete="off" form={form}>
              <Form.List name="array">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <Space
                        key={field.key}
                        style={{ display: 'flex', marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...field}
                          //label={'源字段'}
                          name={[field.name, 'sourceField']}
                          fieldKey={[field.fieldKey, 'sourceField']}
                          rules={[{ required: true, message: '源字段必填' }]}
                        >
                          <Input placeholder="源字段" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          //label={'映射字段'}
                          name={[field.name, 'mappingField']}
                          fieldKey={[field.fieldKey, 'mappingField']}
                        >
                          <Input placeholder="映射字段" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          //label={'默认值'}
                          name={[field.name, 'defaultValue']}
                          fieldKey={[field.fieldKey, 'defaultValue']}
                        >
                          <Input placeholder="默认值" />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        添加新字段
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button type="primary" htmlType="submit">
                    开始转换
                  </Button>
                  <Button type="primary" onClick={() => handleParse()}>
                    解析JSON
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={14}>
          <Card bordered={false} title={<h3>转换结果</h3>}>
            <MonacoEditor height={500} value={code} onChange={(v: any) => setCode(v)} />
          </Card>
        </Col>
      </Row>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={() => history.goBack()}>{'返回'}</Button>
      </div>
    </PageCard>
  );
};
export default FormatInterface;
