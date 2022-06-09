import { EventType } from '../../../common/commonTypes';
import { intersection, mapOfEvents, createOrAddToSet } from './helpers';

import { OptionFiltersState, optionsFN } from '../../components/FilterOptions/optionFiltersSlice';
import { RangeFiltersState, rangeFN } from '../../components/FilterRange/rangeFiltersSlice';
import { rangeEdges } from '../../components/FilterRange/index';
import { FiltersValues, SubsetsStorage } from './page';

const optionsFNArr = Object.values(optionsFN);
const rangeFNArr = Object.values(rangeFN);

type FiltersAvailability = {
    [key in optionsFN]?: string[];
};

interface FilterAvailabilityProcess {
    [key: string]: Set<string>;
};

// create subsets only for options filters (not for range)
export const makeSubsets = (events: EventType[], filtersValues: FiltersValues, subsetsStorage: SubsetsStorage): SubsetsStorage => {
    const newSubsets = { ...subsetsStorage };

    optionsFNArr.map(filterName => {
        const filterValues = filtersValues.optionFilters[filterName];
        filterValues.map(value => {
            if (!newSubsets[filterName]?.[value]) {
                if (!newSubsets[filterName]) { newSubsets[filterName] = {}; }
                newSubsets[filterName][value] = events.filter(event => (event[filterName] === value)).map(i => i.id);
            }
        });
    });

    return newSubsets;
};


export const getFilteredFromSubsets = (events: EventType[], filtersValues: FiltersValues, subsetsStorage: SubsetsStorage): [EventType[], FiltersAvailability] => {
    const optionFiltersNames = optionsFNArr;
    const rangesFiltersNames = rangeFNArr;

    const eventsMap = mapOfEvents(events);

    const activeRangeFiltersNames: rangeFN[] = getActiveRangeFiltersNames(rangesFiltersNames, filtersValues);
    const { activeOptionsFiltersNames, passiveOptionsFiltersNames } = divideOptionFiltersNames(optionFiltersNames, filtersValues);

    if (activeOptionsFiltersNames.length === 0) {
        const filterdEvents = events.filter(event => checkAllRangeFilters(activeRangeFiltersNames, filtersValues, event));
        const filtredEventsIDs: string[] = filterdEvents.map(event => event.id);

        const finalFiltersAvailability = passiveOptionsFiltersAvailability(filtredEventsIDs, eventsMap, passiveOptionsFiltersNames);

        return [filterdEvents, finalFiltersAvailability];
    }

    const allSetsMap: Map<string, string[]> = fillUsedSets(activeOptionsFiltersNames, activeRangeFiltersNames, filtersValues, subsetsStorage, events);

    // ids of filtred elements
    const filtredEventsIDs = intersection(Array.from(allSetsMap.values()));

    // доступные значения пассивных фильтров
    const passiveAvailability = passiveOptionsFiltersAvailability(
        filtredEventsIDs,
        eventsMap,
        passiveOptionsFiltersNames
    );

    // доступные значения активных фильтров
    const activeAvailability = activeOptionsFiltersAvability(activeOptionsFiltersNames, allSetsMap, eventsMap);

    const finalFiltersAvailability = {
        ...passiveAvailability,
        ...activeAvailability,
    };

    const filtredEvents = filtredEventsIDs.map(id => eventsMap.get(id));

    return [filtredEvents, finalFiltersAvailability];
};


function fillUsedSets(
    activeOptionsFiltersNames: optionsFN[], 
    activeRangeFiltersNames: rangeFN[], 
    filtersValues: FiltersValues, 
    subsetsStorage: SubsetsStorage, 
    events: EventType[]
) {
    const allSetsMap: Map<string, string[]> = new Map();
    activeOptionsFiltersNames.forEach(filterName => {
        let filterAllValuesSet: string[] = [];
        filtersValues.optionFilters[filterName].forEach(
            // можно не проверять наличие, так как после выбора этих фильтров сеты обновились и такой сет точно есть
            // для выбранного фильтра сеты его выбранных значений надо объединить
            value => filterAllValuesSet = filterAllValuesSet.concat(...subsetsStorage[filterName][value])
        );
        allSetsMap.set(filterName, filterAllValuesSet);
    });

    activeRangeFiltersNames.forEach(filterName => {
        const filteredEvents = events.filter(event => (checkRangeFilter(filtersValues, filterName, event)));

        allSetsMap.set(filterName, filteredEvents.map(event => event.id));
    });
    return allSetsMap;
}

