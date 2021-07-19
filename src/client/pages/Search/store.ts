import { configureStore } from '@reduxjs/toolkit';
import optionFiltersReducer from './optionFiltersSlice';
import rangeFiltersReducer from './rangeFiltersSlice';
import { createBrowserHistory } from 'history';

export interface RootStateType {
  optionFilters: ReturnType<typeof optionFiltersReducer>;
  rangeFilters: ReturnType<typeof rangeFiltersReducer>;
}

const createAppStore = (preloadedState?: RootStateType, isClient?: boolean) => {
  const history = isClient ? createBrowserHistory() : {};

  return configureStore({
    preloadedState,
    reducer: {
      optionFilters: optionFiltersReducer,
      rangeFilters: rangeFiltersReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: history,
        },
      }),
  });
};


//export type RootState = ReturnType<typeof store.getState>;
// TODO!!!!!!!!!!!
export type AppDispatch = any; //typeof store.dispatch;
export default createAppStore;