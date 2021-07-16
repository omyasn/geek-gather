import { RequestHandler, Request } from 'express';
import severRenderAndSend from '../severRenderAndSend';
import { IPageParams } from '../html/preparePage';
import { IBackendHanana, IHanana } from '../../common/commonTypes';

// TODO перенести файлы использующиеся на сервере из client в папку common
import SearchPage, { IPageProps, FiltersVariants } from '../../client/pages/Search/page';
import { listOfEvents } from '../../client/mockdata';
import createAppStore, { RootStateType } from '../../client/pages/Search/store';
import { FilterRangeOptions } from '../../client/components/FilterRange';

const getBackendData = (): IHanana[]  => {
    // здесь запрос на бек, сейчас мок(cv events.ts)
    const backendData: IBackendHanana[] = listOfEvents;
    const allHananas = backendData.map(({id, resourceContent }) => ({
        id,
        ...resourceContent,
    }));

    return allHananas;
};

const getFiltersVariants = (hananas: IHanana[]): FiltersVariants => {
    let filterHostOptions = new Set<string>();
    let filterBeginDateOptions = new Set<string>();
    let filterMinPriceRangeOptions = [ Infinity, 0 ];
    let filterCapacityRangeOptions = [ Infinity, 0 ];

    hananas.forEach(hanana => {
        filterHostOptions.add(hanana.host);
        filterBeginDateOptions.add(hanana.beginDate);

        filterMinPriceRangeOptions = setMinMax(filterMinPriceRangeOptions, hanana.minPrice);
        filterCapacityRangeOptions = setMinMax(filterCapacityRangeOptions, hanana.capacity);
    });


    return {
        filterHostOptions: Array.from(filterHostOptions).sort(),
        filterBeginDateOptions: Array.from(filterBeginDateOptions).sort(),
        filterMinPriceRangeOptions,
        filterCapacityRangeOptions,
    };
};


const getPreloadedState = (req: Request, filrersVariants: FiltersVariants): RootStateType => {
    const { host, beginDate, minPrice, capacity } = req.query;
    // host=АПГ,lol&beginDate=21.01.2021,07.12.2022&minPrice=0-3000&capacity=2-300

    const result:RootStateType = {
        optionFilters: {
            host: parseOptionsFilterValues(host, filrersVariants.filterHostOptions),
            beginDate: parseOptionsFilterValues(beginDate, filrersVariants.filterBeginDateOptions),
        },
        rangeFilters: {
            minPrice: parseRangeFilterValues(minPrice, filrersVariants.filterMinPriceRangeOptions),
            capacity: parseRangeFilterValues(capacity, filrersVariants.filterCapacityRangeOptions),
        },
    };

    return result;
};

// TODO вынести в общее место
export const parseOptionsFilterValues = (queryValue: any, filrerVariants: string[]): string[] => {
    if (!queryValue || typeof queryValue !== 'string') {
        return [];
    }

    const values = queryValue.split(',');
    return values.filter(val => filrerVariants.includes(val));
} 

export const parseRangeFilterValues = (queryValue: any, filrerVariants: number[]): FilterRangeOptions => {
    if (!queryValue || typeof queryValue !== 'string') {
        return {
            min: filrerVariants[0],
            max: filrerVariants[1],
        };
    }

    const [min, max] = queryValue.split('-');
    return {
        min: Number(min),
        max: Number(max),
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
    const hananas = getBackendData();
    const filtersVariants = getFiltersVariants(hananas);
    const preloadedState = getPreloadedState(req, filtersVariants);

    const pageParams: IPageParams = {
        initialData: {
            hananas,
            ...filtersVariants,
        },
        store: createAppStore(preloadedState),
        title: 'Search',
        description: 'My search',
        pageName: 'search',
        PageComponent: SearchPage,
    };

    return severRenderAndSend(req, res, next, pageParams);
}

export default search;