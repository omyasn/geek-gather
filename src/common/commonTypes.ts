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

export interface EventDetails {
  title: string;
  beginDate: string;
  endDate: string;

  capacity: number;
  parties: string;
  partiesInfo: string;

  minPrice: number;
  priceInfo: string;

  isPublic?: boolean;
  hasQuests?: boolean;
  allowedOwnBalls?: boolean;

  ownerId: string;
  locationId: string;

  gameRules: string;
  story: string;
  time: string;
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
