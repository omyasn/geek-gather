import * as React from 'react';
import styles from './styles.css';

export interface FilterRangeOptions {
    min: RangeEdge;
    max: RangeEdge;
};

export interface RangeEdge {
    limit: number;
    current?: number;
}

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
                    value={filterRange.min.current || filterRange.min.limit}
                    onChange={onRangeChange('min')}
                    min={filterRange.min.limit}
                    max={filterRange.max.limit}
                />
                <span>{filterRange.min.limit}</span>
            </label>

            <label>
                Max: 
                <input
                    type="number"
                    value={filterRange.max.current || filterRange.max.limit}
                    onChange={onRangeChange('max')}
                    min={filterRange.min.limit}
                    max={filterRange.max.limit}
                />
                <span>{filterRange.max.limit}</span>
            </label>
        </div>
    );
};

export default FilterRange;