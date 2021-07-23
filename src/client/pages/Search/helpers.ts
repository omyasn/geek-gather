import { IHanana, IHananaMap } from '../../../common/commonTypes';

export const intersection= (arrays: Array<number>[]): number[] => {
    if (arrays.length === 0) { return []; }
    if (arrays.length === 1) { return arrays[0]; }

    let acc = arrays[0];
    for (let i = 1; i < arrays.length; i++) {
        acc = acc.filter(el => arrays[i].includes(el));
        if (acc.length === 0) { return []; }
    }
    return acc;

    //return arrays.reduce((acc, cur) => acc.filter(i => cur.includes(i)))
};

export const mapOfHananas = (hananas: IHanana[]): IHananaMap => {
    const hananasMap = new Map();
    hananas.forEach(hanana => hananasMap.set(hanana.id, hanana));

    return hananasMap;
};