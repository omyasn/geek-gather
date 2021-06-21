import * as React from 'react';
import { hydrate } from 'react-dom';
import BasePage from './components/BasePage';

interface Params {
    PageComponent: React.ComponentType<any>;
    store?: any; // TODO
};

export default ({
    PageComponent,
    store,
}: Params) => {
    console.log('CLIENT!');

    const initialData = window.__INITIAL_DATA__;

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