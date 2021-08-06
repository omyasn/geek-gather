import { FiltersValues } from "../page";

export const mockHananas = [{
    id: 0,
    title: 'БПМ',
    beginDate: '22.06.2021',
    capacity: 3000,
    minPrice: 700,
    host: 'АПГ',
    location: 'Иркутск',
    color: 'red',
}, {
    id: 1,
    title: 'Красная капелла: Ответный удар',
    beginDate: '07.06.2018',
    capacity: 200,
    minPrice: 1000,
    host: 'АПГ',
    location: 'Москва',
    color: 'red',
}, {
    id: 2,
    title: 'Большие ходоки',
    beginDate: '10.11.2016',
    capacity: 200,
    minPrice: 2000,
    host: 'Loonarbaboon',
    location: 'Иркутск',
    color: 'red',
}, {
    id: 3,
    title: 'Мир торгов',
    beginDate: '14.09.2018',
    capacity: 100,
    minPrice: 600,
    host: 'Loonarbaboon',
    location: 'Москва',
    color: 'red',
}, {
    id: 4,
    title: 'Титюли',
    beginDate: '31.01.2020',
    capacity: 100,
    minPrice: 550,
    host: 'Loonarbaboon',
    location: 'Иркутск',
    color: 'blue',
}, {
    id: 5,
    title: 'Roar roar',
    beginDate: '31.01.2020',
    capacity: 200,
    minPrice: 650,
    host: 'Toptop',
    location: 'Иркутск',
    color: 'blue',
}, {
    id: 6,
    title: 'Solo',
    beginDate: '31.01.2020',
    capacity: 100,
    minPrice: 550,
    host: 'Toptop',
    location: 'Иркутск',
    color: 'yellow',
}, {
    id: 7,
    title: 'rip',
    beginDate: '14.09.2018',
    capacity: 2000,
    minPrice: 3000,
    host: 'III',
    location: 'Псков',
    color: 'blue',
}, {
    id: 8,
    title: 'Атом',
    beginDate: '10.11.2016',
    capacity: 600,
    minPrice: 600,
    host: 'Toptop',
    location: 'Иркутск',
    color: 'blue',
}];

export const mockFiltersValues: FiltersValues = {
        optionFilters: {
            host: [],
            beginDate: [],
            location: [],
            color: [],
        },
    rangeFilters: {
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
    },
};