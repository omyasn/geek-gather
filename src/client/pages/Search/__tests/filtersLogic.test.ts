import { makeSubsets, __forTest } from '../filtersLogic';
import { mapOfHananas } from '../helpers';
import { mockHananas, mockFiltersValues } from './mocks';

const mockHananasMap = mapOfHananas(mockHananas);

describe('makeSubsets', () => {
    it('add subset in EMPTY storage', () => {
        const result = makeSubsets(
            mockHananas, 
            {
                ...mockFiltersValues,
                optionFilters: {
                    ...mockFiltersValues.optionFilters,
                    host: ['Loonarbaboon'] 
                },
            },
            {}
        );

        expect(result).toEqual({ host: { Loonarbaboon: [ 2, 3, 4 ] }});
    });

    it('add subset for EXISTING filter NEW value', () => {
        const result = makeSubsets(
            mockHananas, 
            {
                ...mockFiltersValues,
                optionFilters: {
                    ...mockFiltersValues.optionFilters,
                    host: ['Loonarbaboon'],
                },
            },
            {
                host: { lol: [ 0, 5 ] }
            }
        );

        expect(result).toEqual({ host: {
            Loonarbaboon: [ 2, 3, 4 ],
            lol: [ 0, 5 ],
        }});
    });

    it('add subset for NEW filter NEW value, NOT EMPTY storage', () => {
        const result = makeSubsets(
            mockHananas, 
            {
                ...mockFiltersValues,
                optionFilters: {
                    ...mockFiltersValues.optionFilters,
                    color: ['red'] 
                },
            },
            {
                host: { Loonarbaboon: [ 2, 3, 4 ] }
            }
        );

        expect(result).toEqual({
            host: {
                Loonarbaboon: [ 2, 3, 4 ],
            },
            color: {
                red: [ 0, 1, 2, 3 ],
            },
        });
    });

    it('DONT add subset for EXISTING filter EXISTING value', () => {
        const subsetsStorage = { host: { Loonarbaboon: [ 2, 3, 4 ] }};
        const result = makeSubsets(
            mockHananas, 
            {
                ...mockFiltersValues,
                optionFilters: {
                    ...mockFiltersValues.optionFilters,
                    host: ['Loonarbaboon'],
                },
            },
            subsetsStorage
        );

        expect(result).toEqual(subsetsStorage);
    });

    it('add sets for two filters and two values', () => {
        const result = makeSubsets(
            mockHananas, 
            {
                ...mockFiltersValues,
                optionFilters: {
                    ...mockFiltersValues.optionFilters,
                    host: ['Toptop'],
                    color: ['red', 'blue']
                },
            },
            { host: { Loonarbaboon: [ 2, 3, 4 ] }}
        );

        expect(result).toEqual({
            host: {
                Loonarbaboon: [ 2, 3, 4 ],
                Toptop: [5, 6, 8],
            },
            color: {
                red: [ 0, 1, 2, 3 ],
                blue: [4, 5, 7, 8],
            },
        });
    });

    it('DONT add subset for range filter', () => {
        const result = makeSubsets(
            mockHananas, 
            {
                ...mockFiltersValues,
                rangeFilters: {
                    ...mockFiltersValues.rangeFilters,
                    capacity: {
                        ...mockFiltersValues.rangeFilters.capacity,
                        min: {
                            limit: 0,
                            current: 500,
                        }
                    }
                },
            },
            {}
        );

        expect(result).toEqual({});
    });
});

describe('passiveOptionsFiltersAvailability', () => {
    it('unique values, one filters', () => {
        const result = __forTest.passiveOptionsFiltersAvailability(
            [2, 3],
            mockHananasMap,
            ['location']
        );
        expect(result).toEqual({
            location: ["Иркутск", "Москва"]
        });
    });

    it('duplicate values, three filters', () => {
        const result = __forTest.passiveOptionsFiltersAvailability(
            [2, 3, 4],
            mockHananasMap,
            ['beginDate', 'location', 'color']
        );
        expect(result).toEqual({
            beginDate: ["10.11.2016", "14.09.2018", "31.01.2020"],
            location: ["Иркутск", "Москва"],
            color: ["red", "blue"],
        });
    });
});


describe('activeOptionsFiltersAvability', () => {
    it('empty allSetsMap', () => {
        const result = __forTest.activeOptionsFiltersAvability(['color'], new Map(), mockHananasMap);
        
        expect(result).toEqual({});
    });

    it('one set', () => {
        const result = __forTest.activeOptionsFiltersAvability(['color'], new Map([['color', [1, 2]]]), mockHananasMap);
        expect(result).toEqual({ color: null });
    });

});
