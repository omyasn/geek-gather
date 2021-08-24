import { configureStore } from '@reduxjs/toolkit';
import optionFiltersReducer from '../../components/FilterOptions/optionFiltersSlice';
import rangeFiltersReducer from '../../components/FilterRange/rangeFiltersSlice';
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


type Store = ReturnType<typeof createAppStore>;
export type AppDispatch =  Store["dispatch"];
export default createAppStore;