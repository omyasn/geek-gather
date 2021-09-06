import { IHanana, IHananaMap } from '../../../common/commonTypes';
import { intersection, mapOfHananas, createOrAddToSet } from './helpers';

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
export const makeSubsets = (hananas: IHanana[], filtersValues: FiltersValues, subsetsStorage: SubsetsStorage): SubsetsStorage => {
    const newSubsets = { ...subsetsStorage };

    optionsFNArr.map(filterName => {
        const filterValues = filtersValues.optionFilters[filterName];
        filterValues.map(value => {
            if (!newSubsets[filterName]?.[value]) {
                if (!newSubsets[filterName]) { newSubsets[filterName] = {}; }
                newSubsets[filterName][value] = hananas.filter(hanana => (hanana[filterName] === value)).map(i => i.id);
            }
        });
    });

    return newSubsets;
};


export const getFilteredFromSubsets = (hananas: IHanana[], filtersValues: FiltersValues, subsetsStorage: SubsetsStorage): [IHanana[], FiltersAvailability] => {
    const optionFiltersNames = optionsFNArr;
    const rangesFiltersNames = rangeFNArr;

    const hananasMap = mapOfHananas(hananas);

    const activeRangeFiltersNames: rangeFN[] = getActiveRangeFiltersNames(rangesFiltersNames, filtersValues);
    const { activeOptionsFiltersNames, passiveOptionsFiltersNames } = divideOptionFiltersNames(optionFiltersNames, filtersValues);

    if (activeOptionsFiltersNames.length === 0) {
        const filterdHananas = hananas.filter(hanana => checkAllRangeFilters(activeRangeFiltersNames, filtersValues, hanana));
        const filtredHananasIDs: number[] = filterdHananas.map(hanana => hanana.id);

        const finalFiltersAvailability = passiveOptionsFiltersAvailability(filtredHananasIDs, hananasMap, passiveOptionsFiltersNames);

        return [filterdHananas, finalFiltersAvailability];
    }

    const allSetsMap: Map<string, number[]> = fillUsedSets(activeOptionsFiltersNames, activeRangeFiltersNames, filtersValues, subsetsStorage, hananas);

    // id отфильтрованных элементов
    const filtredHananasIDs = intersection(Array.from(allSetsMap.values()));

    // доступные значения пассивных фильтров
    const passiveAvailability = passiveOptionsFiltersAvailability(
        filtredHananasIDs,
        hananasMap,
        passiveOptionsFiltersNames
    );

    // доступные значения активных фильтров
    const activeAvailability = activeOptionsFiltersAvability(activeOptionsFiltersNames, allSetsMap, hananasMap);

    const finalFiltersAvailability = {
        ...passiveAvailability,
        ...activeAvailability,
    };

    const filtredHananas = filtredHananasIDs.map(id => hananasMap.get(id));

    return [filtredHananas, finalFiltersAvailability];
};


function fillUsedSets(
    activeOptionsFiltersNames: optionsFN[], 
    activeRangeFiltersNames: rangeFN[], 
    filtersValues: FiltersValues, 
    subsetsStorage: SubsetsStorage, 
    hananas: IHanana[]
) {
    const allSetsMap: Map<string, number[]> = new Map();
    activeOptionsFiltersNames.forEach(filterName => {
        let filterAllValuesSet: number[] = [];
        filtersValues.optionFilters[filterName].forEach(
            // можно не проверять наличие, так как после выбора этих фильтров сеты обновились и такой сет точно есть
            // для выбранного фильтра сеты его выбранных значений надо объединить
            value => filterAllValuesSet = filterAllValuesSet.concat(...subsetsStorage[filterName][value])
        );
        allSetsMap.set(filterName, filterAllValuesSet);
    });

    activeRangeFiltersNames.forEach(filterName => {
        const filteredHanans = hananas.filter(hanana => (checkRangeFilter(filtersValues, filterName, hanana)));

        allSetsMap.set(filterName, filteredHanans.map(hanana => hanana.id));
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

function checkAllRangeFilters(rangesFiltersNames: rangeFN[], filtersValues: FiltersValues, hanana: IHanana) {
    let pass = true;

    rangesFiltersNames.forEach(filterName => {
        pass = pass && checkRangeFilter(filtersValues, filterName, hanana);
    });

    return pass;
}

function checkRangeFilter(filtersValues: FiltersValues, filterName: rangeFN, hanana: IHanana): boolean {
    const filter = filtersValues.rangeFilters[filterName];
    return (!filter.min.current || filter.min.current <= Number(hanana[filterName])) &&
        (!filter.max.current || filter.max.current >= Number(hanana[filterName]));
}


function passiveOptionsFiltersAvailability(filtredHananasIDs: number[], hananasMap: IHananaMap, passiveFiltersNames: optionsFN[]): FiltersAvailability {
    const result: FilterAvailabilityProcess = {};
    const filtersAvailability: FiltersAvailability = {};

    filtredHananasIDs.forEach(id => {
        const hanana = hananasMap.get(id);
        passiveFiltersNames.forEach(filterName => {
            result[filterName] = createOrAddToSet(result[filterName], hanana[filterName]);
        });
    });

    for (const filter in result) {
        filtersAvailability[filter as keyof OptionFiltersState] = Array.from(result[filter as keyof OptionFiltersState]);
    }

    return filtersAvailability;
}

function activeOptionsFiltersAvability(activeNames: optionsFN[], allSetsMap: Map<string, number[]>, hananasMap: IHananaMap): FiltersAvailability {
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
            const hanana = hananasMap.get(id);
            result[filterName] = createOrAddToSet(result[filterName], hanana[filterName]);
        });

        if (result[filterName]) {
            filterAvailability[filterName] = Array.from(result[filterName]);
        }

    })

    return filterAvailability;
}

function getSubsetForActiveValues (currentFilter: string, allSetsMap: Map<string, number[]>): number[] {
    const otherFiltersArray: Array<number>[] = [];
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