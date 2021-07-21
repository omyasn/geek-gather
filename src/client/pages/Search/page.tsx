import * as React from 'react';
import { ChangeEvent } from 'react';
import { Dispatch, ThunkDispatch } from '@reduxjs/toolkit';

import { useAppDispatch,  useAppSelector } from './hooks';
import FilterOptions from '../../components/FilterOptions/index';
import FilterRange, { FilterRangeOptions } from '../../components/FilterRange/index';
import { IHanana } from '../../../common/commonTypes';

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

// из всех событий получаем события подходящие под фильтры
const filterHananas = (hananas: IHanana[], filtersValues: FiltersValues) => {
    const filtredHananas = hananas.filter(hanana => isHananaPassFilters(hanana, filtersValues));

    return filtredHananas;
};

const isHananaPassFilters = (hanana: IHanana, filtersValues: FiltersValues) => {
    const optionsNames = filtersValues.optionFilters ? Object.keys(filtersValues.optionFilters) : [];
    const rangesNames = filtersValues.rangeFilters ? Object.keys(filtersValues.rangeFilters) : [];
    let result = true;

    optionsNames.forEach(filterName => {
        result = result && 
            ((filtersValues.optionFilters[filterName].length > 0 && filtersValues.optionFilters[filterName].includes(hanana[filterName])) || 
            filtersValues.optionFilters[filterName].length === 0)
    });

    
    rangesNames.forEach(filterName => {
        result = result && 
        (
            (!filtersValues.rangeFilters[filterName].min || filtersValues.rangeFilters[filterName].min <= Number(hanana[filterName])) &&
            (!filtersValues.rangeFilters[filterName].max || filtersValues.rangeFilters[filterName].max >= Number(hanana[filterName]))
        )
    });

    return result;
};

const getActives = (hananas: IHanana[], optionFiltersValues: OptionFiltersState, filtredHananas: IHanana[]) => {
    const allFiltersNames = Object.keys(optionFiltersValues);
    const usingFiltersNames = allFiltersNames.filter(f => optionFiltersValues[f].length > 0);
    const passiveFiltersNames = allFiltersNames.filter(f => optionFiltersValues[f].length === 0);

    const result: any = {};

    const finalRes: any = {
        host: [],
        beginDate: [],
        location: [],
        color: [],
    };

    if (usingFiltersNames.length === 0) {
        return finalRes;
    }
 
 //если только 1 активный фильтр, то в нем не надо ограничивать никакие значения
    if (usingFiltersNames.length > 1) {
        // собираются значения только для активных фильтров
        hananas.forEach(hanana => {
            usingFiltersNames.forEach((filterName) => {
                // если hanana подходит под ВСЕ остальные активные фильтры кроме этого
                const otherFiltersNames = usingFiltersNames.filter(f => f !== filterName);
                const otherFilters: any = {};
                otherFiltersNames.forEach(name => {
                    otherFilters[name] = optionFiltersValues[name];
                });

                if (isHananaPassFilters(hanana, { optionFilters: otherFilters})) {
                    if (result[filterName]) {
                        result[filterName].add(hanana[filterName]);
                    } else {
                        result[filterName] = new Set([ hanana[filterName] ]);
                    }
                }
            });
        });
    }

// значения для пассивных (не выбрано ни одно значение) фильтров
    const passivResult: any = {};

    filtredHananas.forEach(hanana => {
        passiveFiltersNames.forEach(filterName => {
            if (passivResult[filterName]) {
                passivResult[filterName].add(hanana[filterName]);
            } else {
                passivResult[filterName] = new Set([ hanana[filterName] ]);
            }
        });
    });

// финальное преобразование результата
    for (const filt in passivResult) {
        finalRes[filt] = Array.from(passivResult[filt  as keyof OptionFiltersState]);
    }

    for (const filt in result) {
        finalRes[filt] = Array.from(result[filt  as keyof OptionFiltersState]);
    }

    return finalRes;
}



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

    const filtredHananas = filterHananas(
        hananas,
        currentFilters,
    );

    const optionFilt = useAppSelector(selectOptionFilters);
    const activeFiltersValues = getActives(hananas, optionFilt, filtredHananas);


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
                            <h3>{hanana.title}</h3>
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