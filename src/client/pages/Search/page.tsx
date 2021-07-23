import * as React from 'react';
import { ChangeEvent, useState } from 'react';
import { Dispatch, ThunkDispatch } from '@reduxjs/toolkit';

import { useAppDispatch,  useAppSelector } from './hooks';
import FilterOptions from '../../components/FilterOptions/index';
import FilterRange, { FilterRangeOptions } from '../../components/FilterRange/index';
import { IHanana, IHananaMap } from '../../../common/commonTypes';
import { intersection, mapOfHananas } from './helpers';

import {
    addOptionWithHistory,
    removeOptionWithHistory,
    selectFilterHost,
    selectFilterBeginDate,
    selectFilterLocation,
    selectFilterColor,
    selectOptionFilters,
    OptionFiltersState,
} from './optionFiltersSlice';

import {
    changeRangewithHistory,
    selectFilterCapacity,
    selectFilterMinPrice,
    selectRangeFilters,
    RangeFiltersState,
} from './rangeFiltersSlice';

import styles from './styles.scss';

// TODO разделить логику фильтров, отрисовку страницы итд 

// TODO тут ? для удобства, хз нужен или нет
interface FiltersValues {
    optionFilters?: OptionFiltersState;
    rangeFilters?: RangeFiltersState;
}

export interface FiltersVariants {
    filterHostOptions: string[];
    filterBeginDateOptions: string[];
    filterLocationOptions: string[];
    filterColorOptions: string[];
    filterMinPriceRangeOptions: number[];
    filterCapacityRangeOptions: number[];  
}

export interface IPageProps extends FiltersVariants {
    hananas: IHanana[];
};

// TODO определить тип dispatch, скорее всего ThunkDispatch с предустановленными типами
const onOptionsFilterChange = (name: keyof OptionFiltersState, dispatch: any) => 
    (value: string) => 
    ({ target }: ChangeEvent<HTMLInputElement>): void => {
        const isChecked = target.checked;
        if (isChecked) {
            dispatch(addOptionWithHistory({ name, value }));
        } else {
             dispatch(removeOptionWithHistory({ name, value }));
        }
    };

// TODO определить тип dispatch, скорее всего ThunkDispatch с предустановленными типами
const onRangeFilterChange = (name: keyof RangeFiltersState, dispatch: any) => 
    (edge: keyof FilterRangeOptions) =>
    ({ target }: ChangeEvent<HTMLInputElement>) => {
        const value = target.value;
        dispatch(changeRangewithHistory({ name, edge, value: Number(value)}));
    };



