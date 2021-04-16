import { useState } from 'react';
import SparkMD5 from 'spark-md5';

/**
 *  分片上传文件处理hook
 *
 *  options 配置项
 *  suffix： 后缀  符合此后缀格式的文件允许上传
 *  maxSize： 文件最大大小，单位M
 *  chunkSize: 文件分片大小，单位byte
 */
export const useFileSlice = (file: any, options: any = {}) => {
  const [percent, setPercent] = useState(0); // 处理百分比
  const [fileResult, setFileResult] = useState({}); // 文件处理结果
  // 文件空校验
  if (!file || !Object.keys(file).length) {
    // 清除原有数据
    if (percent || Object.keys(fileResult).length) {
      setPercent(0);
      setFileResult({});
    }
    return { percent: 0, fileResult: {} };
  }
  // 配置合并
  const fileOptions = {
    suffix: ['.zip', '.tar'], // 文件后缀，例如['.zip','.tar']
    maxSize: 1000, // 文件大小，默认为1000M
    chunkSize: 2 * 1024 * 1024, // 分片大小，默认2M
    ...options,
  };
  const { suffix, maxSize, chunkSize } = fileOptions;
  // ① 文件后缀校验
  if (!suffix.some((s: any) => file.name.endsWith(s))) {
    return {
      percent: 0,
      fileResult: {},
      errorMessage: `文件后缀名不符，仅支持${suffix.join('')}文件！`,
    };
  }
  // ② 文件大小校验
  if (file.size > maxSize * 1024 * 1024) {
    setPercent(0);
    setFileResult({});
    return { percent: 0, fileResult: {}, errorMessage: `文件大小不得超过${maxSize}M！` };
  }
  /**
   *   ③分片处理开始
   */
  // 兼容性处理
  // @ts-ignore
  let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
  const chunkSum = Math.ceil(file.size / chunkSize); // 总分片数
  let currentChunk = 0; // 当前分片
  let spark = new SparkMD5.ArrayBuffer(); // 计算单个分片
  let totalSpark = new SparkMD5.ArrayBuffer(); // 计算整个文件
  const chunkFileReader = new FileReader(); // 计算分片fileRender
  // 文件全部信息
  const fileChunk: any = {
    chunks: [],
    file: {
      fileName: file.name,
      fileSize: file.size,
      chunkSum,
      fileMd5: undefined,
    },
  };
  chunkFileReader.onload = function (e: any) {
    spark.append(e.target.result); // 加密每一个分片
    totalSpark.append(e.target.result);
    // 每一个分片包含的信息
    const chunkInfo = {
      chunkIndex: currentChunk + 1, // 分片下标
      start: currentChunk * chunkSize, // 分片的起始位置
      end: (currentChunk + 1) * chunkSize >= file.size ? file.size : (currentChunk + 1) * chunkSize, // 分片的结束位置
      chunkMd5: spark.end(), // 分片md5值
      currentBuffer: e.target.result, // 分片buffer
      chunkSum, // 分片总数
    };
    fileChunk.chunks.push(chunkInfo);
    currentChunk++;
    if (currentChunk < chunkSum) {
      loadNext();
      setPercent(Number(((currentChunk / chunkSum) * 100).toFixed(2)));
    } else {
      fileChunk.file.fileMd5 = totalSpark.end(); // 整个文件的md5值
      setPercent(100);
      setFileResult(fileChunk);
    }
  };
  chunkFileReader.onerror = function (e: any) {
    return { percent: 0, fileResult: {}, errorMessage: '文件分片处理失败！' };
  };
  function loadNext() {
    let start = currentChunk * chunkSize;
    let end = start + chunkSize;
    if (end > file.size) {
      end = file.size;
    }
    chunkFileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }
  // 开始分片
  if (percent === 0) {
    loadNext();
  }
  return { percent, fileResult };
};
