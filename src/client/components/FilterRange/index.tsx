import * as React from 'react';
import styles from './styles.scss';

// TODO сейчас не везде заменено
export enum rangeEdges {
    MIN = 'min',
    MAX = 'max',
};

export type FilterRangeOptions = {
    [key in rangeEdges]: RangeEdgeValue;
};

export interface RangeEdgeValue {
    limit: number;
    current?: number;
}

export interface FilterRangeProps {
    name: string;
    filterRange: FilterRangeOptions;
    onRangeChange: (edge: rangeEdges) => (e: React.SyntheticEvent) => void;
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
                    onChange={onRangeChange(rangeEdges.MIN)}
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
                    onChange={onRangeChange(rangeEdges.MAX)}
                    min={filterRange.min.limit}
                    max={filterRange.max.limit}
                />
                <span>{filterRange.max.limit}</span>
            </label>
        </div>
    );
};

export default FilterRange;