import { FiltersValues } from "../page";
import { EventType } from "../../../../common/commonTypes";

export const mockEvents: EventType[] = [{
    id: '0',
    title: 'title0',
    beginDate: '22.06.2021',
    capacity: 3000,
    minPrice: 700,
    owner: 'APG',
    location: 'Rotko club', //иркутск
    city: 'Moscow', //red
    locationLink: '',
    parties: '',
    ownerLink: ''
}, {
    id: '1',
    title: 'title1',
    beginDate: '07.06.2018',
    capacity: 200,
    minPrice: 1000,
    owner: 'APG',
    location: 'Polygon 2', //Polygon 2
    city: 'Moscow',
    locationLink: '',
    parties: '',
    ownerLink: ''
}, {
    id: '2',
    title: 'title2',
    beginDate: '10.11.2016',
    capacity: 200,
    minPrice: 2000,
    owner: 'Loonarbaboon',
    location: 'Rotko club',
    city: 'Moscow',
    locationLink: '',
    parties: '',
    ownerLink: ''
}, {
    id: '3',
    title: 'title3',
    beginDate: '14.09.2018',
    capacity: 100,
    minPrice: 600,
    owner: 'Loonarbaboon',
    location: 'Polygon 2',
    city: 'Moscow',
    locationLink: '',
    parties: '',
    ownerLink: ''
}, {
    id: '4',
    title: 'Tituli',
    beginDate: '31.01.2020',
    capacity: 100,
    minPrice: 550,
    owner: 'Loonarbaboon',
    location: 'Rotko club',
    city: 'Klin', //blue
    locationLink: '',
    parties: '',
    ownerLink: ''
}, {
    id: '5',
    title: 'Roar roar',
    beginDate: '31.01.2020',
    capacity: 200,
    minPrice: 650,
    owner: 'Toptop',
    location: 'Rotko club',
    city: 'Klin',
    locationLink: '',
    parties: '',
    ownerLink: ''
}, {
    id: '6',
    title: 'Solo',
    beginDate: '31.01.2020',
    capacity: 100,
    minPrice: 550,
    owner: 'Toptop',
    location: 'Rotko club',
    city: 'Novgorod', //yellow
    locationLink: '',
    parties: '',
    ownerLink: ''
}, {
    id: '7',
    title: 'rip',
    beginDate: '14.09.2018',
    capacity: 2000,
    minPrice: 3000,
    owner: 'III',
    location: 'Boom club', //Псков
    city: 'Klin',
    locationLink: '',
    parties: '',
    ownerLink: ''
}, {
    id: '8',
    title: 'Атом',
    beginDate: '10.11.2016',
    capacity: 600,
    minPrice: 600,
    owner: 'Toptop',
    location: 'Rotko club',
    city: 'Klin',
    locationLink: '',
    parties: '',
    ownerLink: ''
}];

export const mockFiltersValues: FiltersValues = {
        optionFilters: {
            owner: [],
            beginDate: [],
            location: [],
            parties: [],
            city: []
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