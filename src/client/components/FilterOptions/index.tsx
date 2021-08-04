import * as React from 'react';

export interface FilterOptionsProps<T> {
    name: string;
    filterOptions: T[];
    filterActiveOptions?: T[];
    filterValues: T[];
    onOptionChange: (currentItem: T) => (e: React.SyntheticEvent) => void;
}

const FilterOptions: React.FC<FilterOptionsProps<string>> = ({
    name,
    filterOptions,
    filterActiveOptions,
    filterValues,
    onOptionChange,
}) => {
    return (
        <div>
            <p>{name}</p>
            {filterOptions.map((item) => (
                <label key={item} style={{ color: ((filterActiveOptions && filterActiveOptions.includes(item)) || filterActiveOptions === null) ? 'black' : 'gray' }}>
                    <input
                        type="checkbox"
                        checked={filterValues.includes(item)}
                        value={item}
                        onChange={onOptionChange(item)}
                    />
                    {item}
                </label>
            ))}
        </div>
    );
};

export default FilterOptions;