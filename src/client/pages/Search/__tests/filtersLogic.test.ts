import { optionsFN } from '../../../components/FilterOptions/optionFiltersSlice';
import { rangeFN } from '../../../components/FilterRange/rangeFiltersSlice';
import { makeSubsets, __forTest } from '../filtersLogic';
import { mapOfEvents } from '../helpers';
import { mockEvents, mockFiltersValues } from './mocks';

const mockHananasMap = mapOfEvents(mockEvents);

describe('makeSubsets', () => {
    it('add subset in EMPTY storage', () => {
        const result = makeSubsets(
            mockEvents, 
            {
                ...mockFiltersValues,
                optionFilters: {
                    ...mockFiltersValues.optionFilters,
                    owner: ['Loonarbaboon'] 
                },
            },
            {}
        );

        expect(result).toEqual({ owner: { Loonarbaboon: [ '2', '3', '4' ] }});
    });

    it('add subset for EXISTING filter NEW value', () => {
        const result = makeSubsets(
            mockEvents, 
            {
                ...mockFiltersValues,
                optionFilters: {
                    ...mockFiltersValues.optionFilters,
                    owner: ['Loonarbaboon'],
                },
            },
            {
                owner: { lol: [ '0', '5' ] }
            }
        );

        expect(result).toEqual({ owner: {
            Loonarbaboon: [ '2', '3', '4' ],
            lol: [ '0', '5' ],
        }});
    });

    it('add subset for NEW filter NEW value, NOT EMPTY storage', () => {
        const result = makeSubsets(
            mockEvents, 
            {
                ...mockFiltersValues,
                optionFilters: {
                    ...mockFiltersValues.optionFilters,
                    city: ['Moscow'] 
                },
            },
            {
                owner: { Loonarbaboon: [ '2', '3', '4' ] }
            }
        );

        expect(result).toEqual({
            owner: {
                Loonarbaboon: [ '2', '3', '4' ],
            },
            city: {
                Moscow: [ '0', '1', '2', '3' ],
            },
        });
    });

    it('DONT add subset for EXISTING filter EXISTING value', () => {
        const subsetsStorage = { owner: { Loonarbaboon: [ '2', '3', '4' ] }};
        const result = makeSubsets(
            mockEvents, 
            {
                ...mockFiltersValues,
                optionFilters: {
                    ...mockFiltersValues.optionFilters,
                    owner: ['Loonarbaboon'],
                },
            },
            subsetsStorage
        );

        expect(result).toEqual(subsetsStorage);
    });

    it('add sets for two filters and two values', () => {
        const result = makeSubsets(
            mockEvents, 
            {
                ...mockFiltersValues,
                optionFilters: {
                    ...mockFiltersValues.optionFilters,
                    owner: ['Toptop'],
                    city: ['Moscow', 'Klin']
                },
            },
            { owner: { Loonarbaboon: [ '2', '3', '4' ] }}
        );

        expect(result).toEqual({
            owner: {
                Loonarbaboon: [ '2', '3', '4' ],
                Toptop: ['5', '6', '8'],
            },
            city: {
                Moscow: [ '0', '1', '2', '3' ],
                Klin: ['4', '5', '7', '8'],
            },
        });
    });

    it('DONT add subset for range filter', () => {
        const result = makeSubsets(
            mockEvents, 
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
            ['2', '3'],
            mockHananasMap,
            [optionsFN.LOCATION]
        );
        expect(result).toEqual({
            location: ["Rotko club", "Polygon 2"]
        });
    });

    it('duplicate values, three filters', () => {
        const result = __forTest.passiveOptionsFiltersAvailability(
            ['2', '3', '4'],
            mockHananasMap,
            [optionsFN.BEGINDATE, optionsFN.LOCATION, optionsFN.CITY]
        );
        expect(result).toEqual({
            beginDate: ["10.11.2016", "14.09.2018", "31.01.2020"],
            location: ["Rotko club", "Polygon 2"],
            city: ["Moscow", "Klin"],
        });
    });
});


