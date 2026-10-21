// Placeholder photos from Unsplash (free licence), hotlinked with the same IDs
// as the web prototype. Download and self-host, or use the client's own
// photography, before production.
const photo = (id: string, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=75`
const portrait = (id: string, size = 240) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=${size}&h=${size}&q=80`

// Dubrovnik only, for the proof of concept. Places, never people in focus.
// Same set as the web, except Lapad Bay (the web still shows a couple there)
export const photos = {
  dubrovnikWalls: photo('1414862625453-d87604a607e4'),
  beachCove: photo('1565784623727-8cebf4712b2d'),
  oldTownAlley: photo('1632154613912-052a12edc114'),
  pileBay: photo('1610104052927-ed67e7faefc3'),
  oldPort: photo('1555990794-6d00be0d6f95'),
  srdView: photo('1690208850921-7a26f15a32b6'),
  lapadBay: photo('1654078646495-cd9d771fc0c3'),
  stoneHouse: photo('1691310939842-bcec99e88aa4'),
  marinaBoats: photo('1596658817340-5a9306887ef0'),
}

// Street-level frame for the live call, as on the web. Always filmed from
// public space; replace with real walker footage.
export const liveStreet = require('@/assets/images/live-street.jpg')

export const portraits = {
  luka: portrait('1705645930353-0e335311ef20'),
  ana: portrait('1669844444850-5acd7e8c71c5'),
}
