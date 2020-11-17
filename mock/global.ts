import { Request, Response } from 'express';
// 延时函数
const waitTime = (time: number = 2000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
const ResponseTemplate = async (req:Request,res:Response,data:any) => {
  await waitTime(2000);
  return res.json({
    statusCode:'0',
    statusMessage:'成功',
    data,
  });
};
export default {
  // 登陆
  'POST /api/account/login': async (req:Request,res:Response) => ResponseTemplate(req,res,{
    token:'0x1x2x3x4x5x6x7x8x9',
  }),
  // 退出登陆
  'POST /api/account/logout': async (req:Request,res:Response) => ResponseTemplate(req,res,null),
  // 获取登陆用户信息
  'GET /api/account/findCurrentInfo': async (req:Request,res:Response) => ResponseTemplate(req,res,{
    accountSid:'1111',
    accountName:'sys',
    userName:'管理员',
    userAvatar:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2710977765,358906402&fm=26&gp=0.jpg',
    permissions:[],
  }),
  // 获取登陆的菜单信息
  'GET /api/resource/findCurrentMenu': async (req:Request,res:Response) => ResponseTemplate(req,res,{
    children:[
      {
        resourceCode:'home',
        resourceName:"首页",
        resourceIcon:"",
        resourceType:1,
        children:[],
      }
    ],
  }),



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
