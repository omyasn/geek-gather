import { EventType } from '../../../common/commonTypes';

export const intersection= (arrays: Array<string>[]): string[] => {
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

export const mapOfEvents = (events: EventType[]): Map<string, EventType> => {
    const eventsMap = new Map();
    events.forEach(event => eventsMap.set(event.id, event));

    return eventsMap;
};

export function createOrAddToSet<T>(container: Set<T>, value: T) {
    return container ? container.add(value) : new Set([value]);
}