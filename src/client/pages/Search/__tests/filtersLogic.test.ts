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

    it('two active filters', () => {
        const result = __forTest.activeOptionsFiltersAvability(
            ['host', 'color'],
            new Map([
                ['host', [2, 3, 4]], 
                ['color', [0, 1, 2, 3]]
            ]),
            mockHananasMap
        );
        expect(result).toEqual({
            host: ['АПГ', 'Loonarbaboon'],
            color: ['red', 'blue'],
        });
    });

    it('tree active filters', () => {
        const result = __forTest.activeOptionsFiltersAvability(
            ['host', 'location', 'color'],
            new Map([
                ['host', [2, 3, 4]], 
                ['location', [0, 2, 4, 5, 6, 8]],
                ['color', [0, 1, 2, 3, 4, 5, 7, 8]]
            ]),
            mockHananasMap
        );
        expect(result).toEqual({
            host: ['АПГ', 'Loonarbaboon', 'Toptop'],
            color: ['red', 'blue'],
            location: ['Иркутск', 'Москва']
        });
    });

    it('two active, one passive filters', () => {
        const result = __forTest.activeOptionsFiltersAvability(
            ['host', 'color'],
            new Map([
                ['host', [2, 3, 4]], 
                ['color', [0, 1, 2, 3, 4, 5, 7, 8]],
                ['minPrice', [1, 2, 7]]
            ]),
            mockHananasMap
        );
        expect(result).toEqual({
            host: ['АПГ', 'Loonarbaboon', 'III'],
            color: ['red'],
        });
    });

});


describe('getSubsetForActiveValues', () => {
    it('basic', () => {
        const result = __forTest.getSubsetForActiveValues(
            'two',
            new Map([
                ['one', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
                ['two', [7, 8, 9]],
                ['three', [2, 3, 4, 5, 6, 7, 8, 9]],
                ['four', [0, 2, 3, 9]]
            ])
        );

        expect(result).toEqual([2, 3, 9]);
    });

    it('empty result', () => {
        const result = __forTest.getSubsetForActiveValues(
            'two',
            new Map([
                ['one', [0, 1, 2, 3]],
                ['two', [7, 8, 9]],
                ['three', [4, 5, 6, 7, 8, 9]],
            ])
        );

        expect(result).toEqual([]);
    });
});

describe('checkRangeFilter', () => {
    it('pass, no current', () => {
        const result = __forTest.checkRangeFilter(
            mockFiltersValues,
            'capacity',
            mockHananas[0]
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
            'capacity',
            mockHananas[0]
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
            'capacity',
            mockHananas[0]
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
            'capacity',
            mockHananas[0]
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
            'capacity',
            mockHananas[0]
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
            'capacity',
            mockHananas[0]
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
            'capacity',
            mockHananas[0]
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
            'capacity',
            mockHananas[0]
        );

        expect(result).toBe(false);        
    });
});

describe('checkAllRangeFilters', () => {
    it('pass all', () => {
        const result = __forTest.checkAllRangeFilters(
            ['capacity', 'minPrice'],
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
            mockHananas[0]
        );
        expect(result).toBe(true);
    });
    it('fail one', () => {
        const result = __forTest.checkAllRangeFilters(
            ['capacity', 'minPrice'],
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
            mockHananas[0]
        );
        expect(result).toBe(false);
    });
});