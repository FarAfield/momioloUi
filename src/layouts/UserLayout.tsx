import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'umi';
import DefaultFooter from '../components/DefaultFooter';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
import { loginDescription } from '@/utils/constant';


const UserLayout: React.FC<{ children: any }> = ({ children }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{'登录-momiolo'}</title>
        <meta name="description" content={'momiolo'} />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Momiolo</span>
              </Link>
            </div>
            <div className={styles.desc}>
              <span>{loginDescription}</span>
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
