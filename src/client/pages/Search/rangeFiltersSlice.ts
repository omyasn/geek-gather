import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterRangeOptions } from '../../components/FilterRange'
import type { RootState } from './store';

// TODO положить эти файлы в фича папку с компонентами
// TODO переименовать limits to range
export interface RangeFiltersState {
    minPrice: FilterRangeOptions;
    capacity: FilterRangeOptions;
}
// TODO Должно приходить с бекенда
const initialState: RangeFiltersState = {
    minPrice: {
        min: 0,
        max: Infinity,
    },
    capacity: {
        min: 0,
        max: Infinity,
    },
};

interface RangeFilterPayload {
    name: keyof RangeFiltersState;
    edge: keyof FilterRangeOptions;
    value: number;
}


export const rangeFiltersSlice = createSlice({
    name: 'rangeFilters',
    initialState,
    reducers: {
        changeRange: (state, action: PayloadAction<RangeFilterPayload>) => {
            const name = action.payload.name;
            const value = action.payload.value;
            const edge = action.payload.edge;
            state[name][edge] = value;
        },
    },
});

export const selectFilterMinPrice = (state: RootState) => state.rangeFilters.minPrice;
export const selectFilterCapacity = (state: RootState) => state.rangeFilters.capacity;
export const selectRangeFilters = (state: RootState) => state.rangeFilters;

export const { changeRange } = rangeFiltersSlice.actions;
export default rangeFiltersSlice.reducer;