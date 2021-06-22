import { configureStore } from '@reduxjs/toolkit';
import optionFiltersReducer from './optionFiltersSlice';
import rangeFiltersReducer from './rangeFiltersSlice';

const store = configureStore({
  reducer: {
    optionFilters: optionFiltersReducer,
    rangeFilters: rangeFiltersReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;