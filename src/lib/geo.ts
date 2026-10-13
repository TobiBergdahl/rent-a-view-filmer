import type { LatLng } from '@/types'

// Same maths as the web app's live filmer position
export function metresBetween([lat1, lng1]: LatLng, [lat2, lng2]: LatLng) {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180
  const a =
    Math.sin(toRad(lat2 - lat1) / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(toRad(lng2 - lng1) / 2) ** 2
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** A point roughly `metres` away from `origin`, in a random direction */
export function nudge([lat, lng]: LatLng, metres: number): LatLng {
  const angle = Math.random() * Math.PI * 2
  const dLat = (metres * Math.cos(angle)) / 111320
  const dLng = (metres * Math.sin(angle)) / (111320 * Math.cos((lat * Math.PI) / 180))
  return [lat + dLat, lng + dLng]
}

/** "350 m", "1.2 km", "148 km" */
export function distanceLabel(metres: number) {
  if (metres < 1000) return `${Math.max(10, Math.round(metres / 10) * 10)} m`
  if (metres < 10_000) return `${(metres / 1000).toFixed(1)} km`
  return `${Math.round(metres / 1000)} km`
}

/** "42.6408° N, 18.1094° E" for verification stamps */
export const coordinates = ([lat, lng]: LatLng) =>
  `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`

/** Counted as on location within this many metres of the pin (as on the web) */
export const ON_LOCATION_RADIUS = 50
