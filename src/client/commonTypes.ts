export interface IHananaProps {
    title: string;
    beginDate: string;
    capacity: number;
    minPrice: number;
    host: string;
}

export type IHanana = { id: number } & IHananaProps;

export interface IBackendDataItem {
    id: number;
    resourceContent: IHananaProps;
}

export interface IHananaDetails {
    id: number;
    title: string;
    active: boolean;
    beginDate: string; // в коде надо хранить датой
    endDate: string;
    capacity: number;
    gameRules: string;
    shortInfo: string;
    locationId: number;
    host: string;
    priceInfo: string;
    minPrice: number;
}

export interface ILocation {
    id: number;
    name: string;
    info: string;
    additionalInfo: string;
    addressLine1: string;
    addressLine2: string;
    capacity: number;
    city: string;
    state: string;
    country: string;
    index: string;
    coordinates: {
        lat: string;
        long: string;
    };
}