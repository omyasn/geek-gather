import { createSlice, PayloadAction, ThunkAction, AnyAction } from '@reduxjs/toolkit';
import { BrowserHistory } from 'history';
import type { RootStateType } from './store';

// TODO initialState приходит с бекенда, нельзя ли брать тип оттуда?
export interface OptionFiltersState {
    host: string[];
    beginDate: string[];
    location: string[];
    color: string[];
}

interface OptionFilterPayload {
    name: keyof OptionFiltersState;
    value: string;
}

const initialState: OptionFiltersState = {
    host: [],
    beginDate: [],
    location: [],
    color: [],
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

export const selectFilterHost = (state: RootStateType) => state.optionFilters.host;
export const selectFilterBeginDate = (state: RootStateType) => state.optionFilters.beginDate;
export const selectFilterLocation = (state: RootStateType) => state.optionFilters.location;
export const selectFilterColor = (state: RootStateType) => state.optionFilters.color;
export const selectOptionFilters = (state: RootStateType) => state.optionFilters;

export const { addOption, removeOption } = optionFiltersSlice.actions;

export const addOptionWithHistory = ({ name, value }:OptionFilterPayload): ThunkAction<void, RootStateType, BrowserHistory, AnyAction> => 
    (dispatch, getState, history) => {
        dispatch(addOption({ name, value }));

        const query = new URLSearchParams(history.location.search);
    
        if (query.has(name)) {
            let param = query.get(name).split(',');
            param.push(value);
            query.set(name, param.join(','));
        } else {
            query.append(name, value);
        }
        
        history.replace({search: `?${query.toString()}`})
};

export const removeOptionWithHistory = ({ name, value }:OptionFilterPayload): ThunkAction<void, RootStateType, BrowserHistory, AnyAction> => 
    (dispatch, getState, history) => {
        dispatch(removeOption({ name, value }));

        const query = new URLSearchParams(history.location.search);
        
        if (!query.has(name)) {
            return;
        }
        
        let param = query.get(name).split(',');
        param = param.filter(e => e !== value);

        if (param.length) {
            query.set(name, param.join(','));
        } else {
            query.delete(name);
        }
        history.replace({search: `?${query.toString()}`}) 
};




export default optionFiltersSlice.reducer;