describe('activeOptionsFiltersAvability', () => {
    it('empty allSetsMap', () => {
        const result = __forTest.activeOptionsFiltersAvability([optionsFN.CITY], new Map(), mockHananasMap);
        
        expect(result).toEqual({});
    });

    it('one set', () => {
        const result = __forTest.activeOptionsFiltersAvability([optionsFN.CITY], new Map([['city', ['1', '2']]]), mockHananasMap);
        expect(result).toEqual({ city: null });
    });

    it('two active filters', () => {
        const result = __forTest.activeOptionsFiltersAvability(
            [optionsFN.OWNER, optionsFN.CITY],
            new Map([
                ['owner', ['2', '3', '4']], 
                ['city', ['0', '1', '2', '3']]
            ]),
            mockHananasMap
        );
        expect(result).toEqual({
            owner: ['APG', 'Loonarbaboon'],
            city: ['Moscow', 'Klin'],
        });
    });

    it('tree active filters', () => {
        const result = __forTest.activeOptionsFiltersAvability(
            [optionsFN.OWNER, optionsFN.LOCATION, optionsFN.CITY],
            new Map([
                ['owner', ['2', '3', '4']], 
                ['location', ['0', '2', '4', '5', '6', '8']],
                ['city', ['0', '1', '2', '3', '4', '5', '7', '8']]
            ]),
            mockHananasMap
        );
        expect(result).toEqual({
            owner: ['APG', 'Loonarbaboon', 'Toptop'],
            city: ['Moscow', 'Klin'],
            location: ['Rotko club', 'Polygon 2']
        });
    });

    it('two active, one passive filters', () => {
        const result = __forTest.activeOptionsFiltersAvability(
            [optionsFN.OWNER, optionsFN.CITY],
            new Map([
                ['owner', ['2', '3', '4']], 
                ['city', ['0', '1', '2', '3', '4', '5', '7', '8']],
                ['minPrice', ['1', '2', '7']]
            ]),
            mockHananasMap
        );
        expect(result).toEqual({
            owner: ['APG', 'Loonarbaboon', 'III'],
            city: ['Moscow'],
        });
    });

});


