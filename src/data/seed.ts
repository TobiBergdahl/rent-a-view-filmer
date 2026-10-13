// Hardcoded prototype data. Places, filmers and dates match the traveller web
// prototype where they overlap. Replace with the shared API.
import { demoStart, zagrebAt } from '@/lib/time'
import type { AreaId, Filmer, Job, LatLng, Request, Shot } from '@/types'

import { photos, portraits } from './photos'

const today = (hour: number, minute = 0) => zagrebAt(demoStart, 0, hour, minute)
const inDays = (days: number, hour: number, minute = 0) => zagrebAt(demoStart, days, hour, minute)
const on = (year: number, month: number, date: number, hour = 12, minute = 0) =>
  zagrebAt(Date.UTC(year, month - 1, date, 12), 0, hour, minute)
const minutesAgo = (minutes: number) => demoStart - minutes * 60_000

const shots = (...labels: string[]): Shot[] => labels.map((label, i) => ({ id: `s${i + 1}`, label }))

// Each area's centre stands in for the filmer's GPS position in the prototype
export const areas: Record<AreaId, { name: string; centre: LatLng }> = {
  split: { name: 'Split', centre: [43.5103, 16.4318] }, // Veli Varoš, a short walk from the Riva
  hvar: { name: 'Hvar', centre: [43.1729, 16.4412] },
  dubrovnik: { name: 'Dubrovnik', centre: [42.6507, 18.0944] },
  zadar: { name: 'Zadar', centre: [44.1194, 15.2314] },
  zagreb: { name: 'Zagreb', centre: [45.815, 15.9819] },
}

export const areaIds = Object.keys(areas) as AreaId[]

// The other filmers in the web prototype. Shown as colleagues, not used for sign in.
export const otherFilmers = ['Ana K.', 'Marin B.', 'Karlo P.', 'Iva M.']

// Fake auth signs every email in as Luka, the filmer on the web's Hvar booking.
export const luka: Filmer = {
  firstName: 'Luka',
  lastName: 'Marić',
  email: 'luka@rentaview.hr',
  photo: portraits.luka,
  area: 'split',
  bio: 'Born in Split, on a bike most days. I film it straight: the good, the noisy and the stairs nobody mentions.',
  verified: true,
  // Luka is a licensed tour guide, so travellers see the badge
  guideLicence: { status: 'verified', fileName: 'turisticki-vodic-licenca.pdf', submittedAt: on(2025, 4, 2) },
  payout: { method: 'bank', provider: 'Zagrebačka banka', detail: 'Current account ending in 4821' },
  ratingAverage: 4.9,
  ratingCount: 52,
}

