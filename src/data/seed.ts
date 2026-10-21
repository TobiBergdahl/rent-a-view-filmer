// Hardcoded prototype data. Places, walkers and dates match the traveler web
// prototype where they overlap. Dubrovnik only for the proof of concept, and
// every brief is something a walker can see from public space: walkers can't
// enter a property. Replace with the shared API.
import { demoStart, zagrebAt } from '@/lib/time'
import type { AreaId, Filmer, Job, LatLng, Request, Shot } from '@/types'

import { photos, portraits } from './photos'

const today = (hour: number, minute = 0) => zagrebAt(demoStart, 0, hour, minute)
const inDays = (days: number, hour: number, minute = 0) => zagrebAt(demoStart, days, hour, minute)
const on = (year: number, month: number, date: number, hour = 12, minute = 0) =>
  zagrebAt(Date.UTC(year, month - 1, date, 12), 0, hour, minute)
const minutesAgo = (minutes: number) => demoStart - minutes * 60_000

const shots = (...labels: string[]): Shot[] => labels.map((label, i) => ({ id: `s${i + 1}`, label }))

// The walker's area. Its centre stands in for their GPS position in the prototype.
export const areas: Record<AreaId, { name: string; centre: LatLng }> = {
  dubrovnik: { name: 'Dubrovnik', centre: [42.6507, 18.0944] }, // Lapad, home base
}

export const areaIds = Object.keys(areas) as AreaId[]

// The other walkers in the web prototype. Shown as colleagues, not used for sign in.
export const otherWalkers = ['Ana K.', 'Marin B.', 'Karlo P.', 'Iva M.']

// Walkers get about 79% of the €29 customer price, always in euros
export const WALKER_PAYOUT = 2300

// Fake auth signs every email in as Luka, the walker on the web's Banje booking.
export const luka: Filmer = {
  firstName: 'Luka',
  lastName: 'Marić',
  email: 'luka@rentaview.hr',
  photo: portraits.luka,
  area: 'dubrovnik',
  bio: 'Born in Dubrovnik, on foot most days. I show it straight: the good, the noisy and the stairs nobody mentions.',
  verified: true,
  // Luka is a licensed tour guide, so travelers see the badge
  guideLicence: { status: 'verified', fileName: 'turisticki-vodic-licenca.pdf', submittedAt: on(2025, 4, 2) },
  payout: { method: 'bank', provider: 'Zagrebačka banka', detail: 'Current account ending in 4821' },
  ratingAverage: 4.9,
  ratingCount: 52,
}

export const openRequests: Request[] = [
  {
    id: 'stradun-evening',
    place: {
      title: 'Stradun, Old Town',
      address: 'Stradun, 20000 Dubrovnik',
      area: 'Old Town',
      position: [42.6411, 18.108],
      photo: photos.dubrovnikWalls,
    },
    category: 'Neighbourhood',
    mode: 'recorded',
    payout: WALKER_PAYOUT,
    traveller: { firstName: 'Jonas', lastName: 'Weber' },
    doubt: 'Is the Old Town too loud in the evening for a family with a baby?',
    brief:
      'Walk from the Pile Gate taxi stop along Stradun around 18:00. Let the sound run, and show whether a stroller gets through the crowds.',
    shots: shots(
      'Walk from the Pile Gate taxi stop',
      '30 seconds of street sound at the busiest spot',
      'Stroller route: steps and ramps',
    ),
    deadline: today(19),
    postedAt: minutesAgo(6),
  },
  {
    id: 'banje-beach',
    place: {
      title: 'Banje Beach',
      address: 'Frana Supila, 20000 Dubrovnik',
      area: 'Ploče',
      position: [42.6414, 18.1159],
      photo: photos.beachCove,
    },
    category: 'Beach',
    mode: 'live',
    payout: WALKER_PAYOUT,
    traveller: { firstName: 'Elena', lastName: 'Rossi' },
    doubt: 'How crowded does Banje really get at lunchtime?',
    brief:
      'Show the beach live at lunchtime: how much free space there is, the shade, the showers, and the water right at the shore.',
    shots: shots('Wide view of the whole beach', 'Free space near the water', 'Shade, showers and toilets'),
    start: today(13, 30),
    minutes: 20,
    talk: true,
    postedAt: minutesAgo(18),
  },
  {
    id: 'dubrovnik-old-town',
    place: {
      title: 'Dubrovnik Old Town Apartment',
      address: 'Ul. od Puča 16, 20000 Dubrovnik',
      area: 'Old Town',
      position: [42.6408, 18.1094],
      photo: photos.oldTownAlley,
    },
    category: 'Hotel',
    mode: 'recorded',
    payout: WALKER_PAYOUT,
    traveller: { firstName: 'Priya', lastName: 'Shah' },
    doubt: 'The listing says “quiet street”. Is the building site next door noisy?',
    brief:
      'Show the building and the street from outside, the building site next door, and how loud it is around midday.',
    shots: shots('View of the building and street', 'The building site next door', '30 seconds of street noise'),
    deadline: inDays(1, 12),
    postedAt: minutesAgo(41),
  },
  {
    id: 'lapad-walk',
    place: {
      title: 'Lapad Bay',
      address: 'Šetalište kralja Zvonimira, 20000 Dubrovnik',
      area: 'Lapad',
      position: [42.6558, 18.0756],
      photo: photos.lapadBay,
    },
    category: 'Neighbourhood',
    mode: 'live',
    payout: WALKER_PAYOUT,
    traveller: { firstName: 'Tom', lastName: 'Hughes' },
    doubt: 'The listing says “5 minutes to the beach”. Is that true?',
    brief: 'Walk live from the apartment block to Lapad beach so we can time it, and show the hill on the way back.',
    shots: shots('The building entrance and surroundings', 'Walk to the beach, timed', 'The hill on the way back'),
    start: inDays(1, 18, 45),
    minutes: 15,
    talk: true,
    postedAt: minutesAgo(65),
  },
  {
    id: 'gruz-harbour-loft',
    place: {
      title: 'Gruž Harbour Loft',
      address: 'Obala Stjepana Radića 12, 20000 Dubrovnik',
      area: 'Gruž',
      position: [42.6589, 18.0857],
      photo: photos.marinaBoats,
    },
    category: 'Neighbourhood',
    mode: 'recorded',
    payout: WALKER_PAYOUT,
    traveller: { firstName: 'Sara', lastName: 'Lind' },
    doubt: 'Will I sleep with the ferry port right below?',
    brief:
      'Record the approach from the bus stop, the building entrance, the stairs to the door, and the harbour noise in the evening.',
    shots: shots(
      'Approach from the bus stop',
      'Building entrance and surroundings',
      'Stairs from the street to the door',
      'Harbour noise in the evening',
    ),
    deadline: inDays(2, 18),
    postedAt: minutesAgo(130),
  },
]

