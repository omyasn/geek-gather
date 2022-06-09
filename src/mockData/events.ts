import { BackendEvent } from "../common/commonTypes";
export const events: BackendEvent[] = [
  {
    id: "evnt1",
    resourceContent: {
      title: "BPM: Brigades",
      beginDate: "2022-05-23",

      capacity: 2000,
      parties: "2",
      minPrice: 2000,

      private: false,
      hasQuests: true,
      ownBalls: false,
      location: "Sanatorium 'Green Town'",
      city: "Moscow",
      locationLink: "https://google.com",
      owner: "APG",
      ownerLink: "https://google.com",
    },
  },
  {
    id: "evnt2",
    resourceContent: {
      title: "Mercenaries2: Operation Flow",
      beginDate: "2022-05-29",

      capacity: 300,
      parties: "1+1 vs 1+1",
      minPrice: 1500,

      private: false,
      hasQuests: true,
      ownBalls: true,
      location: "Polygon 'Star'",
      city: "Moscow",
      locationLink: "https://google.com",
      owner: "Restricted Area",
      ownerLink: "https://google.com",
    },
  },
  {
    id: "evnt3",
    resourceContent: {
      title: "VETERANS: Banner of Victory",
      beginDate: "2022-06-19",
      capacity: 1000,
      parties: "2",
      minPrice: 900,

      private: false,
      hasQuests: false,
      ownBalls: true,
      location: "Polygon Noginsk-2",
      city: "Noginsk",
      locationLink: "https://google.com",
      owner: "Real Games",
      ownerLink: "https://google.com",
    },
  },
  {
    id: "evnt4",
    resourceContent: {
      title: "Afganistan",
      beginDate: "2022-07-01",

      capacity: 400,
      parties: "2",
      minPrice: 800,

      private: false,
      hasQuests: false,
      ownBalls: true,
      location: "Polygon 'Star'",
      city: "Moscow",
      locationLink: "https://google.com",
      owner: "Restricted Area",
      ownerLink: "https://google.com",
    },
  },
  {
    id: "evnt5",
    resourceContent: {
      title: "FALLOUT XIII",
      beginDate: "2022-07-21",

      capacity: 600,
      parties: "3",
      minPrice: 1000,

      private: false,
      hasQuests: false,
      ownBalls: true,
      location: "Polygon 'RSB'",
      city: "Moscow",
      locationLink: "https://google.com",
      owner: "Restricted Area",
      ownerLink: "https://google.com",
    },
  },
  {
    id: "evnt6",
    resourceContent: {
      title: "Stories of Old Man",
      beginDate: "2022-07-30",

      capacity: 300,
      parties: "2",
      minPrice: 1000,

      private: false,
      hasQuests: true,
      ownBalls: false,
      location: "Raining Forest Club",
      city: "St.Peterbugr",
      locationLink: "https://google.com",
      owner: "Legendarium",
      ownerLink: "https://google.com",
    },
  },
  {
    id: "evnt7",
    resourceContent: {
      title: "Weekend Game",
      beginDate: "2022-06-30",

      capacity: 20,
      parties: "2",
      minPrice: 600,

      private: true,
      hasQuests: false,
      ownBalls: false,
      location: "Bunker Club",
      city: "Moscow",
      locationLink: "https://google.com",
      owner: "Andrew",
      ownerLink: "https://google.com",
    },
  },
  {
    id: "evnt8",
    resourceContent: {
      title: "Training",
      beginDate: "2022-07-07",
      capacity: 20,
      parties: "2",
      minPrice: 500,
      private: true,
      hasQuests: false,
      ownBalls: false,
      location: "Bunker Club",
      city: "Moscow",
      locationLink: "https://google.com",
      owner: "Deadlyfang",
      ownerLink: "https://google.com",
    },
  },
  {
    id: "evnt9",
    resourceContent: {
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
  },
  {
    id: "evnt10",
    resourceContent: {
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
  },
];
