import * as React from 'react';
import { renderToString } from 'react-dom/server';
import BasePage from '../../client/components/BasePage';
import getHtml, { IHtmlPageParams } from './getHtml';

export interface IPageParams extends IHtmlPageParams {
    PageComponent: React.ComponentType<object>;
    store?: any; // TODO
}

export default ({
        PageComponent,
        title,
        description,
        pageName,
        initialData,
        store,
    }: IPageParams ):String => {
    const basePage = (
        <BasePage 
            store={store}
        >
            <PageComponent
                {...initialData}
            />
        </BasePage>
    );
    const reactHtml = renderToString(basePage);

    const preloadedState = store ? store.getState() : {};

    const fullHtml = getHtml({
        title,
        description,
        pageName,
        initialData,
        preloadedState,
        rootString: reactHtml,
    });

    return fullHtml;

}