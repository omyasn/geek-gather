import * as React from 'react';
import cn from 'classnames';
import styles from './styles.scss'
import Text from '../../components/CoreComponents/Text';

export interface FilterOptionsProps<T> {
    name: string;
    filterOptions: T[];
    filterActiveOptions?: T[];
    filterValues: T[];
    className?: string;
    onOptionChange: (currentItem: T) => (e: React.SyntheticEvent) => void;
}

const FilterOptions: React.FC<FilterOptionsProps<string>> = ({
    name,
    filterOptions,
    filterActiveOptions,
    filterValues,
    className,
    onOptionChange,
}) => {
    return (
        <div className={cn(styles.wrapper, className)}>
            <Text header textSize="xs" block>{name}</Text>
            {filterOptions.map((item) => (
                <Text
                    tag="label"
                    block
                    className={cn(styles.item, {
                        [styles.disabled]: !((filterActiveOptions && filterActiveOptions.includes(item)) || filterActiveOptions === null)
                    })}
                    key={item}
                >
                    <input
                        type="checkbox"
                        checked={filterValues.includes(item)}
                        value={item}
                        onChange={onOptionChange(item)}
                    />
                    {item}
                </Text>
            ))}
        </div>
    );
};

export default FilterOptions;