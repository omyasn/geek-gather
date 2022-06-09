import { intersection, mapOfEvents, createOrAddToSet } from '../helpers';

test('intersection', () => {
    const test = intersection([['1', '2', '4'], ['2', '3', '4'], ['4', '4', '2']]);
    expect(test).toEqual(['2', '4']);
});

test('intersection only one', () => {
    const test = intersection([['1', '2', '4']]);
    expect(test).toEqual(['1', '2', '4']);
});

test('intersection empty', () => {
    const test = intersection([]);
    expect(test).toEqual([]);
});


test('intersection no inter', () => {
    const test = intersection([['1', '2', '4'], ['0', '3', '9'], ['4', '5', '6']]);
    expect(test).toEqual([]);
});


test('mapOfEvents', () => {
    const test = mapOfEvents([
        {
            id: "evnt9",
            title: "Big Bears War",
            beginDate: "2022-08-07",
            capacity: 400,
            parties: "2",
            minPrice: 1200,
            private: false,
            hasQuests: true,
            ownBalls: true,
            location: "Raining Forest Club",
            city: "St.Peterbugr",
            locationLink: "https://google.com",
            owner: "It Is What It Is",
            ownerLink: "https://google.com",
          },
          {
            id: "evnt10",
            title: "Game for all",
            beginDate: "2022-08-10",
            location: "Centrum Club",
            city: "Noginsk",
            locationLink: "https://google.com",
            owner: "Peter",
            ownerLink: "https://google.com",
            capacity: 30,
            parties: "2",
            minPrice: 550,
            private: true,
            hasQuests: false,
            ownBalls: false,
          },
    ]);
    expect(test).toMatchSnapshot();
});


describe('createOrAddToSet', () => {
    it('create set', () => {
        const result: any = {};
        const value = 'val';
        result.attr = createOrAddToSet(result.attr, value);

        expect(result).toEqual({ attr: new Set(['val']) });
    });

    it('add to set', () => {
        const result: any = { attr: new Set(['lol']) };
        const value = 'kek';
        result.attr = createOrAddToSet(result.attr, value);

        expect(result).toEqual({ attr: new Set(['lol', 'kek']) });
    });
});