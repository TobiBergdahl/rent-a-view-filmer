import { useEffect, useState } from 'react'

// Filmers work 08:00–20:00 Croatian time.
export const ZONE = 'Europe/Zagreb'
export const WORK_FROM = 8
export const WORK_TO = 20

const MINUTE = 60_000

// Minutes Zagreb is ahead of UTC at a given instant (CET +60, CEST +120)
function zagrebOffset(at: number) {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: ZONE,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).formatToParts(at)
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
    const local = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'))
    return Math.round((local - Math.floor(at / MINUTE) * MINUTE) / MINUTE)
  } catch {
    const month = new Date(at).getUTCMonth()
    return month > 2 && month < 10 ? 120 : 60
  }
}

/** The instant of a wall-clock time in Zagreb, `dayOffset` days from `base` */
export function zagrebAt(base: number, dayOffset: number, hour: number, minute = 0) {
  const shifted = new Date(base + zagrebOffset(base) * MINUTE)
  const guess = Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate() + dayOffset,
    hour,
    minute,
  )
  return guess - zagrebOffset(guess) * MINUTE
}

// Prototype clock. Every launch starts at 10:42 Croatian time today and then
// runs in real time, so the demo always lands inside working hours and the
// Banje live call starts a few minutes in. Replace with Date.now() for real use.
const launchedAt = Date.now()
const DEMO_START = zagrebAt(launchedAt, 0, 10, 42)
export const now = () => DEMO_START + (Date.now() - launchedAt)
export const demoStart = DEMO_START

/** Re-renders every `ms` and returns the prototype clock */
export function useNow(ms = 1000) {
  const [value, setValue] = useState(now)
  useEffect(() => {
    const id = setInterval(() => setValue(now()), ms)
    return () => clearInterval(id)
  }, [ms])
  return value
}

const format = (at: number, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: ZONE, ...options }).format(at)

/** "10:45" */
export const clock = (at: number) => format(at, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })

const dayKey = (at: number) => format(at, { year: 'numeric', month: '2-digit', day: '2-digit' })

/** "Today", "Tomorrow", "Yesterday" or "Thu 16 Oct" (adds the year if not this year) */
export function day(at: number, reference = now()) {
  const key = dayKey(at)
  if (key === dayKey(reference)) return 'Today'
  if (key === dayKey(reference + 86_400_000)) return 'Tomorrow'
  if (key === dayKey(reference - 86_400_000)) return 'Yesterday'
  const sameYear = format(at, { year: 'numeric' }) === format(reference, { year: 'numeric' })
  return format(at, {
    weekday: sameYear ? 'short' : undefined,
    day: 'numeric',
    month: 'short',
    year: sameYear ? undefined : 'numeric',
  })
}

/** day() for mid-sentence use: "today", "tomorrow", but "Thu 16 Oct" */
export function daySentence(at: number, reference = now()) {
  const text = day(at, reference)
  return ['Today', 'Tomorrow', 'Yesterday'].includes(text) ? text.toLowerCase() : `on ${text}`
}

/** "Today, 10:45" */
export const dayClock = (at: number) => `${day(at)}, ${clock(at)}`

/** "4:05" or "1:02:09" */
export function duration(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = String(s % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`
}

/** "in 12 min", "in 3 h", "2 h ago" */
export function relative(at: number, reference = now()) {
  const minutes = Math.round((at - reference) / MINUTE)
  const abs = Math.abs(minutes)
  const text = abs < 60 ? `${abs} min` : abs < 48 * 60 ? `${Math.round(abs / 60)} h` : `${Math.round(abs / 1440)} days`
  if (abs < 1) return 'now'
  return minutes > 0 ? `in ${text}` : `${text} ago`
}

export const hourLabel = (hour: number) => `${String(hour).padStart(2, '0')}:00`

// --- Periods for earnings (weeks start on Monday, Croatian time) ---

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** 0 = Monday … 6 = Sunday, in Zagreb */
export const weekday = (at: number) => WEEKDAYS.indexOf(format(at, { weekday: 'short' }))

/** Monday 00:00 of the week `at` falls in */
export const startOfWeek = (at: number) => zagrebAt(at, -weekday(at), 0)

/** The 1st of the month `at` falls in, 00:00 */
export const startOfMonth = (at: number) => zagrebAt(at, 1 - Number(format(at, { day: 'numeric' })), 0)

/** Payouts go out every Friday: the next one after `at` (today if it's Friday morning) */
export function nextPayday(at: number) {
  const friday = 4
  const days = (friday - weekday(at) + 7) % 7
  const payday = zagrebAt(at, days, 9)
  return payday > at ? payday : zagrebAt(at, 7, 9)
}
