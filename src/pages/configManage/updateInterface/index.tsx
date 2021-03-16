import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import {
  message,
  Button,
  Row,
  Col,
  Spin,
  Card,
  Form,
  Input,
  Radio,
  Select,
  InputNumber,
} from 'antd';
import { useUnmount } from 'ahooks';
import PageCard from '../../../components/PageCard';
import { history } from 'umi';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { transferOption } from '@/utils/support';
import MonacoEditor from '../../../components/MonacoEditor';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

const UpdateInterface = (props: any) => {
  const {
    loading,
    submitLoading,
    dispatch,
    location: { query },
  } = props;
  const [form] = Form.useForm();
  const [code, setCode] = useState('');

  useEffect(() => {
    if (query?.sid) {
      findDetail(query.sid);
    } else {
      dispatch({
        type: 'global/update',
        payload: {
          breadcrumbData: [
            {
              path: '/',
              breadcrumbName: '首页',
            },
            {
              path: '/configManage',
              breadcrumbName: '配置管理',
            },
            {
              path: '/updateInterface',
              breadcrumbName: '接口新增',
            },
          ],
        },
      });
    }
  }, []);

  const findDetail = useCallback((sid: any) => {
    dispatch({
      type: 'base/getData',
      payload: { url: '/interface/findDetail', sid },
      callback: (res: any) => {
        // todo 数据回显以及state设置
        form.setFieldsValue({});
      },
    });
  }, []);

  useUnmount(() => {
    dispatch({
      type: 'global/update',
      payload: {
        breadcrumbData: [],
      },
    });
  });

  const onFinish = (values: any) => {
    let responseData: any = undefined;
    // 校验空
    if (!code) {
      message.warn('JSON为空，请输入后在提交！');
      return;
    }
    // 校验格式
    try {
      responseData = JSON.parse(code);
    } catch (e) {
      message.warn('JSON解析异常，请检查！');
      return;
    }
    // 校验配置是否正确
    if (values.isPaging === 0 && !Array.isArray(responseData)) {
      message.warn('该JSON格式不支持分页，请修改！');
      return;
    }
    console.log(values, code, responseData);
  };

  return (
    <PageCard>
      <Spin spinning={loading === true}>
        <Row gutter={24}>
          <Col span={8}>
            <Card bordered={false} title={<h3>接口基础信息</h3>}>
              <Form form={form} onFinish={onFinish} initialValues={{ delay: 0 }} layout="vertical">
                <FormItem
                  name={'name'}
                  label={'接口名称'}
                  rules={[{ required: true, message: '请输入接口名称' }]}
                >
                  <Input allowClear placeholder={'请输入接口名称'} maxLength={20} />
                </FormItem>
                <FormItem
                  name={'url'}
                  label={'接口URL(作为参数传递)'}
                  rules={[{ required: true, message: '请输入接口URL' }]}
                >
                  <Input
                    allowClear
                    placeholder={'请输入接口URL'}
                    maxLength={20}
                    addonBefore="https://"
                  />
                </FormItem>
                <FormItem
                  name={'description'}
                  label={'接口描述'}
                  rules={[{ required: false, message: '请输入接口描述' }]}
                >
                  <TextArea allowClear placeholder={'请输入接口描述'} maxLength={100} rows={4} />
                </FormItem>
                <FormItem
                  name={'methods'}
                  label={'请求方式'}
                  rules={[{ required: false, message: '请选择' }]}
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder={'请选择'}
                    filterOption={(input, option: any) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {transferOption(
                      [
                        { value: 'post', label: 'POST' },
                        { value: 'get', label: 'GET' },
                      ],
                      ['value', 'label'],
                    )}
                  </Select>
                </FormItem>
                <FormItem
                  name={'isPaging'}
                  label={'是否分页'}
                  rules={[{ required: true, message: '请选择是否分页' }]}
                >
                  <Radio.Group>
                    <Radio value={0}>{'是'}</Radio>
                    <Radio value={1}>{'否'}</Radio>
                  </Radio.Group>
                </FormItem>
                <FormItem
                  name={'delay'}
                  label={'延时'}
                  rules={[{ required: true, message: '请选择延时' }]}
                >
                  <InputNumber placeholder={'请选择'} min={0} max={30} step={1} precision={0} />
                </FormItem>
                <FormItem>
                  <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '30%' }}>
                    <Button onClick={() => history.goBack()} style={{ marginRight: 12 }}>
                      <CloseOutlined />
                      {'取消'}
                    </Button>
                    <Button type="primary" htmlType="submit" loading={submitLoading}>
                      <CheckOutlined />
                      {'保存'}
                    </Button>
                  </div>
                </FormItem>
              </Form>
            </Card>
          </Col>
          <Col span={16}>
            <Card bordered={false} title={<h3>返回体配置</h3>}>
              <div style={{ width: '95%' }}>
                <MonacoEditor height={500} code={code} saveCode={(v: any) => setCode(v)} />
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>
    </PageCard>
  );
};
export default connect(({ loading }: any) => ({
  loading: loading.effects['base/getData'],
  submitLoading: loading.effects['base/postData'],
}))(UpdateInterface);
