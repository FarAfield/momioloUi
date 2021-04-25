/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect, useRef } from 'react';
import { Upload, message, Progress, Spin, Button, Result } from 'antd';
import { connect } from 'umi';
import { useFileSlice } from './fileSliceHook';
import { useUpdate, useUnmount } from 'ahooks';
import { InboxOutlined } from '@ant-design/icons';
import styles from './index.less';


/**
 *  ① 文件预处理，对文件分片
 *  ② 文件预处理完成，文件预上传
 *     1.文件未上传，则保存该文件的上传信息
 *     2.文件部分上传，则获取文件断点信息并继续上传
 *     3.文件已上传，则设置文件为已成功上传且已成功合并
 *  ③ 文件分片上传
 *     1.文件每次成功上传一片，则实时更改上传进度，失败则中断上传并重试
 *  ④ 文件分片上传完成，进行文件合并
 *  ⑤ 文件合并完成
 */
const { Dragger } = Upload;
const SliceUpload = (props: any) => {
  const { style, dispatch } = props;
  const [fileList, setFileList] = useState<any>([]);
  const { percent, fileResult, errorMessage }: any = useFileSlice(fileList[0], {
    maxSize: 10*1024,
    chunkSize: 0.1 * 1024 * 1024,
  });
  const [uploading, setUploading] = useState(false); // 是否在上传中
  const [uploadChunkSum,setUploadChunkSum] = useState(0); // 上传成功的片数
  const [uploadPercent, setUploadPercent] = useState(0); // 上传进度（由片数计算出来）
  const [fileInfo,setFileInfo] = useState<any>({}); //  fileStatus为done/error
  const breakRequest = useRef(false); // 是否中断上传
  const timer = useRef<any>(null);  // 分片上传定时器
  const update = useUpdate();


  /**
   * 文件预处理出错提示
   */
  useEffect(() => {
    if (errorMessage) {
      message.warn(errorMessage);
    }
  }, [errorMessage]);

  /**
   *  计算上传进度
   */
  useEffect(() => {
    if(uploadChunkSum){
      const { file } = fileResult;
      const { chunkSum = 0 } = file || {};
      setUploadPercent(Number(((uploadChunkSum / chunkSum) * 100).toFixed(2)));
      // 上传完成,开启文件合并
      if(uploadChunkSum === chunkSum){
        setUploading(false);
        mergeUploadFile();
      }
    }
  }, [uploadChunkSum]);

  /**
   *  终止分片上传定时器
   */
  useEffect(() => {
    if(breakRequest.current && timer.current){
      clearInterval(timer.current);
      timer.current = null;
    }
  },[breakRequest.current]);

  /**
   * ① 第一步，上传前处理，文件md5校验，断点续传校验
   */
  const preUpload = () => {
    const {
      file: { fileName, fileSize, fileMd5, chunkSum },
      chunks,
    } = fileResult;
    //  数据处理
    const paramsResult = {
      fileName,
      fileSize,
      fileMd5,
      chunkSum,
      chunks: chunks.map((item: any) => {
        const i = { ...item };
        delete i.currentBuffer;
        return i;
      }),
    };
    // 执行文件预处理
    dispatch({
      type:'base/postData',
      payload: { url:'/fileUpload/preUpload',...paramsResult},
      callback: () => {
        console.info('文件预处理结果',paramsResult);
        console.info('执行预上传');
        /**
         *  todo (断点续传后端实现)  setUploadChunkSum(0); partUpload(chunks);
         */
        // 前端模拟断点续传（设置已上传的分片数以及需要上传的分片）
        setUploadChunkSum(v => v);
        partUpload(chunks.slice(uploadChunkSum));
      }
    });
  };

  /**
   *  ② 第二步，分片上传
   *  uploadList 为需要上传的分片
   */
  const partUpload = (uploadList = []) => {
    const batchSize = 2; // 每批上传的片数，越大越卡
    const batchCount = Math.ceil(uploadList.length / batchSize); // 批量处理多少次
    let batchDone = 0;
    // 开始进行上传
    setUploading(true);
    timer.current = setInterval(() => {
      if(batchDone >= batchCount){
        clearInterval(timer.current);
        timer.current = null;
        return;
      }
      batchAppend(uploadList,batchDone,batchSize);
      batchDone+=1;
    },3000);
  };

  function batchAppend(uploadList: any,batchDone: any,batchSize: any) {
    const list = uploadList.slice(batchSize * batchDone, batchSize * (batchDone + 1));
    batchUpload(list);
  }

  function batchUpload(list: any) {
    // @ts-ignore
    const {
      file: { fileMd5 },
    } = fileResult;
    list.forEach((item: any) => {
      const { chunkIndex, chunkMd5, currentBuffer, chunkSum } = item;
      const formData = new FormData();
      const blob = new Blob([currentBuffer], { type: 'application/octet-stream' });
      formData.append('chunk', blob, chunkMd5);
      formData.append('fileMd5', fileMd5);
      formData.append('chunkIndex', chunkIndex);
      formData.append('chunkSum', chunkSum);
      console.info(`当前上传片数：${chunkIndex},总片数：${chunkSum}，分片Md5：${chunkMd5}`);
      dispatch({
        type: 'base/upload',
        payload: { url: '/fileUpload/partUpload', file: formData },
        callback: (res: any) => {
          if(res.statusCode === '0'){
            // 设置上传片数
            setUploadChunkSum((v) => v + 1);
          } else {
            // todo  重试一次
            // 某一个分片失败则终止上传
            setFileInfo({ fileStatus:'error' });
            breakRequest.current = true;
          }
        },
      });
    });
  }

  /**
   * ③ 第三步，分片上传完成，进行文件合并
   */
  const mergeUploadFile = () => {
    dispatch({
      type: 'base/postData',
      payload: { url:'/fileUpload/mergeFile', fileMd5: fileResult.file.fileMd5 },
      callback: () => {
        console.info('文件上传成功！');
        // todo 将文件信息留存交给父组件
        setTimeout(() => {
          setFileInfo({ fileStatus:'done'});
        },2000)
      }
    })
  };
  /**
   *  组件卸载，清除所有数据并中断请求
   */
  useUnmount(() => {
    clearInterval(timer.current);
    timer.current = null;
    onRemove();
  });

  const beforeUpload = (file: any) => {
    setFileList([file]);
    return false;
  };
  const onRemove = () => {
    setFileList([]);
    setUploading(false);
    setUploadChunkSum(0);
    setUploadPercent(0);
    setFileInfo({});
    breakRequest.current = false;
    timer.current = null;
  };
  const dProps: any = {
    name: 'file',
    maxCount: 1,
    multiple: false,
    fileList,
    showUploadList: false,
    beforeUpload,
  };
  return (
    <div className={styles.sliceUpload} style={style}>
      {/**  文件预处理未完成   */}
      {percent === 0 && (
        <Dragger {...dProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
          <p className="ant-upload-hint">支持.zip.tar.rar文件，最大文件大小为10G</p>
          <p className="ant-upload-hint">受限于服务器配置，每次分片大小调整为0.1M</p>
        </Dragger>
      )}
      {/**  文件预处理中  */}
      {percent > 0 && percent < 100 && (
        <div className={styles.progress}>
          <Spin spinning>
            <h3>文件预处理中...</h3>
            <Progress width={100} percent={percent} type="circle" />
          </Spin>
        </div>
      )}
      {/**  文件预处理已完成   */}
      {percent === 100 && (
        <div className={styles.progress}>
          <div className={styles.done}>
            {/**  文件未上传   */}
            {!uploading && uploadPercent === 0 && (
              <>
                <h3>文件预处理完成，确认即可上传</h3>
                <Progress width={100} percent={100} type="circle" format={() => '完成'} />
                <div className={styles.options}>
                  <Button onClick={onRemove}>取消</Button>
                  <Button type={'primary'} onClick={preUpload}>
                    确认
                  </Button>
                </div>
              </>
            )}
            {/**  文件上传中   */}
            {uploading && uploadPercent < 100 && !fileInfo.fileStatus && (
              <>
                <h3>{`文件分片${breakRequest.current ? '上传暂停' : '上传'}中...`}</h3>
                <Progress
                  strokeColor={{
                    from: '#108ee9',
                    to: '#87d068',
                  }}
                  percent={uploadPercent}
                  status={breakRequest.current ? 'normal' : 'active'}
                />
                <div className={styles.options}>
                  {!breakRequest.current ? (
                    <Button
                      danger
                      onClick={() => {
                        breakRequest.current = true;
                        // 强制组件重渲染
                        update();
                      }}
                    >
                      中断上传
                    </Button>
                  ) : (
                    <>
                      <Button onClick={onRemove}>取消上传</Button>
                      <Button
                        type={'primary'}
                        onClick={() => {
                          breakRequest.current = false;
                          // 强制组件重渲染
                          update();
                          preUpload();
                        }}
                      >
                        继续上传
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
            {/**  文件上传失败（某一分片上传失败）（fileStatus  error）  */}
            {uploading && uploadPercent < 100 && fileInfo.fileStatus === 'error' && (
                <>
                  <Result status="error" title="文件上传失败" />
                  <Button type={'primary'} onClick={() => {
                    breakRequest.current = false;
                    setFileInfo({});
                    preUpload();
                  }}>
                    重试
                  </Button>
                </>
            )}
            {/**  文件分片上传成功，开始进行文件合并 */}
            {uploadPercent === 100 && !fileInfo.fileStatus && (
              <Spin spinning={true}>
                <h3>文件上传成功，合并中...</h3>
                <Progress
                  strokeColor={{
                    from: '#108ee9',
                    to: '#87d068',
                  }}
                  percent={99}
                  status={'active'}
                />
              </Spin>
            )}
            {/**  文件合并成功 （fileStatus  done）  */}
            {uploadPercent === 100 && fileInfo.fileStatus === 'done' && (
              <>
                <Result status="success" title="文件上传成功" />
                <Button type={'primary'} onClick={onRemove}>
                  返回
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
SliceUpload.defaultProps = {
  style: {
    width: '40%',
    margin: '0 auto',
    height: 220,
  },
};
export default connect()(SliceUpload);
/**
 *  style  组件外部内联样式
 */
