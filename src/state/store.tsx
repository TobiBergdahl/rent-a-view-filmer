// All app state, in memory. Reloading the app resets it, like the web prototype.
// Production: replace the action bodies with API calls; screens only use
// the hook below, so they shouldn't need to change.
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

import { initialJobs, openRequests } from '@/data/seed'
import { now } from '@/lib/time'
import type { Filmer, Job, Request, Video } from '@/types'

// `draft` is the new filmer while they go through onboarding (not signed in yet)
type State = { filmer: Filmer | null; draft: Filmer | null; requests: Request[]; jobs: Job[] }

const thankYous = [
  'Exactly what I needed to see. Clear, calm and honest.',
  'Showed me the things the listing photos left out. Thank you!',
  'Quick, friendly and very thorough.',
]

function useStoreValue() {
  const [state, setState] = useState<State>({ filmer: null, draft: null, requests: openRequests, jobs: initialJobs })

  const updateJob = (id: string, change: (job: Job) => Job) =>
    setState((s) => ({ ...s, jobs: s.jobs.map((job) => (job.id === id ? change(job) : job)) }))

  const actions = useMemo(
    () => ({
      signIn: (filmer: Filmer) => setState((s) => ({ ...s, filmer })),
      signOut: () => setState((s) => ({ ...s, filmer: null })),

      // Onboarding: account → profile details → payout → done
      startDraft: (draft: Filmer) => setState((s) => ({ ...s, draft })),
      updateDraft: (patch: Partial<Filmer>) =>
        setState((s) => (s.draft ? { ...s, draft: { ...s.draft, ...patch } } : s)),
      /** Signs the new filmer in; the root layout then shows the app */
      finishOnboarding: () => setState((s) => (s.draft ? { ...s, filmer: s.draft, draft: null } : s)),
      updateFilmer: (patch: Partial<Filmer>) =>
        setState((s) => (s.filmer ? { ...s, filmer: { ...s.filmer, ...patch } } : s)),

      /** Accepting turns an open request into a Scheduled job */
      accept: (requestId: string) =>
        setState((s) => {
          const request = s.requests.find((r) => r.id === requestId)
          if (!request) return s
          const job: Job = { id: request.id, request, status: 'scheduled', acceptedAt: now() }
          return { ...s, requests: s.requests.filter((r) => r.id !== requestId), jobs: [job, ...s.jobs] }
        }),
      /** Declined requests go back to the pool for other filmers */
      decline: (requestId: string) =>
        setState((s) => ({ ...s, requests: s.requests.filter((r) => r.id !== requestId) })),

      arrive: (jobId: string) => updateJob(jobId, (job) => ({ ...job, arrivedAt: now() })),
      /** One take per job: a new recording replaces the previous one */
      saveVideo: (jobId: string, video: Video) => updateJob(jobId, (job) => ({ ...job, video })),
      discardVideo: (jobId: string) => updateJob(jobId, (job) => ({ ...job, video: undefined })),
      /** Recorded: uploaded, waiting for the traveller to accept */
      deliver: (jobId: string) =>
        updateJob(jobId, (job) => ({ ...job, status: 'awaiting', deliveredAt: now() })),

      startCall: (jobId: string) =>
        updateJob(jobId, (job) => ({
          ...job,
          status: 'live',
          arrivedAt: job.arrivedAt ?? now(),
          callStartedAt: job.callStartedAt ?? now(),
        })),
      endCall: (jobId: string, seconds: number) =>
        updateJob(jobId, (job) => ({ ...job, status: 'awaiting', callSeconds: seconds, deliveredAt: now() })),

      /** Prototype only: what happens when the traveller accepts and rates on the web */
      travellerAccepts: (jobId: string) =>
        setState((s) => {
          const stars = 5
          const jobs = s.jobs.map((job) =>
            job.id === jobId
              ? {
                  ...job,
                  status: 'completed' as const,
                  releasedAt: now(),
                  rating: { stars, comment: thankYous[job.request.place.title.length % thankYous.length], at: now() },
                }
              : job,
          )
          const f = s.filmer
          const filmer = f && {
            ...f,
            ratingAverage: (f.ratingAverage * f.ratingCount + stars) / (f.ratingCount + 1),
            ratingCount: f.ratingCount + 1,
          }
          return { ...s, jobs, filmer }
        }),
    }),
    [],
  )

  return { ...state, ...actions }
}

type Store = ReturnType<typeof useStoreValue>
const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useStoreValue()
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be used inside StoreProvider')
  return store
}

export function useJob(id: string | undefined) {
  return useStore().jobs.find((job) => job.id === id)
}

// Status labels shared with the web dashboard
export const statusLabel: Record<Job['status'], string> = {
  scheduled: 'Scheduled',
  live: 'Live now',
  awaiting: 'Awaiting acceptance',
  completed: 'Completed',
}

/** Money the traveller has paid that sits in escrow until they accept */
export const inEscrow = (job: Job) => job.status !== 'completed'
