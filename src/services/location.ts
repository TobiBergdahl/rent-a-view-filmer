// Simulated GPS. The filmer wanders a few metres around the pin, exactly like
// the web app's useSimulatedFilmer, so both apps show the same thing.
// Production: expo-location watchPositionAsync, then publish each fix to the
// API so the traveler's map updates (and verify arrival server side).
import { useEffect, useState } from 'react'

import { nudge } from '@/lib/geo'
import type { LatLng } from '@/types'

export type Fix = { position: LatLng; accuracy: number; at: number }

export function useFilmerPosition(target: LatLng, enabled: boolean, wanderMetres = 18): Fix {
  const [fix, setFix] = useState<Fix>(() => ({
    position: nudge(target, 14),
    accuracy: 5,
    at: Date.now(),
  }))
  useEffect(() => {
    if (!enabled) return
    const id = setInterval(() => {
      setFix({
        position: nudge(target, 6 + Math.random() * wanderMetres),
        accuracy: 3 + Math.round(Math.random() * 5),
        at: Date.now(),
      })
    }, 5000)
    return () => clearInterval(id)
  }, [enabled, target, wanderMetres])
  return fix
}

/** One-off fix used for the arrival check. Lands within the on-location radius. */
export async function currentPosition(target: LatLng): Promise<Fix> {
  await new Promise((resolve) => setTimeout(resolve, 1200))
  return { position: nudge(target, 8 + Math.random() * 12), accuracy: 4, at: Date.now() }
}
