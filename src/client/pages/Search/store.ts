import { configureStore } from '@reduxjs/toolkit';
import optionFiltersReducer from './optionFiltersSlice';
import rangeFiltersReducer from './rangeFiltersSlice';

export interface RootStateType {
  optionFilters: ReturnType<typeof optionFiltersReducer>;
  rangeFilters: ReturnType<typeof rangeFiltersReducer>;
}

const createAppStore = (preloadedState?: RootStateType) => (
  configureStore({
    preloadedState,
    reducer: {
      optionFilters: optionFiltersReducer,
      rangeFilters: rangeFiltersReducer,
    }
  })
);


//export type RootState = ReturnType<typeof store.getState>;
// TODO!!!!!!!!!!!
export type AppDispatch = any; //typeof store.dispatch;
export default createAppStore;