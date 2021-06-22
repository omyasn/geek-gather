import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

export interface OptionFiltersState {
    host: string[];
    beginDate: string[];
}

interface OptionFilterPayload {
    name: keyof OptionFiltersState;
    value: string;
}

// TODO Должно приходить с бекенда
const initialState: OptionFiltersState = {
    host: ['АПГ'],
    beginDate: [],
};

export const optionFiltersSlice = createSlice({
    name: 'optionFilters',
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

export const selectFilterHost = (state: RootState) => state.optionFilters.host;
export const selectFilterBeginDate = (state: RootState) => state.optionFilters.beginDate;
export const selectOptionFilters = (state: RootState) => state.optionFilters;

export const { addOption, removeOption } = optionFiltersSlice.actions;
export default optionFiltersSlice.reducer;