const getFilteredFromSubsets = (hananas: IHanana[], filtersValues: FiltersValues): [IHanana[], any] => {
    const optionFiltersNames = Object.keys(filtersValues.optionFilters);
    const usingFiltersNames = optionFiltersNames.filter(f => filtersValues.optionFilters[f].length > 0);
    const finalFiltersAvability: any = {
        host: [],
        beginDate: [],
        location: [],
        color: [],
    };

    if (usingFiltersNames.length === 0) {
        return [hananas, finalFiltersAvability];
    }
    // TODO возможно стоит везде хранить в формате мапы
    const hananasMap = mapOfHananas(hananas);

    //TODO такой отбор предпоклагает что в filtersValues всегда есть все названия фильтров(сейчас в типе не так)
    const passiveFiltersNames = optionFiltersNames.filter(f => filtersValues.optionFilters[f].length === 0);
    const allSets: Array<number>[] = [];
    const allSetsMap: Map<string, number[]> = new Map();

    usingFiltersNames.forEach(filterName => {
        let filterAllValuesSet: number[] = [];
        filtersValues.optionFilters[filterName].forEach(
            // можно не проверять наличие, так как после выбора этих фильтров сеты обновились и такой сет точно есть
            // для выбранного фильтра сеты его выбранных значений надо объединить
            value => filterAllValuesSet = filterAllValuesSet.concat(...subsets[filterName][value])
        );
        allSets.push(filterAllValuesSet);
        allSetsMap.set(filterName, filterAllValuesSet);
    });

    // id отфильтрованных элементов
    const filtredHananasIDs = intersection(allSets);

    // доступные значения пассивных фильтров
    const passivResult: any = {};
    filtredHananasIDs.forEach(id => {
        const hanana = hananasMap.get(id);
        passiveFiltersNames.forEach(filterName => {
            if (passivResult[filterName]) {
                passivResult[filterName].add(hanana[filterName]);
            } else {
                passivResult[filterName] = new Set([ hanana[filterName] ]);
            }
        });
    });

    for (const filt in passivResult) {
        finalFiltersAvability[filt] = Array.from(passivResult[filt as keyof OptionFiltersState]);
    }

    if (usingFiltersNames.length > 1) {
        // доступные значения для активных фильтров
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

    const filtredHananas = filtredHananasIDs.map(id => hananasMap.get(id));

    console.log('filtredHananasIDs', filtredHananasIDs);
    console.log('finalFiltersAvability', finalFiltersAvability);

    return [ filtredHananas, finalFiltersAvability]
}

    // Может это надо в стор или сделать переменной класса
    // старые сабсеты надо пересчитывать только если изменился hananas
    // возможно это надо проверять в lifecycle methods

    
const subsets:any = {}; 
// {
//     host: {
//         qwe: [1, 5, 6],
//         rew: [2,3,4]
//     },
//     color: {
//         red: [1, 5, 6],
//         blue: [2,3,4]
//     },
// }
// может запихнуть это в useEffect?
// Дополнять сабсеты можно только если не изменилс список  hananas
const makeSubsets = (hananas: IHanana[], filtersValues: FiltersValues) => {
    const optionFiltersNames = Object.keys(filtersValues.optionFilters);

    // вообще тут можно толкьо для новых установленных фильтров
    optionFiltersNames.map(filterName => {
        const filterValues = filtersValues.optionFilters[filterName]; // ['red', 'blue']
        filterValues.map(value => {
            // если сабсет для этого значения еще не вычислен
            if (!subsets[filterName]?.[value]) {
                if (!subsets[filterName]) { subsets[filterName] = {}; }
                subsets[filterName][value] = hananas.filter(hanana => (hanana[filterName] === value)).map(i => i.id);
            }
        });
    });
};


const SearchPage: React.FC<IPageProps> = ({
    hananas,
    filterHostOptions,
    filterBeginDateOptions,   
    filterLocationOptions,   
    filterColorOptions,   
}) => {
    const dispatch = useAppDispatch();

    const filterHostValues = useAppSelector(selectFilterHost);
    const onHostFilterClick = onOptionsFilterChange('host', dispatch);

    const filterBeginDateValues = useAppSelector(selectFilterBeginDate);
    const onBeginDateFilterClick = onOptionsFilterChange('beginDate', dispatch);

    const filterLocationValues = useAppSelector(selectFilterLocation);
    const onLocationFilterClick = onOptionsFilterChange('location', dispatch);
    
    const filterColorValues = useAppSelector(selectFilterColor);
    const onColorFilterClick = onOptionsFilterChange('color', dispatch);

    const filterMinPriceRange = useAppSelector(selectFilterMinPrice);
    const onMinPriceRangeChange = onRangeFilterChange('minPrice', dispatch);

    const filterCapacityRange = useAppSelector(selectFilterCapacity);
    const onCapacityRangeChange = onRangeFilterChange('capacity', dispatch);

    const currentFilters = useAppSelector(state => ({
        optionFilters: selectOptionFilters(state),
        rangeFilters: selectRangeFilters(state),
    }));

    makeSubsets(hananas, currentFilters);
    const [filtredHananas, activeFiltersValues] = getFilteredFromSubsets(hananas, currentFilters);
    console.log(subsets);

    return (
        <div>
            <div className={styles.kek}>It's search Page!</div>

            <div>
                <div>
                    <FilterOptions
                        name="Host"
                        filterOptions={filterHostOptions}
                        filterValues={filterHostValues}
                        filterActiveOptions={activeFiltersValues.host}
                        onOptionChange={onHostFilterClick}
                    />

                    <FilterOptions
                        name="BeginDate"
                        filterOptions={filterBeginDateOptions}
                        filterValues={filterBeginDateValues}
                        filterActiveOptions={activeFiltersValues.beginDate}
                        onOptionChange={onBeginDateFilterClick}
                    />

                    <FilterOptions
                        name="Location"
                        filterOptions={filterLocationOptions}
                        filterValues={filterLocationValues}
                        filterActiveOptions={activeFiltersValues.location}
                        onOptionChange={onLocationFilterClick}
                    />

                    <FilterOptions
                        name="Color"
                        filterOptions={filterColorOptions}
                        filterValues={filterColorValues}
                        filterActiveOptions={activeFiltersValues.color}
                        onOptionChange={onColorFilterClick}
                    />
                
                    <FilterRange
                        name="MinPrice"
                        filterRange={filterMinPriceRange}
                        onRangeChange={onMinPriceRangeChange}
                    />

                    <FilterRange
                        name="Capacity"
                        filterRange={filterCapacityRange}
                        onRangeChange={onCapacityRangeChange}
                    />
                </div>

                <div>
                    {filtredHananas.map(hanana => (
                        <div style={{ border: "1px solid black" }} key={hanana.id}>
                            <h3>{hanana.title} {hanana.id}</h3>
                            <div>{hanana.beginDate}</div>
                            <div>Capacity: {hanana.capacity}</div>
                            <div>MinPrice: {hanana.minPrice}</div>
                            <div>Host: {hanana.host}</div>
                            <div>Location: {hanana.location}</div>
                            <div>Color: {hanana.color}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;