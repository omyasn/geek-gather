import * as React from 'react';
import { hydrate } from 'react-dom';
import BasePage from './components/BasePage';

interface Params {
    PageComponent: React.ComponentType<any>;
    createAppStore?: any; // TODO
};

export default ({
    PageComponent,
    createAppStore = () => {},
}: Params) => {
    console.log('CLIENT!');

    const initialData = window.__INITIAL_DATA__;
    const preloadedState = window.__PRELOADED_STATE__;
    delete window.__INITIAL_DATA__;
    delete window.__PRELOADED_STATE__;

    const store = createAppStore(preloadedState);
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