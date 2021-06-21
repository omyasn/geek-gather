import * as React from 'react';
import { useState, ChangeEvent } from 'react';
import { Dispatch } from '@reduxjs/toolkit';
import { useAppDispatch,  useAppSelector } from './hooks';
import FilterOptions from '../../components/FilterOptions/index';
import FilterLimits, { IFilterLimitsOptions } from '../../components/FilterLimits/index';
import { IHanana } from '../../../common/commonTypes';

import {
    addOption,
    removeOption,
    selectFilterHost,
    selectFilterBeginDate,

    FilterState,
} from './filtersSlice';

import styles from './styles.scss';

// TODO разделить логику фильтров, отрисовку страницы итд 




interface IFiltersValues {
    optionFilters: {
        host: string[];
        beginDate: string[];
    };
    limitsFilters: {
        minPrice: IFilterLimitsOptions;
        capacity: IFilterLimitsOptions;
    };
}

export interface IPageProps {
    hananas: IHanana[];
    filterHostOptions: string[];
    filterBeginDateOptions: string[];
    filterMinPriceLimitsOptions: number[];
    filterCapacityLimitsOptions: number[];  
};


// const onOptionsFilterChange = (filterValues: Set<string>, setFilterValue: (newVal: Set<string>) => void) => 
//     (value: string) =>
//     ({ target }: ChangeEvent<HTMLInputElement>): void => {
//         const isChecked = target.checked;

//         const newFilterValues = new Set(filterValues);
//         if (isChecked) {
//             newFilterValues.add(value);
//         } else {
//             newFilterValues.delete(value);
//         }

//         setFilterValue(newFilterValues);
// };

const newOnOptionsFilterChange = (name: keyof FilterState, dispatch: Dispatch) => 
    (value: string) => 
    ({ target }: ChangeEvent<HTMLInputElement>): void => {
        const isChecked = target.checked;
        if (isChecked) {
            dispatch(addOption({ name, value }));
        } else {
             dispatch(removeOption({ name, value }));
        }
    };

const onLimitsFilterChange = (filterLimits: IFilterLimitsOptions, setFilterLimits: (newLimits: IFilterLimitsOptions) => void) =>
    (minOrMax: string) =>
    ({ target }: ChangeEvent<HTMLInputElement>) =>
        setFilterLimits({
            ...filterLimits,
            [minOrMax]: Number(target.value),
});


// из всех событий получаем события подходящие под фильтры
const filterHananas = (hananas: IHanana[], filtersValues: IFiltersValues) => {
    // TODO filtersValues должно браться из типа
    const optionsNames = Object.keys(filtersValues.optionFilters);
    const limitsNames = Object.keys(filtersValues.limitsFilters);

    const filtredHananas = hananas.filter(hanana => {
        let result = true;

        optionsNames.forEach(filterName => {
            result = result && 
                ((filtersValues.optionFilters[filterName].length > 0 && filtersValues.optionFilters[filterName].includes(hanana[filterName])) || 
                filtersValues.optionFilters[filterName].length === 0)
        });

        
        limitsNames.forEach(filterName => {
            result = result && 
            (
                (!filtersValues.limitsFilters[filterName].min || filtersValues.limitsFilters[filterName].min <= Number(hanana[filterName])) &&
                (!filtersValues.limitsFilters[filterName].max || filtersValues.limitsFilters[filterName].max >= Number(hanana[filterName]))
            )
        });

        return result;
    });

    return filtredHananas;
};


const SearchPage: React.FC<IPageProps> = ({
    hananas,
    filterHostOptions,
    filterBeginDateOptions,
    filterMinPriceLimitsOptions,
    filterCapacityLimitsOptions
}) => {
    // const [ filterHostValues, setFilterHostValues ] = useState(new Set(['АПГ']));
    // const onHostFilterClick = onOptionsFilterChange(filterHostValues, setFilterHostValues);

    const dispatch = useAppDispatch();

    const filterHostValues = useAppSelector(selectFilterHost);
    const onHostFilterClick = newOnOptionsFilterChange('host', dispatch);

    // const [ filterBeginDateValues, setFilterBeginDateValues ] = useState(new Set([]));
    // const onBeginDateFilterClick = onOptionsFilterChange(filterBeginDateValues, setFilterBeginDateValues);

    const filterBeginDateValues = useAppSelector(selectFilterBeginDate);
    const onBeginDateFilterClick = newOnOptionsFilterChange('beginDate', dispatch);


    const [ filterMinPriceLimits, setFilterMinPriceLimits ] = useState({ 
        min: Number(filterMinPriceLimitsOptions[0]),
        max: Number(filterMinPriceLimitsOptions[1])
    });
    const onMinPriceLimitsChange = onLimitsFilterChange(filterMinPriceLimits, setFilterMinPriceLimits);

    const [ filterCapacityLimits, setFilterCapacityLimits ] = useState({
        min: Number(filterCapacityLimitsOptions[0]),
        max: Number(filterCapacityLimitsOptions[1])
    });
    const onCapacityLimitsChange = onLimitsFilterChange(filterCapacityLimits, setFilterCapacityLimits);

    const filtredHananas = filterHananas(
        hananas,
        {
            optionFilters: {
                host: filterHostValues,
                beginDate: filterBeginDateValues,
            },
            limitsFilters: {
                minPrice: filterMinPriceLimits,
                capacity: filterCapacityLimits,
            },
        }
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
                
                    <FilterLimits
                        name="MinPrice"
                        filterLimits={filterMinPriceLimits}
                        onLimitsChange={onMinPriceLimitsChange}
                    />

                    <FilterLimits
                        name="Capacity"
                        filterLimits={filterCapacityLimits}
                        onLimitsChange={onCapacityLimitsChange}
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