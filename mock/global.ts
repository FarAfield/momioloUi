import { Request, Response } from 'express';
// 延时函数
const waitTime = (time: number = 2000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
const ResponseTemplate = (data:any) => ({
  statusCode:'0',
  statusMessage:'成功',
  data,
});
export default {
  // 登陆
  'POST /api/account/login': ResponseTemplate({
    token:'0x1x2x3x4x5x6x7x8x9',
  }),
  // 退出登陆
  'POST /api/account/logout': ResponseTemplate(null),




  // 异常
  'GET /api/500': (req: Request, res: Response) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base',
    });
  },
  'GET /api/404': (req: Request, res: Response) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base',
    });
  },
  'GET /api/403': (req: Request, res: Response) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base',
    });
  },
};
