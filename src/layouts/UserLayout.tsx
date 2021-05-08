import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'umi';
import DefaultFooter from '../components/DefaultFooter';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
import { loginPageConfig } from '@/utils/constant';

const UserLayout: React.FC<{ children: any }> = ({ children }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{`登录-${loginPageConfig.metaTitle}`}</title>
        <meta name="description" content={loginPageConfig.metaTitle} />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/user/login">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>{loginPageConfig.title}</span>
              </Link>
            </div>
            <div className={styles.desc}>
              <span>{loginPageConfig.loginDescription}</span>
            </div>
          </div>
          {children}
        </div>
        <DefaultFooter />
      </div>
    </HelmetProvider>
  );
};
export default UserLayout;
