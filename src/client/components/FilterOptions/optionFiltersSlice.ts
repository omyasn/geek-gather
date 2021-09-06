import { createSlice, PayloadAction, ThunkAction, AnyAction } from '@reduxjs/toolkit';
import { BrowserHistory } from 'history';
import type { RootStateType } from '../../pages/Search/store';


export enum optionsFN {
    HOST = 'host',
    BEGINDATE = 'beginDate',
    LOCATION = 'location',
    COLOR = 'color',
};

export type OptionFiltersState = {
    [key in optionsFN]: string[];
    
}

interface OptionFilterPayload {
    name: optionsFN;
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
        clearAllOptions: state => {
            for (let filter in state) {
                state[filter as keyof OptionFiltersState] = [];
            }
        },
    },
});

export const selectOptionsFilter = (name: optionsFN) => (state: RootStateType) => state.optionFilters[name];
export const selectOptionFilters = (state: RootStateType) => state.optionFilters;
export const { addOption, removeOption, clearAllOptions } = optionFiltersSlice.actions;

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

export const clearAllOptionsWithHistory = (): ThunkAction<void, RootStateType, BrowserHistory, AnyAction> => 
    (dispatch, getState, history) => {
        dispatch(clearAllOptions());

        const query = new URLSearchParams(history.location.search);

        const state = getState();
        const filtersNames = Object.keys(state.optionFilters);

        filtersNames.forEach(filter => query.delete(filter));

        history.replace({search: `?${query.toString()}`}) 
};


export default optionFiltersSlice.reducer;