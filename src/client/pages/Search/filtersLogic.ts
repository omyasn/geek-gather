import { IHanana, IHananaMap } from '../../../common/commonTypes';
import { intersection, mapOfHananas } from './helpers';

import { OptionFiltersState } from './optionFiltersSlice';
import { RangeFiltersState } from './rangeFiltersSlice';
import { FiltersValues, SubsetsStorage } from './page';


type FiltersAvailability = {
    [key in keyof OptionFiltersState | keyof RangeFiltersState]?: string[];
};

interface FilterAvailProcessResult {
    [key: string]: Set<string>;
};


export const getFilteredFromSubsets = (hananas: IHanana[], filtersValues: FiltersValues, subsetsStorage: SubsetsStorage): [IHanana[], FiltersAvailability] => {
    const optionFiltersNames = Object.keys(filtersValues.optionFilters);
    const rangesFiltersNames = Object.keys(filtersValues.rangeFilters);

    // TODO возможно стоит везде хранить в формате мапы
    const hananasMap = mapOfHananas(hananas);
    const allSetsMap: Map<string, number[]> = new Map();

    let finalFiltersAvailability: FiltersAvailability = {};

    const activeRangeFiltersNames: (keyof RangeFiltersState)[] = rangesFiltersNames.filter(f => {
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

        finalFiltersAvailability = passiveOptionsFiltersAvailability(filtredHananasIDs, hananasMap, passiveOptionsFiltersNames, finalFiltersAvailability);

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
    finalFiltersAvailability = passiveOptionsFiltersAvailability(
        filtredHananasIDs,
        hananasMap,
        passiveOptionsFiltersNames,
        finalFiltersAvailability
    );

    // доступные значения активных фильтров
    finalFiltersAvailability = activeOptionsFiltersAvability(allSetsMap, hananasMap, finalFiltersAvailability);

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
    return (!filtersValues.rangeFilters[filterName].min.current || filtersValues.rangeFilters[filterName].min.current <= Number(hanana[filterName])) &&
        (!filtersValues.rangeFilters[filterName].max.current || filtersValues.rangeFilters[filterName].max.current >= Number(hanana[filterName]));
}

function passiveOptionsFiltersAvailability(filtredHananasIDs: number[], hananasMap: IHananaMap, passiveFiltersNames: (keyof OptionFiltersState)[], finalFiltersAvailability: FiltersAvailability) {
    const passivResult: FilterAvailProcessResult = {};
    const newFiltersAvailability = { ...finalFiltersAvailability };
    filtredHananasIDs.forEach(id => {
        const hanana = hananasMap.get(id);
        passiveFiltersNames.forEach(filterName => {
            if (passivResult[filterName]) {
                passivResult[filterName].add(hanana[filterName]);
            } else {
                passivResult[filterName] = new Set([hanana[filterName]]);
            }
        });
    });

    for (const filt in passivResult) {
        newFiltersAvailability[filt as keyof OptionFiltersState] = Array.from(passivResult[filt as keyof OptionFiltersState]);
    }

    return newFiltersAvailability;
}

function activeOptionsFiltersAvability(allSetsMap: Map<string, number[]>, hananasMap: IHananaMap, finalFiltersAvailability: FiltersAvailability) {
    if (allSetsMap.size > 1) {
        const activeResult: FilterAvailProcessResult = {};
        const newFilterAvailability = { ...finalFiltersAvailability };
        for (let filterName of allSetsMap.keys()) {
            const otherFiltersArray: Array<number>[] = [];
            allSetsMap.forEach((value, key) => {
                if (key !== filterName) {
                    otherFiltersArray.push(value);
                }
            });

            const setForValues = intersection(otherFiltersArray);
            setForValues.forEach(id => {
                const hanana = hananasMap.get(id);
                if (activeResult[filterName]) {
                    activeResult[filterName].add(hanana[filterName as keyof OptionFiltersState]);
                } else {
                    activeResult[filterName] = new Set([hanana[filterName as keyof OptionFiltersState]]);
                }
            });
        }

        // тут не as keyof OptionFiltersState а еше и RangeFiltersState
        for (const filt in activeResult) {
            newFilterAvailability[filt as keyof OptionFiltersState] = Array.from(activeResult[filt as keyof OptionFiltersState]);
        }

        return newFilterAvailability;
    }

    return finalFiltersAvailability;
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
