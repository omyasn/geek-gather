import * as React from 'react';
import styles from './styles.css';

// TODO использовать константрые имена из enum в других типах
// enum LimitsNames {
//     MIN ='min',
//     MAX ='max',
// }

export interface FilterRangeOptions {
    min: number;
    max: number;
};

export interface FilterRangeProps {
    name: string;
    filterRange: FilterRangeOptions;
    onRangeChange: (edge: keyof FilterRangeOptions) => (e: React.SyntheticEvent) => void;
}

const FilterRange: React.FC<FilterRangeProps> = ({
    name,
    filterRange,
    onRangeChange,
}) => {
    return (
        <div>
            <p className={styles.lol}>{name}</p>
            <label>
                Min: 
                <input
                    type="number"
                    value={filterRange.min}
                    onChange={onRangeChange('min')}
                />
            </label>

            <label>
                Max: 
                <input
                    type="number"
                    value={filterRange.max}
                    onChange={onRangeChange('max')}
                />
            </label>
        </div>
    );
};

export default FilterRange;