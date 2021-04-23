import * as React from "react";
import { hydrate } from "react-dom";
import BasePage from './BasePage';

interface Params {
    PageComponent: React.ComponentType;
};

export default ({
    PageComponent,
}: Params) => {
    console.log('CLIENT!');
    hydrate(
        <BasePage>
            <PageComponent />
        </BasePage>,
        document.getElementById("root")
    );
};