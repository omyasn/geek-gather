import * as React from 'react';
import { RequestHandler  } from 'express';
import severRenderAndSend from '../severRenderAndSend';
import { IPageParams } from '../html/preparePage';
import MainPage from '../../client/pages/Main/index';

 const main: RequestHandler = (req, res, next) => {
    const pageParams: IPageParams = {
        title: 'Main',
        description: 'My main Page',
        PageComponent: MainPage,
    };
    return severRenderAndSend(req, res, next, pageParams);
}

export default main;