import * as React from 'react';
import { ChangeEvent, useRef } from 'react';
import { Dispatch, ThunkDispatch } from '@reduxjs/toolkit';

import { useAppDispatch,  useAppSelector } from './hooks';
import FilterOptions from '../../components/FilterOptions/index';
import SearchCard from '../../components/SearchCard/index';
import FilterRange, { FilterRangeOptions, rangeEdges } from '../../components/FilterRange/index';
import { EventType } from "../../../common/commonTypes";

import { makeSubsets, getFilteredFromSubsets } from './filtersLogic';
import Text from '../../components/CoreComponents/Text';
import Button from '../../components/CoreComponents/Button';
import { formatToHumanDate } from '../../../common/helpers'

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
        [filterValue: string]: string[];
    }
}

export interface IPageProps {
    events: EventType[];
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
    events,
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

    subsetsStorage.current = makeSubsets(events, currentFilters, subsetsStorage.current);

    const [filtredEvents, activeFiltersValues] = getFilteredFromSubsets(events, currentFilters, subsetsStorage.current);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.headerWrapper}>
                <Text header tag="h1">Events</Text>
                <Text>Look up through all interesting events nearby. Use filters for more scpecific searches.</Text>
            </div>

            <div className={styles.filtersWrapper}>
                <FilterOptions
                    name="Owner"
                    filterOptions={filtersVariants[optionsFN.OWNER]}
                    filterValues={optionsFiltersValues[optionsFN.OWNER]}
                    filterActiveOptions={activeFiltersValues[optionsFN.OWNER]}
                    onOptionChange={onOptionsFilterChange(optionsFN.OWNER, dispatch)}
                />

                <FilterOptions
                    name="BeginDate"
                    filterOptions={filtersVariants[optionsFN.BEGINDATE]}
                    filterValues={optionsFiltersValues[optionsFN.BEGINDATE]}
                    filterActiveOptions={activeFiltersValues[optionsFN.BEGINDATE]}
                    format={formatToHumanDate}
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
                    name="City"
                    filterOptions={filtersVariants[optionsFN.CITY]}
                    filterValues={optionsFiltersValues[optionsFN.CITY]}
                    filterActiveOptions={activeFiltersValues[optionsFN.CITY]}
                    onOptionChange={onOptionsFilterChange(optionsFN.CITY, dispatch)}
                />

                <FilterOptions
                    name="Parties"
                    filterOptions={filtersVariants[optionsFN.PARTIES]}
                    filterValues={optionsFiltersValues[optionsFN.PARTIES]}
                    filterActiveOptions={activeFiltersValues[optionsFN.PARTIES]}
                    onOptionChange={onOptionsFilterChange(optionsFN.PARTIES, dispatch)}
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
                <Button onClick={clearAll(dispatch)}>
                    ClearAll
                </Button>
            </div>
            <div className={styles.eventsWrapper}>
                {filtredEvents.map(event => 
                    <SearchCard key={event.id} {...event} />
                )}
            </div>
        
        </div>
    );
};

export default SearchPage;