export const openRequests: Request[] = [
  {
    id: 'split-center',
    place: {
      title: 'Split Center',
      address: 'Riva, 21000 Split',
      area: 'Split',
      position: [43.5081, 16.4402],
      photo: photos.splitHarbour,
    },
    category: 'Neighbourhood',
    mode: 'recorded',
    payout: 2900,
    traveller: { firstName: 'Jonas', lastName: 'Weber' },
    doubt: 'Is the Riva too loud in the evening for a family with a baby?',
    brief:
      'Walk the Riva from the fountain to the fish market around 18:00. Let the sound run, and show whether a stroller gets through the crowds.',
    shots: shots(
      'Walk from the fountain to the fish market',
      '30 seconds of street sound at the busiest spot',
      'Stroller route: kerbs, steps and ramps',
    ),
    deadline: today(19),
    postedAt: minutesAgo(6),
  },
  {
    id: 'bacvice-beach',
    place: {
      title: 'Bačvice Beach',
      address: 'Šetalište Petra Preradovića, 21000 Split',
      area: 'Split',
      position: [43.5023, 16.4469],
      photo: photos.hvarHarbour,
    },
    category: 'Beach',
    mode: 'live',
    payout: 4500,
    traveller: { firstName: 'Elena', lastName: 'Rossi' },
    doubt: 'How crowded does Bačvice really get at lunchtime?',
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
      area: 'Dubrovnik',
      position: [42.6408, 18.1094],
      photo: photos.dubrovnikWalls,
    },
    category: 'Hotel',
    mode: 'recorded',
    payout: 2900,
    traveller: { firstName: 'Priya', lastName: 'Shah' },
    doubt: 'The listing says “sea view”. Can I really see the sea from the balcony?',
    brief:
      'Verify the actual balcony view from room 302, and check whether the construction next door is noisy.',
    shots: shots(
      '10-second slow pan of the balcony view',
      'Close-up of bathroom and shower corners',
      'Sound level with the balcony door open',
    ),
    deadline: inDays(1, 12),
    postedAt: minutesAgo(41),
  },
  {
    id: 'zadar-riva',
    place: {
      title: 'Zadar Riva',
      address: 'Obala kralja Petra Krešimira IV, 23000 Zadar',
      area: 'Zadar',
      position: [44.1137, 15.225],
      photo: photos.zadarSunset,
    },
    category: 'Neighbourhood',
    mode: 'live',
    payout: 3900,
    traveller: { firstName: 'Tom', lastName: 'Hughes' },
    doubt: 'Is the sunset spot by the Sea Organ worth planning a whole evening around?',
    brief:
      'Join at sunset by the Sea Organ. Show the crowd, where to sit, and let me hear the organ for a minute.',
    shots: shots('The Sea Organ steps', 'Where people sit for sunset', 'One minute of the organ'),
    start: inDays(1, 18, 45),
    minutes: 15,
    talk: true,
    postedAt: minutesAgo(65),
  },
  {
    id: 'zagreb-city-loft',
    place: {
      title: 'Zagreb City Loft',
      address: 'Tkalčićeva ul. 12, 10000 Zagreb',
      area: 'Zagreb',
      position: [45.8155, 15.9771],
      photo: photos.zagrebStreet,
    },
    category: 'Neighbourhood',
    mode: 'recorded',
    payout: 2900,
    traveller: { firstName: 'Sara', lastName: 'Lind' },
    doubt: 'Will I sleep with the bars on Tkalčićeva right below?',
    // Same brief as the web prototype's Zagreb booking
    brief:
      'Record the approach from the street, building entrance, lift, natural light in the main room, and noise with the windows open.',
    shots: shots(
      'Approach from the street',
      'Building entrance and lift',
      'Natural light in the main room',
      'Noise with the windows open',
    ),
    deadline: inDays(2, 18),
    postedAt: minutesAgo(130),
  },
]