function divideOptionFiltersNames(optionFiltersNames: optionsFN[], filtersValues: FiltersValues) {
    let activeOptionsFiltersNames: optionsFN[] = [];
    let passiveOptionsFiltersNames: optionsFN[] = [];

    optionFiltersNames.forEach(f => {
        if (filtersValues.optionFilters[f].length > 0) {
            activeOptionsFiltersNames.push(f);
        } else {
            passiveOptionsFiltersNames.push(f);
        }
    });
    return { activeOptionsFiltersNames, passiveOptionsFiltersNames };
}

function getActiveRangeFiltersNames(rangesFiltersNames: rangeFN[], filtersValues: FiltersValues): rangeFN[] {
    return rangesFiltersNames.filter(f => {
        const edgeNames = Object.values(rangeEdges);

        return edgeNames.some(edge => (
            filtersValues.rangeFilters[f][edge].current
            && filtersValues.rangeFilters[f][edge].current !== filtersValues.rangeFilters[f][edge].limit
        ));
    });
}

function checkAllRangeFilters(rangesFiltersNames: rangeFN[], filtersValues: FiltersValues, event: EventType) {
    let pass = true;

    rangesFiltersNames.forEach(filterName => {
        pass = pass && checkRangeFilter(filtersValues, filterName, event);
    });

    return pass;
}

function checkRangeFilter(filtersValues: FiltersValues, filterName: rangeFN, event: EventType): boolean {
    const filter = filtersValues.rangeFilters[filterName];
    return (!filter.min.current || filter.min.current <= Number(event[filterName])) &&
        (!filter.max.current || filter.max.current >= Number(event[filterName]));
}


function passiveOptionsFiltersAvailability(filtredEventsIDs: string[], eventsMap: Map<string, EventType>, passiveFiltersNames: optionsFN[]): FiltersAvailability {
    const result: FilterAvailabilityProcess = {};
    const filtersAvailability: FiltersAvailability = {};

    filtredEventsIDs.forEach(id => {
        const event = eventsMap.get(id);
        passiveFiltersNames.forEach(filterName => {
            result[filterName] = createOrAddToSet(result[filterName], event[filterName]);
        });
    });

    for (const filter in result) {
        filtersAvailability[filter as keyof OptionFiltersState] = Array.from(result[filter as keyof OptionFiltersState]);
    }

    return filtersAvailability;
}

function activeOptionsFiltersAvability(activeNames: optionsFN[], allSetsMap: Map<string, string[]>, eventsMap: Map<string, EventType>): FiltersAvailability {
    if (allSetsMap.size === 0) {
        return {};
    }
    
    // 1 option, 0 range (function call onle for option > 1)
    if (allSetsMap.size === 1) {
        const filterAvailability: FiltersAvailability = {};
        filterAvailability[activeNames[0]] = null;
        return filterAvailability;
    }

    const result: FilterAvailabilityProcess = {};
    const filterAvailability: FiltersAvailability = {};

    activeNames.forEach(filterName => {
        const subsetForActiveValues = getSubsetForActiveValues(filterName, allSetsMap);
        subsetForActiveValues.forEach(id => {
            const event = eventsMap.get(id);
            result[filterName] = createOrAddToSet(result[filterName], event[filterName]);
        });

        if (result[filterName]) {
            filterAvailability[filterName] = Array.from(result[filterName]);
        }

    })

    return filterAvailability;
}

function getSubsetForActiveValues (currentFilter: string, allSetsMap: Map<string, string[]>): string[] {
    const otherFiltersArray: Array<string>[] = [];
    allSetsMap.forEach((value, key) => {
        if (key !== currentFilter) {
            otherFiltersArray.push(value);
        }
    });

    return intersection(otherFiltersArray);
}

export const __forTest = {
    passiveOptionsFiltersAvailability,
    activeOptionsFiltersAvability,
    checkAllRangeFilters,
    checkRangeFilter,
    getSubsetForActiveValues,
};