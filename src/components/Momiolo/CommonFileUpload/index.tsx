import React, { useState, useEffect } from 'react';
import { Upload, Button, message } from 'antd';
import { getToken } from '@/utils/utils';

/**
 *  扩展  limit(限制上传文件数量)
 *        title(按钮显示文字)
 *
 *
 *
 * @param props
 * @constructor
 */

const CommonFileUpload = (props: CommonFileUploadProps) => {
  const { fileMaxSize, suffix, customFileCheck, value, onChange, uploadUrl, uploadProps } = props;
  const [fileList, setFileList] = useState<Array<any>>([]); // 组件内部fileList
  const [fileResult, setFileResult] = useState<Array<any>>([]);

  function convertToFileList(urlList: any) {
    return urlList.map((i: any, index: number) => {
      return {
        uid: Number(`-${index + 1}`),
        name: i.fileName || i.fileUrl,
        status: 'done',
        response: { data: { fileUrl: i.fileUrl } },
      };
    });
  }
  useEffect(() => {
    if (value?.length) {
      setFileList(convertToFileList(value));
      setFileResult(value);
    }
  }, []);

  function beforeFileUpload(file: any) {
    // 文件后缀校验
    if (suffix && !suffix.split(',').some((i: any) => file.name.endsWith(`.${i}`))) {
      message.error(`上传文件格式有误，仅支持${suffix}文件！`);
      return Upload.LIST_IGNORE;
    }
    // 文件大小校验
    // @ts-ignore
    if (file.size / 1024 / 1024 > fileMaxSize) {
      message.error(`文件大小不能大于${fileMaxSize}MB！`);
      return Upload.LIST_IGNORE;
    }
    // 自定义文件校验  file => { // 不满足则返回Upload.LIST_IGNORE  }
    if (customFileCheck) {
      customFileCheck(file);
    }
    return true;
  }

  function onFileChange(info: any) {
    const { fileList, file } = info;
    const { name, status, response } = file;
    const { statusCode, statusMessage, data } = response || {};
    setFileList(fileList);
    if (status === 'done' && statusCode === '0' && data) {
      message.success(`${name} 上传成功`);
      setFileResult(
        fileResult.concat({
          fileName: name,
          fileUrl: data?.fileUrl,
        }),
      );
      onChange &&
        onChange(
          fileResult.concat({
            fileName: name,
            fileUrl: data?.fileUrl,
          }),
        );
    } else if (status === 'done' && statusCode !== '0') {
      message.error(statusMessage);
      // 如果出错了则设置该文件状态为失败
      setFileList(fileList.slice(0, fileList.length - 1).concat({ ...file, status: 'error' }));
    } else if (status === 'error') {
      message.error(`${name} 上传失败`);
    } else if (status === 'removed') {
      message.success(`${name} 删除成功`);
      setFileResult(fileResult.filter((i: any) => i.fileUrl !== data?.fileUrl));
      onChange && onChange(fileResult.filter((i: any) => i.fileUrl !== data?.fileUrl));
    }
  }

  return (
    <Upload
      headers={{
        Authorization: `${getToken()}`,
      }}
      action={uploadUrl}
      fileList={fileList}
      beforeUpload={beforeFileUpload}
      onChange={onFileChange}
      {...uploadProps}
    >
      <Button>上传文件</Button>
    </Upload>
  );
};
CommonFileUpload.defaultProps = {
  fileMaxSize: 10, // 10M
  suffix: '',
  value: [],
  uploadUrl: '/base/fileUpload/commonUpload',
};
export default CommonFileUpload;

interface CommonFileUploadProps {
  fileMaxSize?: number;
  suffix?: string;
  customFileCheck?: Function;
  value?: Array<fileResultProps>;
  onChange?: Function;
  uploadUrl?: string;
  uploadProps?: any; // 其他upload属性（透传）
}
interface fileResultProps {
  fileUrl: any;
  fileName?: any;
}
