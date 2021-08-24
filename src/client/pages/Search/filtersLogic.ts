import { IHanana, IHananaMap } from '../../../common/commonTypes';
import { intersection, mapOfHananas, createOrAddToSet } from './helpers';

import { OptionFiltersState } from './optionFiltersSlice';
import { RangeFiltersState } from './rangeFiltersSlice';
import { FiltersValues, SubsetsStorage } from './page';


type FiltersAvailability = {
    [key in keyof OptionFiltersState]?: string[];
};

interface FilterAvailabilityProcess {
    [key: string]: Set<string>;
};

export const getFilteredFromSubsets = (hananas: IHanana[], filtersValues: FiltersValues, subsetsStorage: SubsetsStorage): [IHanana[], FiltersAvailability] => {
    // TODO если имена фильтров будут задаваться enum, то тут можно их будет использовать
    const optionFiltersNames = Object.keys(filtersValues.optionFilters);
    const rangesFiltersNames = Object.keys(filtersValues.rangeFilters);

    // TODO возможно стоит везде хранить в формате мапы
    const hananasMap = mapOfHananas(hananas);
    const allSetsMap: Map<string, number[]> = new Map();

    const activeRangeFiltersNames: (keyof RangeFiltersState)[] = rangesFiltersNames.filter(f => {
        // TODO можно заменить на массив [min, max], но тогда надо это описать и в типах
        const edgeNames = Object.keys(filtersValues.rangeFilters[f])
        
        return edgeNames.some(edge => (
            filtersValues.rangeFilters[f][edge].current 
            && filtersValues.rangeFilters[f][edge].current !== filtersValues.rangeFilters[f][edge].limit 
        ));
    });

    let activeOptionsFiltersNames: (keyof OptionFiltersState)[] = [];
    let passiveOptionsFiltersNames: (keyof OptionFiltersState)[] = [];

    optionFiltersNames.forEach(f => {
        if (filtersValues.optionFilters[f].length > 0) {
            activeOptionsFiltersNames.push(f);
        } else {
            passiveOptionsFiltersNames.push(f);
        }
    });

    if (activeOptionsFiltersNames.length === 0) {
        const filterdHananas = hananas.filter(hanana => checkAllRangeFilters(activeRangeFiltersNames, filtersValues, hanana));
        const filtredHananasIDs: number[] = filterdHananas.map(hanana => hanana.id);

        const finalFiltersAvailability = passiveOptionsFiltersAvailability(filtredHananasIDs, hananasMap, passiveOptionsFiltersNames);

        return [filterdHananas, finalFiltersAvailability];
    }

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


function checkAllRangeFilters(rangesFiltersNames: (keyof RangeFiltersState)[], filtersValues: FiltersValues, hanana: IHanana) {
    let pass = true;

    rangesFiltersNames.forEach(filterName => {
        pass = pass && checkRangeFilter(filtersValues, filterName, hanana);
    });

    return pass;
}

function checkRangeFilter(filtersValues: FiltersValues, filterName: (keyof RangeFiltersState), hanana: IHanana): boolean {
    const filter = filtersValues.rangeFilters[filterName];
    return (!filter.min.current || filter.min.current <= Number(hanana[filterName])) &&
        (!filter.max.current || filter.max.current >= Number(hanana[filterName]));
}


function passiveOptionsFiltersAvailability(filtredHananasIDs: number[], hananasMap: IHananaMap, passiveFiltersNames: (keyof OptionFiltersState)[]): FiltersAvailability {
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

function activeOptionsFiltersAvability(activeNames: (keyof OptionFiltersState)[], allSetsMap: Map<string, number[]>, hananasMap: IHananaMap): FiltersAvailability {
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


// create subsets only for options filters (not for range)
export const makeSubsets = (hananas: IHanana[], filtersValues: FiltersValues, subsetsStorage: SubsetsStorage): SubsetsStorage => {
    const optionFiltersNames = Object.keys(filtersValues.optionFilters);
    const newSubsets = { ...subsetsStorage };

    optionFiltersNames.map(filterName => {
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


export const __forTest = {
    passiveOptionsFiltersAvailability,
    activeOptionsFiltersAvability,
    checkAllRangeFilters,
    checkRangeFilter,
    getSubsetForActiveValues,
};