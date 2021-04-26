export interface IHananaProps {
    title: string;
    beginDate: string;
    capacity: number;
    minPrice: number;
    host: string;
}

export type IHanana = { id: number } & IHananaProps;