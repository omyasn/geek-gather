import { RequestHandler  } from 'express';
import severRenderAndSend from '../severRenderAndSend';
import { IPageParams } from '../html/preparePage';
import { IBackendHanana } from '../../common/commonTypes';

// TODO перенести файлы использующиеся на сервере из client в папку common
import SearchPage, { IPageProps } from '../../client/pages/Search/page';
import store from '../../client/pages/Search/store';
import { listOfEvents } from '../../client/mockdata';


const getBackendData = (): IPageProps => {
    // здесь должен быть запрос на бекенд, сейчас мок
    const backendData: IBackendHanana[] = listOfEvents;
    const allHananas = backendData.map(({id, resourceContent }) => ({
        id,
        ...resourceContent,
    }));

    let filterHostOptions = new Set<string>();
    let filterBeginDateOptions = new Set<string>();
    let filterMinPriceLimitsOptions = [ Infinity, 0 ];
    let filterCapacityLimitsOptions = [ Infinity, 0 ];

    allHananas.forEach(hanana => {
        filterHostOptions.add(hanana.host);
        filterBeginDateOptions.add(hanana.beginDate);

        filterMinPriceLimitsOptions = setMinMax(filterMinPriceLimitsOptions, hanana.minPrice);
        filterCapacityLimitsOptions = setMinMax(filterCapacityLimitsOptions, hanana.capacity);
    });


    return {
        hananas: allHananas,
        filterHostOptions: Array.from(filterHostOptions).sort(),
        filterBeginDateOptions: Array.from(filterBeginDateOptions).sort(),
        filterMinPriceLimitsOptions,
        filterCapacityLimitsOptions,
    };
}

const setMinMax = (arr: number[], el: number): number[] => {
        if (el < arr[0]) {
            arr[0] = el;
        }

        if (el > arr[1]) {
            arr[1] = el;
        }

        return arr;
}

const search: RequestHandler = (req, res, next) => {
    const initialData = getBackendData();

    const pageParams: IPageParams = {
        initialData,
        store,
        title: 'Search',
        description: 'My search',
        pageName: 'search',
        PageComponent: SearchPage,
    };

    return severRenderAndSend(req, res, next, pageParams);
}

export default search;