// Fake auth, like the web app: any email and password sign in as Luka.
// Production: swap for the real auth provider shared with the traveler app.
import { luka } from '@/data/seed'
import type { Filmer } from '@/types'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function signIn(email: string, _password: string): Promise<Filmer> {
  await wait(500)
  return { ...luka, email: email.trim() || luka.email }
}

export async function signUp(input: {
  firstName: string
  lastName: string
  email: string
}): Promise<Filmer> {
  await wait(600)
  return {
    ...luka,
    ...input,
    // Dubrovnik only for the proof of concept
    photo: undefined,
    bio: '',
    // New filmers start unverified with no ratings; licence and payout come
    // from the onboarding steps
    verified: false,
    guideLicence: undefined,
    payout: undefined,
    ratingAverage: 0,
    ratingCount: 0,
  }
}
