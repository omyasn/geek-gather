import Search from './page';
import mountPage from '../../mountPage';
import createAppStore from './store';

mountPage({
    PageComponent: Search,
    createAppStore,
});