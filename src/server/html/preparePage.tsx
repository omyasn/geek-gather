import * as React from 'react';
import { renderToString } from 'react-dom/server';
import BasePage from '../../client/components/BasePage';
import getHtml, { IHtmlPageParams } from './getHtml';

export interface IPageParams extends IHtmlPageParams {
    PageComponent: React.ComponentType<object>;
}

export default ({
        PageComponent,
        title,
        description,
        pageName,
        initialData,
    }: IPageParams ):String => {
    const basePage = (
        <BasePage>
            <PageComponent
                {...initialData}
            />
        </BasePage>
    );
    const reactHtml = renderToString(basePage);
    const fullHtml = getHtml({
        title,
        description,
        pageName,
        initialData,
        rootString: reactHtml,
    });

    return fullHtml;

}