import * as React from 'react';
import { ChangeEvent, useRef } from 'react';
import { Dispatch, ThunkDispatch } from '@reduxjs/toolkit';

import { useAppDispatch,  useAppSelector } from './hooks';
import FilterOptions from '../../components/FilterOptions/index';
import FilterRange, { FilterRangeOptions } from '../../components/FilterRange/index';
import { IHanana } from '../../../common/commonTypes';

import { makeSubsets, getFilteredFromSubsets } from './filtersLogic';

import {
    addOptionWithHistory,
    removeOptionWithHistory,
    clearAllOptionsWithHistory,
    selectFilterHost,
    selectFilterBeginDate,
    selectFilterLocation,
    selectFilterColor,
    selectOptionFilters,
    OptionFiltersState,
} from './optionFiltersSlice';

import {
    changeRangewithHistory,
    clearAllRangeWithHistory,
    selectFilterCapacity,
    selectFilterMinPrice,
    selectRangeFilters,
    RangeFiltersState,
} from './rangeFiltersSlice';

import styles from './styles.scss';


export interface FiltersValues {
    optionFilters: OptionFiltersState;
    rangeFilters: RangeFiltersState;
}

export interface FiltersVariants {
    filterHostOptions: string[];
    filterBeginDateOptions: string[];
    filterLocationOptions: string[];
    filterColorOptions: string[];
    filterMinPriceRangeOptions: number[];
    filterCapacityRangeOptions: number[];  
}

export type SubsetsStorage = {
    [filterName in keyof OptionFiltersState]?: {
        [filterValue: string]: number[];
    }
}

export interface IPageProps extends FiltersVariants {
    hananas: IHanana[];
};

const onOptionsFilterChange = (name: keyof OptionFiltersState, dispatch: ReturnType<typeof useAppDispatch>) => 
    (value: string) => 
    ({ target }: ChangeEvent<HTMLInputElement>): void => {
        const isChecked = target.checked;
        if (isChecked) {
            dispatch(addOptionWithHistory({ name, value }));
        } else {
             dispatch(removeOptionWithHistory({ name, value }));
        }
    };

const onRangeFilterChange = (name: keyof RangeFiltersState, dispatch: ReturnType<typeof useAppDispatch>) => 
    (edge: keyof FilterRangeOptions) =>
    ({ target }: ChangeEvent<HTMLInputElement>) => {
        const value = target.value;
        dispatch(changeRangewithHistory({ name, edge, value: Number(value)}));
    };

const clearAll = (dispatch: ReturnType<typeof useAppDispatch>) => () => {
    dispatch(clearAllOptionsWithHistory());
    dispatch(clearAllRangeWithHistory());
};


const SearchPage: React.FC<IPageProps> = ({
    hananas,
    filterHostOptions,
    filterBeginDateOptions,   
    filterLocationOptions,   
    filterColorOptions,   
}) => {
    const dispatch = useAppDispatch();
    const subsetsStorage = useRef({});

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

    subsetsStorage.current = makeSubsets(hananas, currentFilters, subsetsStorage.current);

    const [filtredHananas, activeFiltersValues] = getFilteredFromSubsets(hananas, currentFilters, subsetsStorage.current);

    return (
        <div>
            <div className={styles.kek}>It's search Page!</div>

            <div>
                <button onClick={clearAll(dispatch)}>
                    ClearAll
                </button>
            </div>
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
