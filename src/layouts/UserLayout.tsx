import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link,useIntl } from 'umi';
import DefaultFooter from '../components/DefaultFooter';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';


const UserLayout: React.FC<{ children: any }> = ({ children }) => {
  const intl = useIntl();
  const formatMessage = (id:string,defaultMessage:undefined | string = undefined) => intl.formatMessage({
    id,
    defaultMessage,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{formatMessage('momiolo-login')}</title>
        <meta name="description" content={formatMessage('momiolo-login')} />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>{formatMessage('momiolo-title')}</span>
              </Link>
            </div>
            <div className={styles.desc}>
              <span>{formatMessage('momiolo-subTitle')}</span>
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
