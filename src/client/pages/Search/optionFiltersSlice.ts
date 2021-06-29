import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootStateType } from './store';

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
    host: [],
    beginDate: [],
};


// export const addOption = createAction<OptionFilterPayload>('optionFilters/addOption');
// export const removeOption = createAction<OptionFilterPayload>('optionFilters/removeOption');

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

export const selectFilterHost = (state: RootStateType) => state.optionFilters.host;
export const selectFilterBeginDate = (state: RootStateType) => state.optionFilters.beginDate;
export const selectOptionFilters = (state: RootStateType) => state.optionFilters;

export const { addOption, removeOption } = optionFiltersSlice.actions;
export default optionFiltersSlice.reducer;