export const initialJobs: Job[] = [
  {
    // The web prototype's live booking: Maya and Luka at Banje Beachfront Studio
    id: 'banje-beachfront',
    request: {
      id: 'banje-beachfront',
      place: {
        title: 'Banje Beachfront Studio',
        address: 'Ul. Frana Supila 6, 20000 Dubrovnik',
        area: 'Ploče',
        position: [42.64185, 18.11585],
        photo: photos.beachCove,
      },
      category: 'Beach',
      mode: 'live',
      payout: WALKER_PAYOUT,
      traveller: { firstName: 'Maya', lastName: 'Chen' },
      doubt: 'Is it really beachfront, or is there a busy road in between?',
      // Same brief as the web
      brief:
        'Walk from the taxi drop-off to the beachfront studio live and show the street, the stairs, the walk to the beach and street noise.',
      shots: shots('The street from the taxi drop-off', 'Stairs from taxi to door', 'Walk to the beach', 'Street noise'),
      start: today(10, 45),
      minutes: 15,
      talk: true,
      postedAt: minutesAgo(60 * 26),
    },
    status: 'scheduled',
    acceptedAt: minutesAgo(60 * 25),
  },
  {
    id: 'ploce-penthouse',
    request: {
      id: 'ploce-penthouse',
      place: {
        title: 'Ploče Sea-View Penthouse',
        address: 'Ul. Vlaha Bukovca 4, 20000 Dubrovnik',
        area: 'Ploče',
        position: [42.6432, 18.1182],
        photo: photos.srdView,
      },
      category: 'Hotel',
      mode: 'recorded',
      payout: WALKER_PAYOUT,
      traveller: { firstName: 'Noah', lastName: 'Fischer' },
      doubt: 'Is it on a quiet lane, or right above the busy coast road?',
      brief: 'Show the lane outside, the traffic on the coast road below, and the steps up from the bus stop.',
      shots: shots('The lane outside the building', 'Traffic on the coast road', 'Steps up from the bus stop'),
      deadline: inDays(-1, 18),
      postedAt: minutesAgo(60 * 30),
    },
    status: 'awaiting',
    acceptedAt: minutesAgo(60 * 29),
    arrivedAt: inDays(-1, 16, 50),
    video: { seconds: 73, photo: photos.srdView, at: inDays(-1, 17, 9), shown: ['s1', 's2', 's3'] },
    deliveredAt: inDays(-1, 17, 20),
  },
  {
    id: 'pile-bay-villa',
    request: {
      id: 'pile-bay-villa',
      place: {
        title: 'Pile Bay Sea-View Villa',
        address: 'Ul. Brsalje 3, 20000 Dubrovnik',
        area: 'Pile',
        position: [42.6416, 18.1047],
        photo: photos.pileBay,
      },
      category: 'Listing',
      mode: 'recorded',
      payout: WALKER_PAYOUT,
      traveller: { firstName: 'Hannah', lastName: 'Berg' },
      doubt: 'How loud is the road by Pile Gate at night?',
      brief: 'Record the street outside after 22:00, the traffic at Pile Gate and the walk to the door.',
      shots: shots('The street outside', 'Traffic at Pile Gate after 22:00', 'Walk to the door'),
      deadline: on(2026, 3, 15, 23),
      postedAt: on(2026, 3, 14, 9),
    },
    status: 'completed',
    acceptedAt: on(2026, 3, 14, 9, 20),
    arrivedAt: on(2026, 3, 15, 21, 50),
    deliveredAt: on(2026, 3, 15, 22, 40),
    releasedAt: on(2026, 3, 16, 8, 5),
    // "Don't book" is also a success
    rating: {
      stars: 5,
      comment: 'Honest and clear. The night traffic settled it: we booked somewhere else. Thank you, Luka!',
      at: on(2026, 3, 16, 8, 5),
    },
  },
  {
    id: 'old-town-alley',
    request: {
      id: 'old-town-alley',
      place: {
        title: 'Old Town Alley Studio',
        address: 'Široka ul. 5, 20000 Dubrovnik',
        area: 'Old Town',
        position: [42.6416, 18.1085],
        photo: photos.oldTownAlley,
      },
      category: 'Listing',
      mode: 'recorded',
      payout: WALKER_PAYOUT,
      traveller: { firstName: 'Clara', lastName: 'Dubois' },
      doubt: 'Is the studio really on a quiet street, or right off Stradun?',
      brief: 'Film the walk from Pile Gate to the door, the alley outside, and the noise from Stradun in the evening.',
      shots: shots('Walk from Pile Gate to the door', 'The alley outside', 'Noise from Stradun, evening'),
      deadline: inDays(-2, 20),
      postedAt: inDays(-3, 10),
    },
    status: 'completed',
    acceptedAt: inDays(-3, 10, 30),
    arrivedAt: inDays(-2, 18, 40),
    video: { seconds: 96, photo: photos.oldTownAlley, at: inDays(-2, 18, 55), shown: ['s1', 's2', 's3'] },
    deliveredAt: inDays(-2, 19, 5),
    releasedAt: inDays(-1, 9, 15),
    rating: {
      stars: 5,
      comment: 'Quiet street, exactly as you showed it. Booked it straight away.',
      at: inDays(-1, 9, 15),
    },
  },
  {
    id: 'lapad-steps',
    request: {
      id: 'lapad-steps',
      place: {
        title: 'Lapad Beach Apartment',
        address: 'Ul. kralja Tomislava 8, 20000 Dubrovnik',
        area: 'Lapad',
        position: [42.6541, 18.0783],
        photo: photos.stoneHouse,
      },
      category: 'Beach',
      mode: 'live',
      payout: WALKER_PAYOUT,
      traveller: { firstName: 'Mia', lastName: 'Novak' },
      doubt: 'How many steps down to the beach? We travel with my dad, who uses a cane.',
      brief: 'Walk live from the front door to the sand so we can count the steps.',
      shots: shots('Front door from the street', 'Every step down to the beach', 'The beach entrance'),
      start: inDays(-10, 11),
      minutes: 15,
      talk: true,
      postedAt: inDays(-12, 9),
    },
    status: 'completed',
    acceptedAt: inDays(-12, 9, 20),
    arrivedAt: inDays(-10, 10, 52),
    callStartedAt: inDays(-10, 11),
    callSeconds: 13 * 60 + 40,
    deliveredAt: inDays(-10, 11, 14),
    releasedAt: inDays(-9, 8, 30),
    rating: {
      stars: 5,
      comment: 'You counted every step with us. Exactly what we needed.',
      at: inDays(-9, 8, 30),
    },
  },
  {
    id: 'srd-hillside',
    request: {
      id: 'srd-hillside',
      place: {
        title: 'Srđ Hillside Retreat',
        address: 'Bosanka 21, 20000 Dubrovnik',
        area: 'Srđ',
        position: [42.6496, 18.1236],
        photo: photos.oldPort,
      },
      category: 'Listing',
      mode: 'live',
      payout: WALKER_PAYOUT,
      traveller: { firstName: 'Lucas', lastName: 'Martin' },
      doubt: 'Can we walk down to the Old Town, or do we need a taxi?',
      brief: 'Walk the route from the house down to Ploče Gate live, so we can see if it works with kids.',
      shots: shots('The house from the road', 'The path down the hill', 'Ploče Gate'),
      start: on(2026, 3, 5, 11),
      minutes: 30,
      talk: true,
      postedAt: on(2026, 3, 3, 15),
    },
    status: 'completed',
    acceptedAt: on(2026, 3, 3, 15, 30),
    arrivedAt: on(2026, 3, 5, 10, 52),
    callSeconds: 27 * 60 + 12,
    deliveredAt: on(2026, 3, 5, 11, 28),
    releasedAt: on(2026, 3, 5, 14),
    rating: {
      stars: 5,
      comment: 'Luka walked the whole path with us and answered every question. Booked it the same day.',
      at: on(2026, 3, 5, 14),
    },
  },
]
