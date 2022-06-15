import { EventDetails, ILocation } from '../common/commonTypes';

interface IBackendDetails {
    id: string;
    url: string;
    resourceContent: EventDetails;
}

export const mockDetailsOfEvent: IBackendDetails[] = [{
		id: 'evnt1',
		url: '/events/evnt1',
		resourceContent: {
			title: "BPM: Brigades",
			beginDate: "2022-05-23",
	
			capacity: 2000,
			parties: "2",
			minPrice: 2000,
	
			isPublic: true,
			hasQuests: true,
			allowedOwnBalls: false,
			locationId: "Sanatorium 'Green Town'",
			ownerId: "APG",

			endDate: "2022-05-24",
			partiesInfo: "APG",
			priceInfo: "APG",
			gameRules: "APG",
			story: "APG",
			time: '9:00'
		},
	},{
		id: "evnt2",
		url: '/events/evnt2',
		resourceContent: {
		  title: "Mercenaries2: Operation Flow",
		  beginDate: "2022-05-29",
	
		  capacity: 300,
		  parties: "1+1 vs 1+1",
		  minPrice: 1500,
	
		  isPublic: true,
		  hasQuests: true,
		  allowedOwnBalls: true,
		  locationId: "Polygon 'Star'",
		  ownerId: "Restricted Area",

		  endDate: "2022-05-29",
		  partiesInfo: "APG",
		  priceInfo: "APG",
		  gameRules: "APG",
		  story: "APG",
		  time: '10:00'
		},
	  },
	  {
		id: "evnt3",
		url: '/events/evnt3',
		resourceContent: {
		  title: "VETERANS: Banner of Victory",
		  beginDate: "2022-06-19",
		  capacity: 1000,
		  parties: "2",
		  minPrice: 900,
	
		  isPublic: true,
		  hasQuests: false,
		  allowedOwnBalls: true,
		  locationId: "Polygon Noginsk-2",
		  ownerId: "Real Games",

		  endDate: "2022-06-20",
		  partiesInfo: "APG",
		  priceInfo: "APG",
		  gameRules: "APG",
		  story: "APG",
		  time: '9:00'
		},
	  },
	  {
		id: "evnt4",
		url: '/events/evnt4',
		resourceContent: {
		  title: "Afganistan",
		  beginDate: "2022-07-01",
	
		  capacity: 400,
		  parties: "2",
		  minPrice: 800,
	
		  isPublic: true,
		  hasQuests: false,
		  allowedOwnBalls: true,
		  locationId: "Polygon 'Star'",
		  ownerId: "Restricted Area",

		  endDate: "2022-07-01",
		  partiesInfo: "APG",
		  priceInfo: "APG",
		  gameRules: "APG",
		  story: "APG",
		  time: '10:00'
		},
	  },
	  {
		id: "evnt5",
		url: '/events/evnt5',
		resourceContent: {
		  title: "FALLOUT XIII",
		  beginDate: "2022-07-21",
	
		  capacity: 600,
		  parties: "3",
		  minPrice: 1000,
	
		  isPublic: true,
		  hasQuests: false,
		  allowedOwnBalls: true,
		  locationId: "Polygon 'RSB'",

		  ownerId: "Restricted Area",

		  endDate: "2022-07-21",
		  partiesInfo: "APG",
		  priceInfo: "APG",
		  gameRules: "APG",
		  story: "APG",
		  time: '11:00'

		},
	  },
	  {
		id: "evnt6",
		url: '/events/evnt6',
		resourceContent: {
		  title: "Stories of an Old Man",
		  beginDate: "2022-07-30",
	
		  capacity: 300,
		  parties: "2",
		  minPrice: 1000,
	
		  isPublic: true,
		  hasQuests: true,
		  allowedOwnBalls: false,
		  locationId: "Raining Forest Club",

		  ownerId: "Legendarium",

		  endDate: "2022-07-30",
		  partiesInfo: "APG",
		  priceInfo: "APG",
		  gameRules: "APG",
		  story: "APG",
		  time: '12:00'

		},
	  },
	  {
		id: "evnt7",
		url: '/events/evnt7',
		resourceContent: {
		  title: "Weekend Game",
		  beginDate: "2022-06-30",
	
		  capacity: 20,
		  parties: "2",
		  minPrice: 600,
	
		  isPublic: false,
		  hasQuests: false,
		  allowedOwnBalls: false,
		  locationId: "Bunker Club",

		  ownerId: "Andrew",

		  endDate: "2022-06-30",
		  partiesInfo: "APG",
		  priceInfo: "APG",
		  gameRules: "APG",
		  story: "APG",
		  time: '13:00'

		},
	  },
	  {
		id: "evnt8",
		url: '/events/evnt8',
		resourceContent: {
		  title: "Training",
		  beginDate: "2022-07-07",
		  capacity: 20,
		  parties: "2",
		  minPrice: 500,
		  isPublic: false,
		  hasQuests: false,
		  allowedOwnBalls: false,
		  locationId: "Bunker Club",

		  ownerId: "Deadlyfang",

		  endDate: "2022-07-07",
		  partiesInfo: "APG",
		  priceInfo: "APG",
		  gameRules: "APG",
		  story: "APG",
		  time: '19:00'

		},
	  },
	  {
		id: "evnt9",
		url: '/events/evnt9',
		resourceContent: {
		  title: "Big Bears War",
		  beginDate: "2022-08-07",
		  capacity: 400,
		  parties: "2",
		  minPrice: 1200,
	
		  isPublic: true,
		  hasQuests: true,
		  allowedOwnBalls: true,
		  locationId: "Raining Forest Club",

		  ownerId: "It Is What It Is",

		  endDate: "2022-08-07",
		  partiesInfo: "APG",
		  priceInfo: "APG",
		  gameRules: "APG",
		  story: "APG",
		  time: '11:00'

		},
	  },
	  {
		id: "evnt10",
		url: '/events/evnt10',
		resourceContent: {
		  title: "Game for all",
		  beginDate: "2022-08-10",
	
		  locationId: "Centrum Club",

		  ownerId: "Peter",

	
		  capacity: 30,
		  parties: "2",
		  minPrice: 550,
	
		  isPublic: false,
		  hasQuests: false,
		  allowedOwnBalls: false,

		  endDate: "2022-08-10",
		  partiesInfo: "APG",
		  priceInfo: "APG",
		  gameRules: "APG",
		  story: "APG",
		  time: '15:00'
		},
	  },
];

export const mockLocationInfo = {
	id: '1',
	url: '/locationId/1',
	resourceContent: {
		id: 1,
		name: 'Зеленый городок',
		info: 'Московская область, Пушкинский район, Костино, территория санатория "Зеленый Городок", 20 км от МКАД по Ярославскому шоссе',
		additionalInfo: '',
		addressLine1: 'Московская область, Пушкинский район, Костино, территория санатория "Зеленый Городок", 20 км от МКАД по Ярославскому шоссе',
		addressLine2: 'вторая строка',
		capacity: 3000,
		city: 'Московская область',
		state: 'Московская область',
		country: 'Россия',
		index: '',
		coordinates: {
			lat: '100',
			long: '200',
		}
	},
};

export const imagesOfEvent = [
	'http://topgun.ru/wp-content/uploads/Mira-po-pejntbolu-zavershilsya-CHempion-2014-goda-rossijskaya-pejntbol-naya-komanda-7.jpg',
	'https://www.crazystag.com/i/780-450/uimages/warszawa/PAINTBALL_INDOOR/w_pb1.jpg',
	'http://www.pyrrhicpaintball.com/wp-content/uploads/2015/02/pyrrhic-paintball-boise-nampa-meridian-100-600.jpg',
];
