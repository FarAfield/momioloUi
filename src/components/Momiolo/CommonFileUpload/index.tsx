import React, { useState, useEffect, useMemo } from 'react';
import { Upload, Button, message } from 'antd';
import { getToken } from '@/utils/utils';

/**
 *  默认为文件上传  uploadProps中可设置listType为text || picture
 *  若使用图片上传，必须设置uploadUrl以及设置uploadProps中listType为picture-card
 */

const CommonFileUpload = (props: CommonFileUploadProps) => {
  const {
    fileMaxSize,
    suffix,
    customFileCheck,
    limit,
    title,
    value,
    onChange,
    uploadUrl,
    uploadProps,
  } = props;
  const [fileList, setFileList] = useState<Array<any>>([]); // 组件内部fileList
  const [fileResult, setFileResult] = useState<Array<any>>([]);
  const isImg = useMemo(() => {
    return uploadProps?.listType && uploadProps?.listType.includes('picture');
  }, [uploadProps]);

  function convertToFileList(urlList: any) {
    return urlList.map((i: any, index: number) => {
      const extra = isImg ? { url: i.fileUrl, thumbUrl: i.fileUrl } : {};
      return {
        uid: Number(`-${index + 1}`),
        name: i.fileName || i.fileUrl,
        status: 'done',
        response: { data: { fileUrl: i.fileUrl } },
        ...extra,
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
    const { uid, name, status, response } = file;
    const { statusCode, statusMessage, data } = response || {};
    setFileList(fileList);
    if (status === 'done' && statusCode === '0' && data) {
      message.success(`${name} 上传成功`);
      // 对文件增加url以及thumbUrl属性（图片使用）
      const cloneFileList = [...fileList];
      const index = cloneFileList.findIndex((i: any) => i.uid === uid);
      cloneFileList[index] = {
        ...cloneFileList[index],
        url: data?.fileUrl,
        thumbUrl: data?.fileUrl,
      };
      if(isImg){
        setFileList(cloneFileList);
      }
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
      {fileList.length < limit && (
        <>{uploadProps?.listType === 'picture-card' ? `${title}` : <Button>{`${title}`}</Button>}</>
      )}
    </Upload>
  );
};
CommonFileUpload.defaultProps = {
  fileMaxSize: 10, // 10M
  suffix: '',
  limit: 5,
  title: '上传文件',
  value: [],
  uploadUrl: '/base/fileUpload/commonFileUpload', // commonFileUpload  commonImgUpload
  uploadProps: {},
};
export default CommonFileUpload;

interface CommonFileUploadProps {
  fileMaxSize?: any;
  suffix?: string;
  customFileCheck?: Function; // 自定义文件上传前校验
  limit?: any;
  title?: string;
  value?: Array<fileResultProps>;
  onChange?: Function;
  uploadUrl?: string;
  uploadProps?: any; // 其他upload属性（透传）
}
interface fileResultProps {
  fileUrl: any;
  fileName?: any;
}
