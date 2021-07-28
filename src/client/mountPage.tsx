import { PreloadedState, EnhancedStore } from '@reduxjs/toolkit';
import * as React from 'react';
import { hydrate } from 'react-dom';
import BasePage from './components/BasePage';

interface Params {
    PageComponent: React.ComponentType<any>;
    createAppStore?: (preloadedState?: PreloadedState<any>, isClient?: boolean ) => EnhancedStore<any, any>; 
};

export default ({
    PageComponent,
    createAppStore,
}: Params) => {
    console.log('CLIENT!');

    const initialData = window.__INITIAL_DATA__;
    const preloadedState = window.__PRELOADED_STATE__;

    // TODO их как-то надо вырезать из HTML 
    delete window.__INITIAL_DATA__;
    delete window.__PRELOADED_STATE__;

    const store = createAppStore ? createAppStore(preloadedState, true) : null;
    hydrate(
        <BasePage
            store={store}
        >
            <PageComponent
                {...initialData}
            />
        </BasePage>,
        document.getElementById("root")
    );
};