import * as React from 'react';

// TODO использовать константрые имена из enum в других типах
// enum LimitsNames {
//     MIN ='min',
//     MAX ='max',
// }

export interface IFilterLimitsOptions {
    min: number;
    max: number;
};

export interface FilterLimitsProps {
    name: string;
    filterLimits: IFilterLimitsOptions;
    onLimitsChange: (minOrMax: string) => (e: React.SyntheticEvent) => void;
}

const FilterLimits = ({
    name,
    filterLimits,
    onLimitsChange,
}: FilterLimitsProps) => {
    return (
        <div>
            <p>{name}</p>
            <label>
                Min: 
                <input
                    type="number"
                    value={filterLimits.min}
                    onChange={onLimitsChange('min')}
                />
            </label>

            <label>
                Max: 
                <input
                    type="number"
                    value={filterLimits.max}
                    onChange={onLimitsChange('max')}
                />
            </label>
        </div>
    );
};

export default FilterLimits;