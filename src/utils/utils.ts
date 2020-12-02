import {ThemeConfig} from "@/utils/constant";

/**===========================  Token   ==================================*/
export function isLogin() {
  return (!!sessionStorage.getItem('token'));
}
export function setToken(token:any) {
  sessionStorage.setItem('token', token);
}
export function getToken() {
  return sessionStorage.getItem('token');
}
export function storageClear() {
  sessionStorage.clear();
}

/**===========================  Response   ==================================*/
export const isSuccess = (response:any) => {
  return response?.statusCode === '0';
};

/**===========================  Theme   ==================================*/
export const changeTheme = (theme:any) => {
  const linkDom:any = document.getElementById('theme-style') as HTMLLinkElement;
  if(linkDom){
    linkDom.href = ThemeConfig.find((item:any) => item.key === theme)?.theme;
  } else {
    const style:any = document.createElement('link');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.id = 'theme-style';
    style.href = ThemeConfig.find((item:any) => item.key === theme)?.theme;
    if (document.body.append) {
      document.body.append(style);
    } else {
      document.body.appendChild(style);
    }
  }
};
