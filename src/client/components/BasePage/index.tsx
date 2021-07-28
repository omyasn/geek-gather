import * as React from 'react';

import { Provider } from 'react-redux';
import { EnhancedStore } from '@reduxjs/toolkit';

import Header from '../Header';
import Footer from '../Footer';

import styles from './styles.scss';

interface BasePageProps {
    store?: EnhancedStore<any, any>;
    
}

const BasePageContent: React.FC = ({
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


const BasePage: React.FC<React.PropsWithChildren<BasePageProps>> = ({
    store,
    children
}) => (
    <React.Fragment>
        {!store ? 
            <BasePageContent>
                {children}
            </BasePageContent>
        :
            <Provider store={store}>
                <BasePageContent>
                    {children}
                </BasePageContent>
            </Provider>
        }
    </React.Fragment>
);

export default BasePage;