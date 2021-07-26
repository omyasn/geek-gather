import { IHanana, IHananaMap } from '../../../common/commonTypes';
import { intersection, mapOfHananas } from './helpers';

import { OptionFiltersState } from './optionFiltersSlice';
import { RangeFiltersState } from './rangeFiltersSlice';
import { FiltersValues, SubsetsStorage } from './page';


export const getFilteredFromSubsets = (hananas: IHanana[], filtersValues: FiltersValues, subsetsStorage: SubsetsStorage): [IHanana[], any] => {
    const optionFiltersNames = Object.keys(filtersValues.optionFilters);
    const rangesFiltersNames = Object.keys(filtersValues.rangeFilters);

    let activeFiltersNames: (keyof OptionFiltersState)[] = [];
    let passiveFiltersNames: (keyof OptionFiltersState)[] = [];
    const finalFiltersAvability: any = {
        host: [],
        beginDate: [],
        location: [],
        color: [],
    };

    // TODO возможно стоит везде хранить в формате мапы
    const hananasMap = mapOfHananas(hananas);
    const allSetsMap: Map<string, number[]> = new Map();

    optionFiltersNames.forEach(f => {
        if (filtersValues.optionFilters[f].length > 0) {
            activeFiltersNames.push(f);
        } else {
            passiveFiltersNames.push(f);
        }
    });

    if (activeFiltersNames.length === 0) {
        const filterdHananas = hananas.filter(hanana => checkAllRangeFilters(rangesFiltersNames, filtersValues, hanana));
        const filtredHananasIDs: number[] = filterdHananas.map(hanana => hanana.id);

        passiveFiltersAvailability(filtredHananasIDs, hananasMap, passiveFiltersNames, finalFiltersAvability);

        return [filterdHananas, finalFiltersAvability];
    }

    activeFiltersNames.forEach(filterName => {
        let filterAllValuesSet: number[] = [];
        filtersValues.optionFilters[filterName].forEach(
            // можно не проверять наличие, так как после выбора этих фильтров сеты обновились и такой сет точно есть
            // для выбранного фильтра сеты его выбранных значений надо объединить
            value => filterAllValuesSet = filterAllValuesSet.concat(...subsetsStorage[filterName][value])
        );
        allSetsMap.set(filterName, filterAllValuesSet);
    });
    console.log('allSetsMap BEFORE range filters', allSetsMap);

    //TODO для range фильтров не можем определить активность, так как в них всегда установлены граничные значения
    rangesFiltersNames.forEach(filterName => {
        const filteredHanans = hananas.filter(hanana => (checkRangeFilter(filtersValues, filterName, hanana)));

        allSetsMap.set(filterName, filteredHanans.map(hanana => hanana.id));
    });

    console.log('allSetsMap AFTER range filters', allSetsMap);

    // id отфильтрованных элементов
    const filtredHananasIDs = intersection(Array.from(allSetsMap.values()));

    console.log('finalFiltersAvability', finalFiltersAvability);

    // доступные значения пассивных фильтров
    passiveFiltersAvailability(
        filtredHananasIDs,
        hananasMap,
        passiveFiltersNames,
        finalFiltersAvability
    );

    console.log('finalFiltersAvability', finalFiltersAvability);

    // доступные значения активных фильтров
    activeFiltersAvability(allSetsMap, hananasMap, finalFiltersAvability);

    const filtredHananas = filtredHananasIDs.map(id => hananasMap.get(id));

    console.log('filtredHananasIDs', filtredHananasIDs);
    console.log('finalFiltersAvability', finalFiltersAvability);

    return [filtredHananas, finalFiltersAvability];
};


function checkAllRangeFilters(rangesFiltersNames: (keyof RangeFiltersState)[], filtersValues: FiltersValues, hanana: IHanana) {
    let pass = true;

    rangesFiltersNames.forEach(filterName => {
        pass = pass && checkRangeFilter(filtersValues, filterName, hanana);
    });

    return pass;
}


function checkRangeFilter(filtersValues: FiltersValues, filterName: (keyof RangeFiltersState), hanana: IHanana): boolean {
    return (!filtersValues.rangeFilters[filterName].min || filtersValues.rangeFilters[filterName].min <= Number(hanana[filterName])) &&
        (!filtersValues.rangeFilters[filterName].max || filtersValues.rangeFilters[filterName].max >= Number(hanana[filterName]));
}

// TODO не менять finalFiltersAvability, а возвращать
function passiveFiltersAvailability(filtredHananasIDs: number[], hananasMap: IHananaMap, passiveFiltersNames: (keyof OptionFiltersState)[], finalFiltersAvability: any) {
    const passivResult: any = {};
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
        finalFiltersAvability[filt] = Array.from(passivResult[filt as keyof OptionFiltersState]);
    }
}

// TODO не менять finalFiltersAvability, а возвращать
// доступные значения для активных фильтров
function activeFiltersAvability(allSetsMap: Map<string, number[]>, hananasMap: IHananaMap, finalFiltersAvability: any) {
    if (allSetsMap.size > 1) {
        const activeResult: any = {};
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

        for (const filt in activeResult) {
            finalFiltersAvability[filt] = Array.from(activeResult[filt as keyof OptionFiltersState]);
        }
    }
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
