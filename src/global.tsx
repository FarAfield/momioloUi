import { changeTheme } from './utils/utils';
const theme = localStorage.getItem('theme') || 'default';
changeTheme(theme);
