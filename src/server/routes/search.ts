import * as React from 'react';
import { RequestHandler  } from 'express';
import severRenderAndSend from '../severRenderAndSend';
import { IPageParams } from '../html/preparePage';
import { IBackendHanana } from '../../common/commonTypes';
import SearchPage, { IPageProps } from '../../client/pages/Search/page';
import { listOfEvents } from '../../client/mockdata';

 const search: RequestHandler = (req, res, next) => {
    const initialData = getBackendData();

    const pageParams: IPageParams = {
        initialData,
        title: 'Search',
        description: 'My search',
        pageName: 'search',
        PageComponent: SearchPage,
    };

    return severRenderAndSend(req, res, next, pageParams);
}

const getBackendData = (): IPageProps => {
    // здесь должен быть запрос на бекенд, сейчас мок
    const backendData: IBackendHanana[] = listOfEvents;
    const allHananas = backendData.map(({id, resourceContent }) => ({
        id,
        ...resourceContent,
    }));

    // определяем возможные значения в фильтрах
    const filterHost = new Set(allHananas.map(hanana => hanana.host));
    const filterHostOptions = Array.from(filterHost).sort();

    const filterBeginDate = new Set(allHananas.map(hanana => hanana.beginDate));
    const filterBeginDateOptions = Array.from(filterBeginDate).sort();

    const filterMinPrice = allHananas.map(hanana => hanana.minPrice);
    const filterMinPriceLimitsOptions = [Math.min(...filterMinPrice), Math.max(...filterMinPrice)];

    const filterCapacity = allHananas.map(hanana => hanana.capacity);
    const filterCapacityLimitsOptions = [Math.min(...filterCapacity), Math.max(...filterCapacity)];



    return {
        hananas: allHananas,
        filterHostOptions,
        filterBeginDateOptions,
        filterMinPriceLimitsOptions,
        filterCapacityLimitsOptions,
    };
}

export default search;