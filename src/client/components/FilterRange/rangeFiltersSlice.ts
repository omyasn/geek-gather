import { createSlice, PayloadAction, ThunkAction, AnyAction } from '@reduxjs/toolkit';
import { BrowserHistory } from 'history';
import { FilterRangeOptions } from './index';
import type { RootStateType } from '../../pages/Search/store';

export enum rangeFN {
    MINPRICE = 'minPrice',
    CAPACITY = 'capacity',
};

export type RangeFiltersState = {
    [key in rangeFN]: FilterRangeOptions;
}

// TODO Должно приходить с бекенда
const initialState: RangeFiltersState = {
    minPrice: {
        min: {
            limit: 0,
        },
        max: {
            limit: Infinity,
        },
    },
    capacity: {
        min: {
            limit: 0,
        },
        max: {
            limit: Infinity,
        },
    },
};

interface RangeFilterPayload {
    name: rangeFN;
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

            // сейчас ограничение значения в соответствии с лимитами сделано на уровне верстки в input
            // TODO наверное стоит сделать здесь
            state[name][edge].current = value;
        },
        clearAllRanges: state => {
            for (let filter in state) {
                state[filter as keyof RangeFiltersState].min.current = undefined;
                state[filter as keyof RangeFiltersState].max.current = undefined;
            }
        },
    },
});

export const selectRangeFilter = (name: rangeFN) => (state: RootStateType) => state.rangeFilters[name];

export const selectRangeFilters = (state: RootStateType) => state.rangeFilters;

export const { changeRange, clearAllRanges } = rangeFiltersSlice.actions;

export const changeRangewithHistory = ({ name, edge, value }: RangeFilterPayload): ThunkAction<void, RootStateType, BrowserHistory, AnyAction> => 
    (dispatch, getState, history) => {
        dispatch(changeRange({ name, edge, value}));

        const query = new URLSearchParams(history.location.search);
        const isMax = edge === 'max';
        
        if (query.has(name)) {
            const param = query.get(name);
            const newParam = isMax ? param.replace(/(?<=-)\d+$/, `${value}`) : param.replace(/^\d+/, `${value}`);
            query.set(name, newParam);
        } else {
            const state = getState();
            const otherEdge = isMax ? 'min' : 'max';
            const otherEdgeValue = state.rangeFilters[name][otherEdge].current || state.rangeFilters[name][otherEdge].limit;
            query.append(name, isMax ? `${otherEdgeValue}-${value}` : `${value}-${otherEdgeValue}`);
        }
        
        history.replace({search: `?${query.toString()}`});
        
    };

export const clearAllRangeWithHistory = (): ThunkAction<void, RootStateType, BrowserHistory, AnyAction> => 
    (dispatch, getState, history) => {
        dispatch(clearAllRanges());

        const query = new URLSearchParams(history.location.search);
        const state = getState();
        const filtersNames = Object.keys(state.rangeFilters);

        filtersNames.forEach(filter => query.delete(filter));
        
        history.replace({search: `?${query.toString()}`});  
    };

export default rangeFiltersSlice.reducer;