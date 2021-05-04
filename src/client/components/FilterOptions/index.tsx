import * as React from 'react';

export interface FilterOptionsProps<T> {
    name: string;
    filterOptions: T[];
    filterValues: Set<T>;
    onOptionChange: (currentItem: T) => (e: React.SyntheticEvent) => void;
}

const FilterOptions: React.FC<FilterOptionsProps<string>> = ({
    name,
    filterOptions = [],
    filterValues,
    onOptionChange,
}) => {
    return (
        <div>
            <p>{name}</p>
            {filterOptions.map((item) => (
                <label key={item}>
                    <input
                        type="checkbox"
                        checked={filterValues.has(item)}
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