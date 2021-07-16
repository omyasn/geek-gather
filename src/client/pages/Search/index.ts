import Search from './page';
import mountPage from '../../mountPage';
import createAppStore from './store';

import { createBrowserHistory } from 'history';

let history = createBrowserHistory();

mountPage({
    PageComponent: Search,
    createAppStore,
    history,
});