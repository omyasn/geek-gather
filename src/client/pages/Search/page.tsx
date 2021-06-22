import * as React from 'react';
import { useState, ChangeEvent } from 'react';
import { Dispatch } from '@reduxjs/toolkit';
import { useAppDispatch,  useAppSelector } from './hooks';
import FilterOptions from '../../components/FilterOptions/index';
import FilterRange, { FilterRangeOptions } from '../../components/FilterRange/index';
import { IHanana } from '../../../common/commonTypes';

import {
    addOption,
    removeOption,
    selectFilterHost,
    selectFilterBeginDate,
    selectOptionFilters,
    OptionFiltersState,
} from './optionFiltersSlice';

import {
    changeRange,
    selectFilterCapacity,
    selectFilterMinPrice,
    selectRangeFilters,
    RangeFiltersState,
} from './rangeFiltersSlice';

import styles from './styles.scss';

// TODO разделить логику фильтров, отрисовку страницы итд 


interface FiltersValues {
    optionFilters: OptionFiltersState;
    rangeFilters: RangeFiltersState;
}

export interface IPageProps {
    hananas: IHanana[];
    filterHostOptions: string[];
    filterBeginDateOptions: string[];
    filterMinPriceRangeOptions: number[];
    filterCapacityRangeOptions: number[];  
};


const onOptionsFilterChange = (name: keyof OptionFiltersState, dispatch: Dispatch) => 
    (value: string) => 
    ({ target }: ChangeEvent<HTMLInputElement>): void => {
        const isChecked = target.checked;
        if (isChecked) {
            dispatch(addOption({ name, value }));
        } else {
             dispatch(removeOption({ name, value }));
        }
    };

const onRangeFilterChange = (name: keyof RangeFiltersState, dispatch: Dispatch) => 
    (edge: keyof FilterRangeOptions) =>
    ({ target }: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeRange({ name, edge, value: Number(target.value)}))
    };

// из всех событий получаем события подходящие под фильтры
const filterHananas = (hananas: IHanana[], filtersValues: FiltersValues) => {
    // TODO filtersValues должно браться из типа
    const optionsNames = Object.keys(filtersValues.optionFilters);
    const rangesNames = Object.keys(filtersValues.rangeFilters);

    const filtredHananas = hananas.filter(hanana => {
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
    });

    return filtredHananas;
};


const SearchPage: React.FC<IPageProps> = ({
    hananas,
    // TODO это надо использовать для предустановки фильтров
    filterHostOptions,
    filterBeginDateOptions,
    filterMinPriceRangeOptions, 
    filterCapacityRangeOptions,
}) => {
    const dispatch = useAppDispatch();

    const filterHostValues = useAppSelector(selectFilterHost);
    const onHostFilterClick = onOptionsFilterChange('host', dispatch);

    const filterBeginDateValues = useAppSelector(selectFilterBeginDate);
    const onBeginDateFilterClick = onOptionsFilterChange('beginDate', dispatch);


// TODO Предустановка значений фильтров в state

    // const [ filterMinPriceLimits, setFilterMinPriceLimits ] = useState({ 
    //     min: Number(filterMinPriceLimitsOptions[0]),
    //     max: Number(filterMinPriceLimitsOptions[1])
    // });
    // const onMinPriceLimitsChange = onLimitsFilterChange(filterMinPriceLimits, setFilterMinPriceLimits);

    const filterMinPriceRange = useAppSelector(selectFilterMinPrice);
    const onMinPriceRangeChange = onRangeFilterChange('minPrice', dispatch);

    // const [ filterCapacityLimits, setFilterCapacityLimits ] = useState({
    //     min: Number(filterCapacityLimitsOptions[0]),
    //     max: Number(filterCapacityLimitsOptions[1])
    // });
    // const onCapacityLimitsChange = onLimitsFilterChange(filterCapacityLimits, setFilterCapacityLimits);

    const filterCapacityRange = useAppSelector(selectFilterCapacity);
    const onCapacityRangeChange = onRangeFilterChange('capacity', dispatch);

// TODO combine selectors?
    const currentFilters = useAppSelector(state => ({
        optionFilters: selectOptionFilters(state),
        rangeFilters: selectRangeFilters(state),
    }));
    const filtredHananas = filterHananas(
        hananas,
        currentFilters,
    );


    return (
        <div>
            <div className={styles.kek}>It's search Page!</div>

            <div>
                <div>
                    <FilterOptions
                        name="Host"
                        filterOptions={filterHostOptions}
                        filterValues={filterHostValues}
                        onOptionChange={onHostFilterClick}
                    />

                    <FilterOptions
                        name="BeginDate"
                        filterOptions={filterBeginDateOptions}
                        filterValues={filterBeginDateValues}
                        onOptionChange={onBeginDateFilterClick}
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
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;