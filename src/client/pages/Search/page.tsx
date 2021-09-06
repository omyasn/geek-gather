import * as React from 'react';
import { ChangeEvent, useRef } from 'react';
import { Dispatch, ThunkDispatch } from '@reduxjs/toolkit';

import { useAppDispatch,  useAppSelector } from './hooks';
import FilterOptions from '../../components/FilterOptions/index';
import FilterRange, { FilterRangeOptions, rangeEdges } from '../../components/FilterRange/index';
import { IHanana } from '../../../common/commonTypes';

import { makeSubsets, getFilteredFromSubsets } from './filtersLogic';

import {
    addOptionWithHistory,
    removeOptionWithHistory,
    clearAllOptionsWithHistory,
    selectOptionFilters,
    OptionFiltersState,
    optionsFN,
} from '../../components/FilterOptions/optionFiltersSlice';

import {
    changeRangewithHistory,
    clearAllRangeWithHistory,
    selectRangeFilters,
    RangeFiltersState,
    rangeFN,
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
    (edge: rangeEdges) =>
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

    const optionsFiltersValues = useAppSelector(selectOptionFilters);
    const rangeFiltersValues = useAppSelector(selectRangeFilters);

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
                        filterValues={optionsFiltersValues[optionsFN.HOST]}
                        filterActiveOptions={activeFiltersValues[optionsFN.HOST]}
                        onOptionChange={onOptionsFilterChange(optionsFN.HOST, dispatch)}
                    />

                    <FilterOptions
                        name="BeginDate"
                        filterOptions={filtersVariants[optionsFN.BEGINDATE]}
                        filterValues={optionsFiltersValues[optionsFN.BEGINDATE]}
                        filterActiveOptions={activeFiltersValues[optionsFN.BEGINDATE]}
                        onOptionChange={onOptionsFilterChange(optionsFN.BEGINDATE, dispatch)}
                    />

                    <FilterOptions
                        name="Location"
                        filterOptions={filtersVariants[optionsFN.LOCATION]}
                        filterValues={optionsFiltersValues[optionsFN.LOCATION]}
                        filterActiveOptions={activeFiltersValues[optionsFN.LOCATION]}
                        onOptionChange={onOptionsFilterChange(optionsFN.LOCATION, dispatch)}
                    />

                    <FilterOptions
                        name="Color"
                        filterOptions={filtersVariants[optionsFN.COLOR]}
                        filterValues={optionsFiltersValues[optionsFN.COLOR]}
                        filterActiveOptions={activeFiltersValues[optionsFN.COLOR]}
                        onOptionChange={onOptionsFilterChange(optionsFN.COLOR, dispatch)}
                    />
                
                    <FilterRange
                        name="MinPrice"
                        filterRange={rangeFiltersValues[rangeFN.MINPRICE]}
                        onRangeChange={onRangeFilterChange(rangeFN.MINPRICE, dispatch)}
                    />

                    <FilterRange
                        name="Capacity"
                        filterRange={rangeFiltersValues[rangeFN.CAPACITY]}
                        onRangeChange={onRangeFilterChange(rangeFN.CAPACITY, dispatch)}
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