export const initialJobs: Job[] = [
  {
    // The web prototype's live booking: Maya and Luka at the Hvar studio
    id: 'hvar-beachfront',
    request: {
      id: 'hvar-beachfront',
      place: {
        title: 'Hvar Beachfront Studio',
        address: 'Fabrika 12, 21450 Hvar',
        area: 'Hvar',
        position: [43.17182, 16.44165],
        photo: photos.hvarHarbour,
      },
      category: 'Beach',
      mode: 'live',
      payout: 3900,
      traveller: { firstName: 'Maya', lastName: 'Chen' },
      doubt: 'Is it really beachfront, or is there a busy road in between?',
      brief:
        'Walk through the beachfront studio live and show the view, beach access, street noise, and the condition of the balcony.',
      shots: shots('The view from the balcony', 'Walk to the beach access', 'Street noise', 'Balcony condition'),
      start: today(10, 45),
      minutes: 15,
      talk: true,
      postedAt: minutesAgo(60 * 26),
    },
    status: 'scheduled',
    acceptedAt: minutesAgo(60 * 25),
  },
  {
    id: 'zadar-sunset-penthouse',
    request: {
      id: 'zadar-sunset-penthouse',
      place: {
        title: 'Zadar Sunset Penthouse',
        address: 'Ul. Mihovila Klaića 4, 23000 Zadar',
        area: 'Zadar',
        position: [44.1158, 15.2263],
        photo: photos.zadarSunset,
      },
      category: 'Hotel',
      mode: 'recorded',
      payout: 2900,
      traveller: { firstName: 'Noah', lastName: 'Fischer' },
      doubt: 'Is the rooftop terrace as private as the photos make it look?',
      brief: 'Show the rooftop terrace, what the neighbours can see, and the stairs up to it.',
      shots: shots('Rooftop terrace, slow pan', 'View from the neighbouring windows', 'Stairs up to the terrace'),
      deadline: inDays(-1, 18),
      postedAt: minutesAgo(60 * 30),
    },
    status: 'awaiting',
    acceptedAt: minutesAgo(60 * 29),
    arrivedAt: inDays(-1, 16, 50),
    video: { seconds: 73, photo: photos.zadarSunset, at: inDays(-1, 17, 9), shown: ['s1', 's2', 's3'] },
    deliveredAt: inDays(-1, 17, 20),
  },
  {
    id: 'split-harbor-villa',
    request: {
      id: 'split-harbor-villa',
      place: {
        title: 'Split Harbor Sea-View Villa',
        address: 'Obala Lazareta 3, 21000 Split',
        area: 'Split',
        position: [43.5068, 16.4433],
        photo: photos.splitHarbour,
      },
      category: 'Listing',
      mode: 'recorded',
      payout: 4900,
      traveller: { firstName: 'Hannah', lastName: 'Berg' },
      doubt: 'How loud is the ferry port at night?',
      brief: 'Record the view, then the harbour noise from the bedroom with the windows open after 22:00.',
      shots: shots('The sea view', 'Bedroom, windows open', 'Harbour noise after 22:00'),
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
      comment: 'Honest and clear. The ferry horns settled it: we booked somewhere else. Thank you, Luka!',
      at: on(2026, 3, 16, 8, 5),
    },
  },
  {
    id: 'trogir-old-town',
    request: {
      id: 'trogir-old-town',
      place: {
        title: 'Trogir Old Town Studio',
        address: 'Gradska ul. 9, 21220 Trogir',
        area: 'Trogir',
        position: [43.5167, 16.2511],
        photo: photos.splitHarbour,
      },
      category: 'Listing',
      mode: 'recorded',
      payout: 2900,
      traveller: { firstName: 'Clara', lastName: 'Dubois' },
      doubt: 'Is the studio really on a quiet street, or right on the busy promenade?',
      brief: 'Film the walk from the bridge to the door, the street outside, and the bedroom window at night.',
      shots: shots('Walk from the bridge to the door', 'The street outside', 'Bedroom window, evening'),
      deadline: inDays(-2, 20),
      postedAt: inDays(-3, 10),
    },
    status: 'completed',
    acceptedAt: inDays(-3, 10, 30),
    arrivedAt: inDays(-2, 18, 40),
    video: { seconds: 96, photo: photos.splitHarbour, at: inDays(-2, 18, 55), shown: ['s1', 's2', 's3'] },
    deliveredAt: inDays(-2, 19, 5),
    releasedAt: inDays(-1, 9, 15),
    rating: {
      stars: 5,
      comment: 'Quiet street, exactly as you showed it. Booked it straight away.',
      at: inDays(-1, 9, 15),
    },
  },
  {
    id: 'makarska-beach',
    request: {
      id: 'makarska-beach',
      place: {
        title: 'Makarska Beach Apartment',
        address: 'Obala kralja Tomislava 8, 21300 Makarska',
        area: 'Makarska',
        position: [43.2969, 17.0178],
        photo: photos.hvarHarbour,
      },
      category: 'Beach',
      mode: 'live',
      payout: 3900,
      traveller: { firstName: 'Mia', lastName: 'Novak' },
      doubt: 'How many steps down to the beach? We travel with my dad, who uses a cane.',
      brief: 'Walk live from the front door to the sand so we can count the steps.',
      shots: shots('Front door', 'Every step down to the beach', 'The beach entrance'),
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
    id: 'plitvice-cabin',
    request: {
      id: 'plitvice-cabin',
      place: {
        title: 'Plitvice Forest Cabin Retreat',
        address: 'Mukinje 21, 53231 Plitvička Jezera',
        area: 'Plitvice',
        position: [44.8806, 15.6196],
        photo: photos.plitvice,
      },
      category: 'Listing',
      mode: 'live',
      payout: 3900,
      traveller: { firstName: 'Lucas', lastName: 'Martin' },
      doubt: 'Can we walk to the lakes, or do we need a car?',
      brief: 'Walk the route from the cabin to entrance 2 live, so we can see if it works with kids.',
      shots: shots('The cabin outside', 'The path to the entrance', 'Distance markers'),
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
