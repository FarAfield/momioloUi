import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Descriptions, Alert, Input, Button } from 'antd';
import { history } from 'umi';
import PageCard from '../../../components/PageCard';
import EditableTable from './EditableTable';
import { baseUrl, pageSuffix, findSuffix } from '@/utils/constant';
import { formatJson } from '@/utils/support';

// 解析方法
const parseRecord = (record: any) => {
  let url = '';
  const paramsList: Array<any> = [];
  if (Object.keys(record).length) {
    const { path, methods, isPaging, params } = record;
    // 请求路径
    if (isPaging === 0) {
      if (methods === 'get') {
        url = `${baseUrl}/${path}/${pageSuffix[0]}`;
      } else if (methods === 'post') {
        url = `${baseUrl}/${path}/${pageSuffix[1]}`;
      }
    } else {
      switch (methods) {
        case 'get':
          url = `${baseUrl}/${path}/${findSuffix[0]}`;
          break;
        case 'post':
          url = `${baseUrl}/${path}/${findSuffix[1]}`;
          break;
        case 'put':
          url = `${baseUrl}/${path}/${findSuffix[2]}`;
          break;
        case 'delete':
          url = `${baseUrl}/${path}/${findSuffix[3]}`;
          break;
        default:
          break;
      }
    }
    // 入参
    let paramsObj = params ? JSON.parse(params) : {};
    if (isPaging === 0) {
      paramsList.push(
        ...[
          { paramName: 'current', paramValue: 1 },
          { paramName: 'size', paramValue: 10 },
        ],
      );
      for (const p in paramsObj) {
        paramsList.push({ paramName: p, paramValue: paramsObj[p] });
      }
    } else {
      for (const p in paramsObj) {
        paramsList.push({ paramName: p, paramValue: paramsObj[p] });
      }
    }
    return {
      info: `${url}`,
      paramsList,
    };
  }
  return { info: url, paramsList };
};

const { TextArea } = Input;
const DebugInterface = (props: any) => {
  const {
    location: { query },
    dispatch,
  } = props;
  const [record, setRecord] = useState<any>({});
  const [info, setInfo] = useState('');
  const [list, setList] = useState([]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (query?.sid) {
      dispatch({
        type: 'base/getData',
        payload: { url: '/interface/findDetail', sid: query.sid },
        callback: (res: any) => {
          setRecord(res.data);
          const { info, paramsList }: any = parseRecord(res.data);
          setInfo(info);
          setList(paramsList);
        },
      });
    }
  }, []);
  const columns = [
    {
      title: '参数名',
      dataIndex: 'paramName',
      width: '50%',
      align: 'center',
    },
    {
      title: '参数值',
      dataIndex: 'paramValue',
      width: '50%',
      align: 'center',
    },
  ];

  const sendRequest = () => {
    const requestParams = {};
    list.forEach((item: any) => {
      requestParams[item.paramName] = item.paramValue;
    });
    setLoading(true);
    dispatch({
      type:
        record.methods === 'delete' ? `base/removeWithRes` : `base/${record.methods}DataWithRes`,
      payload: { url: `${info.replace('https://www.momiolo.com/base', '')}`, ...requestParams },
      callback: (res: any) => {
        setResult(JSON.stringify(res));
        setLoading(false);
      },
    });
  };

  return (
    <PageCard>
      <Descriptions title="接口基础信息">
        <Descriptions.Item label="接口名称">{record.name}</Descriptions.Item>
        <Descriptions.Item label="接口路径">{record.path}</Descriptions.Item>
        <Descriptions.Item label="请求方式">
          {(record.methods || '').toUpperCase()}
        </Descriptions.Item>
        <Descriptions.Item label="是否分页">
          {record.isPaging === 0 ? '分页' : '不分页'}
        </Descriptions.Item>
        <Descriptions.Item label="延时">{record.delay + 's'}</Descriptions.Item>
        <Descriptions.Item label="接口描述">{record.description}</Descriptions.Item>
      </Descriptions>
      <Descriptions title="接口调试信息" />
      <Alert
        message={`${(record.methods || '').toUpperCase()}：${info}`}
        type="success"
        style={{ marginBottom: 16 }}
      />
      <Descriptions title="接口入参" />
      <EditableTable list={list} columns={columns} updateList={(v: any) => setList(v)} />
      <Descriptions title="请求模拟" style={{ marginTop: 12 }} />
      <Button type={'primary'} loading={loading} onClick={() => sendRequest()}>
        点此发送请求
      </Button>
      <Descriptions title="请求结果" style={{ marginTop: 12 }} />
      <TextArea autoSize={{ minRows: 12 }} value={formatJson(result)} />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
        <Button onClick={() => history.goBack()} style={{ width: 120 }}>
          返回
        </Button>
      </div>
    </PageCard>
  );
};
export default connect()(DebugInterface);
