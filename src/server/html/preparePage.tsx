import * as React from 'react';
import { renderToString } from 'react-dom/server';
import BasePage from '../../client/BasePage';
import getHtml, { IHtmlPageParams } from './getHtml';

export interface IPageParams extends IHtmlPageParams {
    PageComponent: React.ComponentType;
}

export default ({
        PageComponent,
        title,
        description,
    }: IPageParams ):String => {
    const basePage = (
        <BasePage>
            <PageComponent />
        </BasePage>
    );
    const reactHtml = renderToString(basePage);
    const fullHtml = getHtml({
        title,
        description,
        rootString: reactHtml,
    });

    return fullHtml;

}