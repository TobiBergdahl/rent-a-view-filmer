// Placeholder photos from Unsplash (free licence), hotlinked with the same IDs
// as the web prototype. Download and self-host, or use the client's own
// photography, before production.
const photo = (id: string, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=75`
const portrait = (id: string, size = 240) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=${size}&h=${size}&q=80`

export const photos = {
  dubrovnikWalls: photo('1414862625453-d87604a607e4'),
  hvarHarbour: photo('1605703296515-515167084932'),
  zagrebStreet: photo('1772190576978-b43f586efbcb'),
  splitHarbour: photo('1555990538-c48ab0a194b5'),
  zadarSunset: photo('1725456248098-cc250e04a4b9'),
  plitvice: photo('1595171250522-ae1c060c288d'),
  // The web app's live-call frame: sea view from a balcony
  balconyView: photo('1693035646984-d7bdde95317e'),
}

export const portraits = {
  luka: portrait('1705645930353-0e335311ef20'),
  ana: portrait('1669844444850-5acd7e8c71c5'),
}
