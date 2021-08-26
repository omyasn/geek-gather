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
import { optionsFN } from '../../client/components/FilterOptions/optionFiltersSlice';
import { rangeFN } from '../../client/components/FilterRange/rangeFiltersSlice';

const getBackendData = (): IHanana[]  => {
    // здесь запрос на бек, сейчас мок(events.ts)
    const backendData: IBackendHanana[] = listOfEvents;
    const allHananas = backendData.map(({id, resourceContent }) => ({
        id,
        ...resourceContent,
    }));

    return allHananas;
};

const optionsFNarr = Object.values(optionsFN);
const rangeFNarr = Object.values(rangeFN);


type OptionsFilterValues = {
    [key in optionsFN]?: Set<string>;
}

type RangeFilterValues = {
    [key in rangeFN]?: number[];
}

const getFiltersVariants = (hananas: IHanana[]): FiltersVariants => {
    const uniqueVariants: OptionsFilterValues & RangeFilterValues = {};
    optionsFNarr.forEach(name => {
        uniqueVariants[name] = new Set<string>();
    });
    rangeFNarr.forEach(name => {
        uniqueVariants[name] = [ Infinity, 0 ];
    });

    hananas.forEach(hanana => {
        optionsFNarr.forEach(name => {
            uniqueVariants[name].add(hanana[name]);
        });

        rangeFNarr.forEach(name => {
            uniqueVariants[name] = setMinMax(uniqueVariants[name], hanana[name]);
        });
    });

    const result: Partial<FiltersVariants> = {};
    optionsFNarr.forEach(name => {
        result[name] = Array.from(uniqueVariants[name]).sort();
    });

    rangeFNarr.forEach(name => {
        result[name] = uniqueVariants[name];
    });


    return result as FiltersVariants;
};


const getPreloadedState = (req: Request, filrersVariants: FiltersVariants): RootStateType => {
    // host=АПГ,lol&beginDate=21.01.2021,07.12.2022&minPrice=0-3000&capacity=2-300

    const optionFilters: { [key in optionsFN]?: string[] } = {};
    const rangeFilters: { [key in rangeFN]?: FilterRangeOptions } = {};

    optionsFNarr.forEach(name => {
        optionFilters[name] = parseOptionsFilterValues(req.query[name], filrersVariants[name]);
    });

    rangeFNarr.forEach(name => {
        rangeFilters[name] = parseRangeFilterValues(req.query[name], filrersVariants[name])
    });

    const result = {
        optionFilters,
        rangeFilters,
    } as RootStateType;

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
    const initialData: IPageProps = {
        hananas,
        filtersVariants,
    };

    const pageParams: IPageParams = {
        initialData,
        store: createAppStore(preloadedState),
        title: 'Search',
        description: 'My search',
        pageName: 'search',
        PageComponent: SearchPage,
    };

    return severRenderAndSend(req, res, next, pageParams);
}

export default searchPage;

