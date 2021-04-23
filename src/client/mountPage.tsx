import * as React from "react";
import { hydrate } from "react-dom";
import BasePage from './BasePage';

interface Params {
    PageComponent: React.ComponentType<any>;
};

export default ({
    PageComponent,
}: Params) => {
    console.log('CLIENT!');

    const initialData = window.__INITIAL_DATA__ || {};

    hydrate(
        <BasePage>
            <PageComponent
                {...initialData}
            />
        </BasePage>,
        document.getElementById("root")
    );
};