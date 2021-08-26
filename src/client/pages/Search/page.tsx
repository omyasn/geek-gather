import * as React from 'react';
import { ChangeEvent, useRef } from 'react';
import { Dispatch, ThunkDispatch } from '@reduxjs/toolkit';

import { useAppDispatch,  useAppSelector } from './hooks';
import FilterOptions from '../../components/FilterOptions/index';
import { optionsFN } from '../../components/FilterOptions/optionFiltersSlice';
import FilterRange, { FilterRangeOptions } from '../../components/FilterRange/index';
import { rangeFN } from '../../components/FilterRange/rangeFiltersSlice';
import { IHanana } from '../../../common/commonTypes';

import { makeSubsets, getFilteredFromSubsets } from './filtersLogic';

import {
    addOptionWithHistory,
    removeOptionWithHistory,
    clearAllOptionsWithHistory,
    // selectFilterHost,
    // selectFilterBeginDate,
    // selectFilterLocation,
    // selectFilterColor,
    selectOptionsFilter,
    selectOptionFilters,
    OptionFiltersState,
} from '../../components/FilterOptions/optionFiltersSlice';

import {
    changeRangewithHistory,
    clearAllRangeWithHistory,
    // selectFilterCapacity,
    // selectFilterMinPrice,
    selectRangeFilter,
    selectRangeFilters,
    RangeFiltersState,
} from '../../components/FilterRange/rangeFiltersSlice';

import styles from './styles.scss';


export interface FiltersValues {
    optionFilters: OptionFiltersState;
    rangeFilters: RangeFiltersState;
}

type FilterVariantsOptions = {
    [key in optionsFN]: string[];
}

type FilterVariantsRange = {
    [key in rangeFN]: number[];
}

export type FiltersVariants = FilterVariantsOptions & FilterVariantsRange;


export type SubsetsStorage = {
    [filterName in optionsFN]?: {
        [filterValue: string]: number[];
    }
}

export interface IPageProps {
    hananas: IHanana[];
    filtersVariants: FiltersVariants;
};

const onOptionsFilterChange = (name: optionsFN, dispatch: ReturnType<typeof useAppDispatch>) => 
    (value: string) => 
    ({ target }: ChangeEvent<HTMLInputElement>): void => {
        const isChecked = target.checked;
        if (isChecked) {
            dispatch(addOptionWithHistory({ name, value }));
        } else {
             dispatch(removeOptionWithHistory({ name, value }));
        }
    };

const onRangeFilterChange = (name: rangeFN, dispatch: ReturnType<typeof useAppDispatch>) => 
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
    filtersVariants,
}) => {
    const dispatch = useAppDispatch();
    const subsetsStorage = useRef({});
    // TODO использовать общий селектор selectOptionsFilters

    const filterHostValues = useAppSelector(selectOptionsFilter(optionsFN.HOST));
    const onHostFilterClick = onOptionsFilterChange(optionsFN.HOST, dispatch);

    const filterBeginDateValues = useAppSelector(selectOptionsFilter(optionsFN.BEGINDATE));
    const onBeginDateFilterClick = onOptionsFilterChange(optionsFN.BEGINDATE, dispatch);

    const filterLocationValues = useAppSelector(selectOptionsFilter(optionsFN.LOCATION));
    const onLocationFilterClick = onOptionsFilterChange(optionsFN.LOCATION, dispatch);
    
    const filterColorValues = useAppSelector(selectOptionsFilter(optionsFN.COLOR));
    const onColorFilterClick = onOptionsFilterChange(optionsFN.COLOR, dispatch);

    const filterMinPriceRange = useAppSelector(selectRangeFilter(rangeFN.MINPRICE));
    const onMinPriceRangeChange = onRangeFilterChange(rangeFN.MINPRICE, dispatch);

    const filterCapacityRange = useAppSelector(selectRangeFilter(rangeFN.CAPACITY));
    const onCapacityRangeChange = onRangeFilterChange(rangeFN.CAPACITY, dispatch);

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
                        filterOptions={filtersVariants[optionsFN.HOST]}
                        filterValues={filterHostValues}
                        filterActiveOptions={activeFiltersValues.host}
                        onOptionChange={onHostFilterClick}
                    />

                    <FilterOptions
                        name="BeginDate"
                        filterOptions={filtersVariants[optionsFN.BEGINDATE]}
                        filterValues={filterBeginDateValues}
                        filterActiveOptions={activeFiltersValues.beginDate}
                        onOptionChange={onBeginDateFilterClick}
                    />

                    <FilterOptions
                        name="Location"
                        filterOptions={filtersVariants[optionsFN.LOCATION]}
                        filterValues={filterLocationValues}
                        filterActiveOptions={activeFiltersValues.location}
                        onOptionChange={onLocationFilterClick}
                    />

                    <FilterOptions
                        name="Color"
                        filterOptions={filtersVariants[optionsFN.COLOR]}
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
