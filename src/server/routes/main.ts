import * as React from 'react';
import { RequestHandler  } from 'express';
import severRenderAndSend from '../severRenderAndSend';
import { IPageParams } from '../html/preparePage';
import MainPage, { IPageProps } from '../../client/pages/Main/page';
import { listOfEvents } from '../../client/mockdata';
import { IBackendDataItem } from '../../client/commonTypes';

 const main: RequestHandler = (req, res, next) => {
    const initialData = getBackendData();
    
    const pageParams: IPageParams = {
        initialData,
        title: 'Main',
        description: 'My main Page',
        pageName: 'main',
        PageComponent: MainPage,
    };
    return severRenderAndSend(req, res, next, pageParams);
};

const getBackendData = ():IPageProps => {
    const backendData: IBackendDataItem[] = listOfEvents;
    const allHananas = backendData.map(({id, resourceContent }) => ({
        id,
        ...resourceContent,
    }));
    return {
        eventsList: allHananas,
    };
}

export default main;