import * as React from 'react';
import styles from './styles.scss';
import cn from 'classnames';
import Text from '../../components/CoreComponents/Text';

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
    className?: string;
}

const FilterRange: React.FC<FilterRangeProps> = ({
    name,
    filterRange,
    onRangeChange,
    className,
}) => {
    return (
        <div className={cn(styles.wrapper, className)}>
            <Text header textSize="xs" block>{name}</Text>
            <Text 
                tag="label"
                block
                className={styles.item}
            >
                Min: 
                <input
                    type="number"
                    value={filterRange.min.current || filterRange.min.limit}
                    onChange={onRangeChange(rangeEdges.MIN)}
                    min={filterRange.min.limit}
                    max={filterRange.max.limit}
                    className={styles.input}
                />
                <Text secondary textSize="s">{`limit ${filterRange.min.limit}`}</Text>
            </Text>

            <Text 
                tag="label"
                block
                className={styles.item}
            >
                Max: 
                <input
                    type="number"
                    value={filterRange.max.current || filterRange.max.limit}
                    onChange={onRangeChange(rangeEdges.MAX)}
                    min={filterRange.min.limit}
                    max={filterRange.max.limit}
                    className={styles.input}
                />
                <Text secondary textSize="s">{`limit ${filterRange.max.limit}`}</Text>
            </Text>
        </div>
    );
};

export default FilterRange;