export interface EventProps {
  title: string;
  beginDate: string;

  location: string;
  city: string;
  locationLink: string;

  capacity: number;
  parties: string;
  minPrice: number;

  owner: string;
  ownerLink: string;

  isPublic?: boolean;
  hasQuests?: boolean;
  allowedOwnBalls?: boolean;
}

export type EventType = { id: string } & EventProps;

export interface BackendEvent {
  id: string;
  resourceContent: EventProps;
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
