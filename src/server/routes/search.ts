import { RequestHandler, Request } from "express";
import { ParsedQs } from "qs";
import severRenderAndSend from "../severRenderAndSend";
import { IPageParams } from "../html/preparePage";
import { BackendEvent, EventType } from "../../common/commonTypes";
import SearchPage, {
  IPageProps,
  FiltersVariants,
} from "../../client/pages/Search/page";
import { events } from "../../mockData/events";
import createAppStore, { RootStateType } from "../../client/pages/Search/store";
import { FilterRangeOptions } from "../../client/components/FilterRange";
import { optionsFN } from "../../client/components/FilterOptions/optionFiltersSlice";
import { rangeFN } from "../../client/components/FilterRange/rangeFiltersSlice";

const getBackendData = (): EventType[] => {
  // query to backend, now mock(events.ts)
  const backendData: BackendEvent[] = events;
  const allEvents = backendData.map(({ id, resourceContent }) => ({
    id,
    ...resourceContent,
  }));

  return allEvents;
};

const optionsFNArr = Object.values(optionsFN);
const rangeFNArr = Object.values(rangeFN);

type OptionsFilterValues = {
  [key in optionsFN]?: Set<string>;
};

type RangeFilterValues = {
  [key in rangeFN]?: number[];
};

const getFiltersVariants = (events: EventType[]): FiltersVariants => {
  const uniqueVariants: OptionsFilterValues & RangeFilterValues = {};
  optionsFNArr.forEach((name) => {
    uniqueVariants[name] = new Set<string>();
  });
  rangeFNArr.forEach((name) => {
    uniqueVariants[name] = [Infinity, 0];
  });

  events.forEach((event) => {
    optionsFNArr.forEach((name) => {
      uniqueVariants[name].add(event[name]);
    });

    rangeFNArr.forEach((name) => {
      uniqueVariants[name] = setMinMax(uniqueVariants[name], event[name]);
    });
  });

  const result: Partial<FiltersVariants> = {};
  optionsFNArr.forEach((name) => {
    result[name] = Array.from(uniqueVariants[name]).sort();
  });

  rangeFNArr.forEach((name) => {
    result[name] = uniqueVariants[name];
  });

  return result as FiltersVariants;
};

const getPreloadedState = (
  req: Request,
  filrersVariants: FiltersVariants
): RootStateType => {
  // owner=АПГ,lol&beginDate=21.01.2021,07.12.2022&minPrice=0-3000&capacity=2-300

  const optionFilters: { [key in optionsFN]?: string[] } = {};
  const rangeFilters: { [key in rangeFN]?: FilterRangeOptions } = {};

  optionsFNArr.forEach((name) => {
    optionFilters[name] = parseOptionsFilterValues(
      req.query[name],
      filrersVariants[name]
    );
  });

  rangeFNArr.forEach((name) => {
    rangeFilters[name] = parseRangeFilterValues(
      req.query[name],
      filrersVariants[name]
    );
  });

  const result = {
    optionFilters,
    rangeFilters,
  } as RootStateType;

  return result;
};

const parseOptionsFilterValues = (
  queryValue: string | string[] | ParsedQs | ParsedQs[],
  filterVariants: string[]
): string[] => {
  if (!queryValue || typeof queryValue !== "string") {
    return [];
  }

  const values = queryValue.split(",");
  return values.filter((val) => filterVariants.includes(val));
};

const parseRangeFilterValues = (
  queryValue: string | string[] | ParsedQs | ParsedQs[],
  filterVariants: number[]
): FilterRangeOptions => {
  if (!queryValue || typeof queryValue !== "string") {
    return {
      min: { limit: filterVariants[0] },
      max: { limit: filterVariants[1] },
    };
  }

  const [min, max] = queryValue.split("-");
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
};

const setMinMax = (arr: number[], el: number): number[] => {
  if (el < arr[0]) {
    arr[0] = el;
  }

  if (el > arr[1]) {
    arr[1] = el;
  }

  return arr;
};

const searchPage: RequestHandler = (req, res, next) => {
  const events = getBackendData();
  const filtersVariants = getFiltersVariants(events);
  const preloadedState = getPreloadedState(req, filtersVariants);
  const initialData: IPageProps = {
    events,
    filtersVariants,
  };

  const pageParams: IPageParams = {
    initialData,
    store: createAppStore(preloadedState),
    title: "Search",
    description: "My search",
    pageName: "search",
    PageComponent: SearchPage,
  };

  return severRenderAndSend(req, res, next, pageParams);
};

export default searchPage;
