import { intersection, mapOfHananas } from '../helpers';

test('intersection', () => {
    const test = intersection([[1, 2, 4], [2, 3, 4], [4, 4, 2]]);
    expect(test).toEqual([2, 4]);
});

test('intersection only one', () => {
    const test = intersection([[1, 2, 4]]);
    expect(test).toEqual([1, 2, 4]);
});

test('intersection empty', () => {
    const test = intersection([]);
    expect(test).toEqual([]);
});


test('intersection no inter', () => {
    const test = intersection([[1, 2, 4], [0, 3, 9], [4, 5, 6]]);
    expect(test).toEqual([]);
});


test('mapOfHananas', () => {
    const test = mapOfHananas([
        {
            id: 0,
            title: 'БПМ',
            beginDate: '22.06.2021',
            capacity: 3000,
            minPrice: 700,
            host: 'АПГ',
            location: 'Иркутск',
            color: 'red',
        },
        {
            id: 1,
            title: 'Красная капелла: Ответный удар',
            beginDate: '07.06.2018',
            capacity: 200,
            minPrice: 1000,
            host: 'АПГ',
            location: 'Москва',
            color: 'red',	
        },
    ]);
    expect(test).toMatchSnapshot();
});
