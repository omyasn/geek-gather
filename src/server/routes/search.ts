import { RequestHandler, Request } from 'express';
import { ParsedQs } from 'qs';
import severRenderAndSend from '../severRenderAndSend';
import { IPageParams } from '../html/preparePage';
import { IBackendHanana, IHanana } from '../../common/commonTypes';

// TODO перенести файлы использующиеся на сервере из client в папку common
import SearchPage, { IPageProps, FiltersVariants } from '../../client/pages/Search/page';
import { listOfEvents } from '../../client/mockdata';
import createAppStore, { RootStateType } from '../../client/pages/Search/store';
import { FilterRangeOptions } from '../../client/components/FilterRange';

const getBackendData = (): IHanana[]  => {
    // здесь запрос на бек, сейчас мок(events.ts)
    const backendData: IBackendHanana[] = listOfEvents;
    const allHananas = backendData.map(({id, resourceContent }) => ({
        id,
        ...resourceContent,
    }));

    return allHananas;
};

// TODO refactor
const getFiltersVariants = (hananas: IHanana[]): FiltersVariants => {
    let filterHostOptions = new Set<string>();
    let filterColorOptions = new Set<string>();
    let filterBeginDateOptions = new Set<string>();
    let filterLocationOptions = new Set<string>();
    let filterMinPriceRangeOptions = [ Infinity, 0 ];
    let filterCapacityRangeOptions = [ Infinity, 0 ];

    hananas.forEach(hanana => {
        filterHostOptions.add(hanana.host);
        filterColorOptions.add(hanana.color);
        filterBeginDateOptions.add(hanana.beginDate);
        filterLocationOptions.add(hanana.location);

        filterMinPriceRangeOptions = setMinMax(filterMinPriceRangeOptions, hanana.minPrice);
        filterCapacityRangeOptions = setMinMax(filterCapacityRangeOptions, hanana.capacity);
    });


    return {
        filterHostOptions: Array.from(filterHostOptions).sort(),
        filterColorOptions: Array.from(filterColorOptions).sort(),
        filterBeginDateOptions: Array.from(filterBeginDateOptions).sort(),
        filterLocationOptions: Array.from(filterLocationOptions).sort(),
        filterMinPriceRangeOptions,
        filterCapacityRangeOptions,
    };
};


const getPreloadedState = (req: Request, filrersVariants: FiltersVariants): RootStateType => {
    const { host, beginDate, minPrice, capacity, location, color } = req.query;
    // host=АПГ,lol&beginDate=21.01.2021,07.12.2022&minPrice=0-3000&capacity=2-300

    const result: RootStateType = {
        optionFilters: {
            host: parseOptionsFilterValues(host, filrersVariants.filterHostOptions),
            beginDate: parseOptionsFilterValues(beginDate, filrersVariants.filterBeginDateOptions),
            location: parseOptionsFilterValues(location, filrersVariants.filterLocationOptions),
            color: parseOptionsFilterValues(color, filrersVariants.filterColorOptions),
        },
        rangeFilters: {
            minPrice: parseRangeFilterValues(minPrice, filrersVariants.filterMinPriceRangeOptions),
            capacity: parseRangeFilterValues(capacity, filrersVariants.filterCapacityRangeOptions),
        },
    };

    return result;
};

const parseOptionsFilterValues = (queryValue: string | string[] | ParsedQs | ParsedQs[], filterVariants: string[]): string[] => {
    if (!queryValue || typeof queryValue !== 'string') {
        return [];
    }

    const values = queryValue.split(',');
    return values.filter(val => filterVariants.includes(val));
} 

const parseRangeFilterValues = (queryValue: string | string[] | ParsedQs | ParsedQs[], filterVariants: number[]): FilterRangeOptions => {
    if (!queryValue || typeof queryValue !== 'string') {
        return {
            min: { limit: filterVariants[0] },
            max: { limit: filterVariants[1] },
        };
    }

    const [min, max] = queryValue.split('-');
    return {
        min: {
            limit: filterVariants[0],
            current: Number(min),
        },
        max: {
            limit: filterVariants[1],
            current: Number(max),
        },
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

const searchPage: RequestHandler = (req, res, next) => {
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

export default searchPage;