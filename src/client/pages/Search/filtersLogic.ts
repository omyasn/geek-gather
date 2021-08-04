import { IHanana, IHananaMap } from '../../../common/commonTypes';
import { intersection, mapOfHananas } from './helpers';

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

    console.log('finalFiltersAvailability', finalFiltersAvailability);
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
            if (result[filterName]) {
                result[filterName].add(hanana[filterName]);
            } else {
                result[filterName] = new Set([hanana[filterName]]);
            }
        });
    });

    for (const filt in result) {
        filtersAvailability[filt as keyof OptionFiltersState] = Array.from(result[filt as keyof OptionFiltersState]);
    }

    return filtersAvailability;
}

function activeOptionsFiltersAvability(activeNames: (keyof OptionFiltersState)[], allSetsMap: Map<string, number[]>, hananasMap: IHananaMap): FiltersAvailability {
    // в нашем случае быть не может, но для полноты функции
    if (allSetsMap.size === 0) {
        return {};
    }
    
    // если один option фильтр и 0 range. Наоборот быть не может, так как тогда 0 option фильтров и это другая ветка
    if (allSetsMap.size === 1) {
        const filterAvailability: FiltersAvailability = {};
        filterAvailability[activeNames[0]] = null;
        return filterAvailability;
    }

    // allSetsMap.size > 1, allSetsMap.size === 0 не может быть, так как если есть хоть 1 активный фильтр, то будет и сет
    const result: FilterAvailabilityProcess = {};
    const filterAvailability: FiltersAvailability = {};

    activeNames.forEach(filterName => {
        const otherFiltersArray: Array<number>[] = [];
        allSetsMap.forEach((value, key) => {
            if (key !== filterName) {
                otherFiltersArray.push(value);
            }
        });

        const subsetForActiveValues = intersection(otherFiltersArray);
        subsetForActiveValues.forEach(id => {
            const hanana = hananasMap.get(id);
            if (result[filterName]) {
                result[filterName].add(hanana[filterName]);
            } else {
                result[filterName] = new Set([hanana[filterName]]);
            }
        });

        if (result[filterName]) {
            filterAvailability[filterName] = Array.from(result[filterName]);
        }

    })

    return filterAvailability;
}


// {
//     host: {
//         host1: [1, 5, 6],
//         apg: [2,3,4]
//     },
//     color: {
//         red: [1, 5, 6],
//         blue: [2,3,4]
//     },
// }
// Дополнять сабсеты можно только если не изменилс список  hananas(сейчас он может измениться только при перезагрузке страницы, так что все норм)
// сейчас для range фильтров не добавляются сабсеты и не считаются доступные значения. Надо ли это вообще?
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