describe('getSubsetForActiveValues', () => {
    it('basic', () => {
        const result = __forTest.getSubsetForActiveValues(
            'two',
            new Map([
                ['one', ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']],
                ['two', ['7', '8', '9']],
                ['three', ['2', '3', '4', '5', '6', '7', '8', '9']],
                ['four', ['0', '2', '3', '9']]
            ])
        );

        expect(result).toEqual(['2', '3', '9']);
    });

    it('empty result', () => {
        const result = __forTest.getSubsetForActiveValues(
            'two',
            new Map([
                ['one', ['0', '1', '2', '3']],
                ['two', ['7', '8', '9']],
                ['three', ['4', '5', '6', '7', '8', '9']],
            ])
        );

        expect(result).toEqual([]);
    });
});

describe('checkRangeFilter', () => {
    it('pass, no current', () => {
        const result = __forTest.checkRangeFilter(
            mockFiltersValues,
            rangeFN.CAPACITY,
            mockEvents[0]
        );

        expect(result).toBe(true);
    });

    it('pass Max, no Min', () => {
        const result = __forTest.checkRangeFilter(
             {
                ...mockFiltersValues,
                rangeFilters: {
                    ...mockFiltersValues.rangeFilters,
                    capacity: {
                        min: {
                            limit: 0,
                        },
                        max: {
                            limit: Infinity,
                            current: 3001,
                        },
                    }
                }
            },
            rangeFN.CAPACITY,
            mockEvents[0]
        );

        expect(result).toBe(true);
    });

    it('pass Mix, no Max', () => {
        const result = __forTest.checkRangeFilter(
             {
                ...mockFiltersValues,
                rangeFilters: {
                    ...mockFiltersValues.rangeFilters,
                    capacity: {
                        min: {
                            limit: 0,
                            current: 2000,
                        },
                        max: {
                            limit: Infinity,
                        },
                    }
                }
            },
            rangeFN.CAPACITY,
            mockEvents[0]
        );

        expect(result).toBe(true);        
    });

    it('pass, has both current', () => {
        const result = __forTest.checkRangeFilter(
             {
                ...mockFiltersValues,
                rangeFilters: {
                    ...mockFiltersValues.rangeFilters,
                    capacity: {
                        min: {
                            limit: 0,
                            current: 2000,
                        },
                        max: {
                            limit: Infinity,
                            current: 3001,
                        },
                    }
                }
            },
            rangeFN.CAPACITY,
            mockEvents[0]
        );

        expect(result).toBe(true);        
    });

    it('fail Min, has Max', () => {
        const result = __forTest.checkRangeFilter(
             {
                ...mockFiltersValues,
                rangeFilters: {
                    ...mockFiltersValues.rangeFilters,
                    capacity: {
                        min: {
                            limit: 0,
                            current: 3001,
                        },
                        max: {
                            limit: Infinity,
                            current: 4001,
                        },
                    }
                }
            },
            rangeFN.CAPACITY,
            mockEvents[0]
        );

        expect(result).toBe(false);        
    });

    it('fail Min, no Max', () => {
        const result = __forTest.checkRangeFilter(
             {
                ...mockFiltersValues,
                rangeFilters: {
                    ...mockFiltersValues.rangeFilters,
                    capacity: {
                        min: {
                            limit: 0,
                            current: 3001,
                        },
                        max: {
                            limit: Infinity,
                        },
                    }
                }
            },
            rangeFN.CAPACITY,
            mockEvents[0]
        );

        expect(result).toBe(false);        
    });

    it('fail Max, no Min', () => {
        const result = __forTest.checkRangeFilter(
             {
                ...mockFiltersValues,
                rangeFilters: {
                    ...mockFiltersValues.rangeFilters,
                    capacity: {
                        min: {
                            limit: 0,
                        },
                        max: {
                            limit: Infinity,
                            current: 2000,
                        },
                    }
                }
            },
            rangeFN.CAPACITY,
            mockEvents[0]
        );

        expect(result).toBe(false);        
    });

    it('fail Max, has Min', () => {
        const result = __forTest.checkRangeFilter(
            {
                ...mockFiltersValues,
                rangeFilters: {
                    ...mockFiltersValues.rangeFilters,
                    capacity: {
                        min: {
                            limit: 0,
                            current: 1000,
                        },
                        max: {
                            limit: Infinity,
                            current: 2000,
                        },
                    }
                }
            },
            rangeFN.CAPACITY,
            mockEvents[0]
        );

        expect(result).toBe(false);        
    });
});

describe('checkAllRangeFilters', () => {
    it('pass all', () => {
        const result = __forTest.checkAllRangeFilters(
            [rangeFN.CAPACITY, rangeFN.MINPRICE],
            {
                ...mockFiltersValues,
                rangeFilters: {
                    minPrice: {
                        min: {
                            limit: 0,
                            current: 600,
                        },
                        max: {
                            limit: Infinity,
                            current: 1000,
                        },
                    },
                    capacity: {
                        min: {
                            limit: 0,
                            current: 1000,
                        },
                        max: {
                            limit: Infinity,
                            current: 4000,
                        },
                    },
                }
            },
            mockEvents[0]
        );
        expect(result).toBe(true);
    });
    it('fail one', () => {
        const result = __forTest.checkAllRangeFilters(
            [rangeFN.CAPACITY, rangeFN.MINPRICE],
            {
                ...mockFiltersValues,
                rangeFilters: {
                    minPrice: {
                        min: {
                            limit: 0,
                            current: 600,
                        },
                        max: {
                            limit: Infinity,
                            current: 1000,
                        },
                    },
                    capacity: {
                        min: {
                            limit: 0,
                            current: 1000,
                        },
                        max: {
                            limit: Infinity,
                            current: 2000,
                        },
                    },
                }
            },
            mockEvents[0]
        );
        expect(result).toBe(false);
    });
});