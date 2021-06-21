import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

export interface FilterState {
    host: string[];
    beginDate: string[];
}

interface OptionFilterPayload {
    name: keyof FilterState;
    value: string;
}

const initialState: FilterState = {
    host: ['АПГ'],
    beginDate: [],
};

export const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        addOption: (state, action: PayloadAction<OptionFilterPayload>) => {
            const name = action.payload.name;
            const value = action.payload.value;
            state[name].push(value);
        },
        removeOption: (state, action: PayloadAction<OptionFilterPayload>) => {
            const name = action.payload.name;
            const value = action.payload.value;
            state[name] = state[name].filter(item => item !== value);
        },
    },
});

export const selectFilterHost = (state: RootState) => state.filters.host;
export const selectFilterBeginDate = (state: RootState) => state.filters.beginDate;

export const { addOption, removeOption } = filtersSlice.actions;
export default filtersSlice.reducer;