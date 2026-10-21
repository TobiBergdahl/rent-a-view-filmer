// Simulated upload of the recorded video.
// Production: resumable uploads (e.g. S3 multipart or Mux direct upload) of the
// raw files with their GPS and time metadata, then notify the traveler.
import type { Video } from '@/types'

// Rough size of 1080p60 footage, for display only
export const megabytes = (video: Video) => Math.round(video.seconds * 1.6)

export function uploadVideo(video: Video, onProgress: (fraction: number) => void) {
  const total = Math.min(5000, Math.max(2500, video.seconds * 30))
  const started = Date.now()
  return new Promise<void>((resolve) => {
    const id = setInterval(() => {
      const fraction = Math.min(1, (Date.now() - started) / total)
      onProgress(fraction)
      if (fraction >= 1) {
        clearInterval(id)
        resolve()
      }
    }, 80)
  })
}
