import React, { useEffect, useMemo, useCallback } from 'react';
import { Form, Button, Modal, Input, Select, TreeSelect, message } from 'antd';
import { transferOption } from '@/utils/support';
import { connect } from 'umi';
import styles from './index.less';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const CommonModalForm = (props: any) => {
  const {
    visible,
    saveUrl,
    formItems,
    formData,
    initialValues,
    handleFieldsValue,
    handleCallback,
    handleCancel,
    mapPropsToFields,
    dispatch,
    loading,
    title,
    buttonName,
    messageInfo,
    ...rest
  } = props;
  const [form] = Form.useForm();
  // 初始化回显
  useEffect(() => {
    if (visible) {
      const fields = mapPropsToFields
        ? mapPropsToFields({ ...initialValues, ...formData })
        : { ...initialValues, ...formData };
      form.setFieldsValue({ ...fields });
    }
  }, [visible]);
  const onFinish = useCallback(
    (fieldsValue) => {
      // 自定义数据处理
      const values = handleFieldsValue ? handleFieldsValue(fieldsValue) : fieldsValue;
      if (!values || typeof values !== 'object') return;
      // 数据为空处理
      for (const v in values) {
        if (!values[v] || !values[v].toString().trim()) {
          values[v] = undefined;
        }
      }
      const resultData = { ...formData, ...values };
      const url =
        saveUrl.length === 1 ? saveUrl[0] : Object.keys(formData).length ? saveUrl[1] : saveUrl[0];
      dispatch({
        type: 'base/commonPostData',
        payload: { url, ...resultData },
        callback: (res: any) => {
          message.success(Object.keys(formData).length ? messageInfo[1] : messageInfo[0]);
          // 成功方法回调时支持入参判断属于什么操作
          handleCallback && handleCallback(Object.keys(formData).length ? 'create' : 'update');
          onCancel();
        },
      });
    },
    [visible],
  );
  const onCancel = useCallback(() => {
    handleCancel();
    form.resetFields();
  }, []);
  const saveAndCancel = useMemo(() => {
    return (
      <div key={'saveAndCancel'} className={styles.saveAndCancel}>
        <Button onClick={onCancel}>
          <CloseOutlined />
          {buttonName[1]}
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          <CheckOutlined />
          {buttonName[0]}
        </Button>
      </div>
    );
  }, [loading]);
  const renderItem = useMemo(() => {
    const resultItems = formItems.map((item: any) => {
      const { type, readOnly = [false, false], hide } = item;
      const disabled = Object.keys(formData).length ? readOnly[1] : readOnly[0];
      if (hide) {
        return null;
      }
      switch (type) {
        case 'input': {
          const { type, readOnly, hide, key, title, rules, maxLength, ...rest } = item;
          const placeholder = `请输入${typeof title === 'string' ? title : ''}`;
          return (
            <FormItem key={key} name={key} label={title} rules={rules}>
              <Input
                placeholder={placeholder}
                allowClear
                maxLength={maxLength}
                disabled={disabled}
                {...rest}
              />
            </FormItem>
          );
        }
        case 'textArea': {
          const { type, readOnly, hide, key, title, rules, maxLength, rows = 4, ...rest } = item;
          const placeholder = `请输入${typeof title === 'string' ? title : ''}`;
          return (
            <FormItem key={key} name={key} label={title} rules={rules}>
              <TextArea
                placeholder={placeholder}
                maxLength={maxLength}
                rows={rows}
                disabled={disabled}
                {...rest}
              />
            </FormItem>
          );
        }
        case 'select': {
          const {
            type,
            readOnly,
            hide,
            key,
            title,
            rules,
            selectOptions = [],
            keyValue = ['value', 'label'],
            onSelectChange,
            ...rest
          } = item;
          return (
            <FormItem key={key} name={key} label={title} rules={rules}>
              <Select
                allowClear
                showSearch
                placeholder={'请选择'}
                onChange={onSelectChange}
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                disabled={disabled}
                {...rest}
              >
                {transferOption(selectOptions, keyValue)}
              </Select>
            </FormItem>
          );
        }
        case 'treeSelect': {
          const { type, readOnly, hide, key, title, rules, treeData, ...rest } = item;
          return (
            <FormItem key={key} name={key} label={title} rules={rules}>
              <TreeSelect
                allowClear
                showSearch={false} // 单选
                filterTreeNode={true}
                placeholder={'请选择'}
                treeData={treeData}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                disabled={disabled}
                treeDefaultExpandAll
                {...rest}
              />
            </FormItem>
          );
        }
        default:
          return null;
      }
    });
    resultItems.push(saveAndCancel);
    return resultItems;
  }, [formItems, visible, loading]);
  return (
    <Modal
      visible={visible}
      title={Object.keys(formData).length ? title[1] : title[0]}
      onCancel={onCancel}
      footer={false}
      closable
      {...rest}
    >
      <Form form={form} onFinish={onFinish} initialValues={initialValues} {...formItemLayout}>
        {renderItem}
      </Form>
    </Modal>
  );
};
CommonModalForm.defaultProps = {
  visible: false,
  saveUrl: [],
  formItems: [],
  formData: {},
  initialValues: {},
  title: ['新增', '编辑'],
  buttonName: ['保存', '取消'],
  messageInfo: ['新增成功', '编辑成功'],
};
export default connect(({ loading }: any) => ({
  loading: loading.effects['base/commonPostData'],
}))(CommonModalForm);
