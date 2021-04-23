import * as React from 'react';
import { RequestHandler  } from 'express';
import severRenderAndSend from '../severRenderAndSend';
import { IPageParams } from '../html/preparePage';
import SearchPage from '../../client/pages/Search/page';

 const search: RequestHandler = (req, res, next) => {
    const pageParams: IPageParams = {
        title: 'Search',
        description: 'My search',
        pageName: 'search',
        PageComponent: SearchPage,
    };
    return severRenderAndSend(req, res, next, pageParams);
}

export default search;