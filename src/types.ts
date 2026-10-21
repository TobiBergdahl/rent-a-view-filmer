// Shapes shared with the traveler web app (~/Development/rent-a-view/src/App.tsx).
// Copied, not imported. Move to a shared package once there is an API.
export type LatLng = [number, number]
export type Place = { title: string; address: string; position: LatLng; photo?: string }
export type BookingMode = 'live' | 'recorded'
export type User = { firstName: string; lastName: string; email: string; photo?: string }

// Filmer app only
export type Category = 'Beach' | 'Neighbourhood' | 'Hotel' | 'Listing'

// Dubrovnik only for the proof of concept
export type AreaId = 'dubrovnik'

export type Traveler = { firstName: string; lastName: string; photo?: string }

export type Shot = { id: string; label: string }

/** An open booking a traveler has paid for, waiting for a filmer. */
export type Request = {
  id: string
  place: Place & { area: string }
  category: Category
  mode: BookingMode
  /** Walker payout in euro cents (about 79% of the customer price), paid when the traveler accepts */
  payout: number
  traveller: Traveler
  /** The traveler's doubt, in their words. The job is to resolve it honestly. */
  doubt: string
  brief: string
  shots: Shot[]
  /** Live: exact start (ms) and length in minutes (1–60) */
  start?: number
  minutes?: number
  /** Live: the traveler wants to talk and guide the filmer */
  talk?: boolean
  /** Recorded: deliver by (ms) */
  deadline?: number
  postedAt: number
}

/**
 * Mirrors the web app's booking statuses so both apps tell the same story:
 * Scheduled → Live now (live only) → Awaiting acceptance → Completed (accepted,
 * payment released) → rated.
 */
export type JobStatus = 'scheduled' | 'live' | 'awaiting' | 'completed'

/**
 * A recorded job is one continuous, unedited video. `shown` holds the brief
 * items the filmer ticked off while filming.
 */
export type Video = { seconds: number; photo: string; at: number; shown: string[] }

export type Rating = { stars: number; comment: string; at: number }

export type Job = {
  id: string
  request: Request
  status: JobStatus
  acceptedAt: number
  /** Recorded: the filmer confirmed they are at the pin */
  arrivedAt?: number
  video?: Video
  deliveredAt?: number
  /** Live: when the call started, and how long it lasted */
  callStartedAt?: number
  callSeconds?: number
  releasedAt?: number
  rating?: Rating
}

/**
 * A licensed tour guide's licence. Once verified, travelers see a
 * "Licensed tour guide" badge on the filmer (the web app should show it too).
 */
export type GuideLicence = { status: 'pending' | 'verified'; fileName: string; submittedAt: number }

export type PayoutMethod = 'bank' | 'paypal' | 'wise'

/** Display only in the prototype: no payment provider is connected */
export type Payout = { method: PayoutMethod; provider: string; detail: string }

export type Filmer = User & {
  area: AreaId
  bio: string
  verified: boolean
  ratingAverage: number
  ratingCount: number
  guideLicence?: GuideLicence
  payout?: Payout
}
