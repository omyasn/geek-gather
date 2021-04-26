import * as React from 'react';
// import fetch from 'isomorphic-unfetch';
import { RequestHandler  } from 'express';
import severRenderAndSend from '../severRenderAndSend';
import { IPageParams } from '../html/preparePage';
import EventPage, { IPageProps } from '../../client/pages/Event/page';
import { mockDetailsOfEvent, mockLocationInfo } from '../../client/mockdata';
import { IHananaDetails, ILocation } from '../../client/commonTypes';

interface IBackendDetails {
    id: number;
    url: string;
    resourceContent: IHananaDetails;
}

interface IBackendLocation {
    id: number;
    url: string;
    resourceContent: ILocation;
}

 const event: RequestHandler = (req, res, next) => {
    const { id } = req.params;
    const initialData = getBackendData(id);
    
    const pageParams: IPageParams = {
        initialData,
        title: 'Event',
        description: 'My event',
        pageName: 'event',
        PageComponent: EventPage,
    };
    return severRenderAndSend(req, res, next, pageParams);
};

const getBackendData = (id:string):IPageProps => {
    // TODO сейчас запросы последовательны и ждут всей инфы для загрузки страницы. Информацию о локации можно подргужать параллельно

  // const mainInfo = await fetch(`http://192.168.1.70:8010/actions/${id}`);
  // const mainInfoJson = await mainInfo.json();
 
  // const location = await fetch(`http://192.168.1.70:8010/locations/${mainInfoJson.resourceContent.locationId}`);
  // const locationJson = await location.json();

    const details: IBackendDetails = mockDetailsOfEvent;
    const location: IBackendLocation = mockLocationInfo;

    return {
        details: details.resourceContent,
        location: location.resourceContent,
    };
}

export default event;