import * as React from 'react';
import Header from '../Header';
import Footer from '../Footer';

import styles from './styles.css';

interface BasePageProps {
    
}

const BasePage: React.FC<React.PropsWithChildren<BasePageProps>> = ({
    children
}) => (
    <div className={styles.wrapper}>
        <Header className={styles.header} />
        <div className={styles.main}>
            {children}
        </div>
        <Footer className={styles.footer} />
    </div>
);

export default BasePage;