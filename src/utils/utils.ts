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

export const isSuccess = (response:any) => {
  return response?.statusCode === '0';
};
