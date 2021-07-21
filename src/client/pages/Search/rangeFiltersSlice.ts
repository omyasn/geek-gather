import { createSlice, PayloadAction, ThunkAction, AnyAction } from '@reduxjs/toolkit';
import { BrowserHistory } from 'history';
import { FilterRangeOptions } from '../../components/FilterRange';
import type { RootStateType } from './store';

// TODO положить эти файлы в фича папку с компонентами

// TODO тут ? для удобства, хз надо или нет
export interface RangeFiltersState {
    minPrice?: FilterRangeOptions;
    capacity?: FilterRangeOptions;
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

export const selectFilterMinPrice = (state: RootStateType) => state.rangeFilters.minPrice;
export const selectFilterCapacity = (state: RootStateType) => state.rangeFilters.capacity;
export const selectRangeFilters = (state: RootStateType) => state.rangeFilters;

export const { changeRange } = rangeFiltersSlice.actions;

export const changeRangewithHistory = ({ name, edge, value }: RangeFilterPayload): ThunkAction<void, RootStateType, BrowserHistory, AnyAction> => 
    (dispatch, getState, history) => {
        dispatch(changeRange({ name, edge, value}));

        const query = new URLSearchParams(history.location.search);
        
        if (query.has(name)) {
            const param = query.get(name);
            const newParam = edge === 'max' ? param.replace(/(?<=-)\d+$/, `${value}`) : param.replace(/^\d+/, `${value}`);
            query.set(name, newParam);
        } else {
            const state = getState();
            query.append(name, edge === 'max' ? `${state.rangeFilters[name].min}-${value}` : `${value}-${state.rangeFilters[name].max}`);
        }
        
        history.replace({search: `?${query.toString()}`});
        
    };

export default rangeFiltersSlice.reducer;