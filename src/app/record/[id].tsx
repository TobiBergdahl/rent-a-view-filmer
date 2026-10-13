// Recorded job: one continuous, unedited video. The brief opens from a button
// (as in a live call) to tick items off while filming, then review → upload.
import * as Haptics from 'expo-haptics'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ShotList } from '@/components/brief'
import { CameraControl, LocationCheck, PulseDot, Viewfinder } from '@/components/camera'
import { ActionBar, Sheet } from '@/components/layout'
import { Button, Fact, Icon, Notice, RoundButton, ScreenStatusBar, Text } from '@/components/ui'
import { euro } from '@/lib/money'
import { duration, useNow } from '@/lib/time'
import { useFilmerPosition } from '@/services/location'
import { megabytes, uploadVideo } from '@/services/upload'
import { useJob, useStore } from '@/state/store'
import { colors, radius, space } from '@/theme'

export default function Record() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const job = useJob(id)
  // Open on the review if there's already a take
  const [phase, setPhase] = useState<'capture' | 'review'>(job?.video ? 'review' : 'capture')
  if (!job) return null
  return phase === 'capture' ? (
    <Capture jobId={job.id} onDone={() => setPhase('review')} />
  ) : (
    <Review jobId={job.id} onRetake={() => setPhase('capture')} />
  )
}

function Capture({ jobId, onDone }: { jobId: string; onDone: () => void }) {
  const insets = useSafeAreaInsets()
  const job = useJob(jobId)!
  const { saveVideo } = useStore()
  const r = job.request
  const now = useNow(250)
  const gps = useFilmerPosition(r.place.position, true, 6)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [shown, setShown] = useState<Set<string>>(new Set())
  const [sheet, setSheet] = useState(false)
  const recording = startedAt !== null
  const elapsed = recording ? (now - startedAt) / 1000 : 0

  const toggle = () => {
    if (!recording) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setShown(new Set())
      setStartedAt(now)
      return
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    saveVideo(job.id, { seconds: Math.max(1, Math.round(elapsed)), photo: r.place.photo ?? '', at: now, shown: [...shown] })
    setStartedAt(null)
    onDone()
  }

  const tick = (shotId: string) => {
    Haptics.selectionAsync()
    setShown((s) => {
      const next = new Set(s)
      if (next.has(shotId)) next.delete(shotId)
      else next.add(shotId)
      return next
    })
  }

  return (
    <View style={{ backgroundColor: colors.camera, flex: 1 }}>
      <ScreenStatusBar style="light" />
      <Viewfinder photo={r.place.photo} style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }} />
      <LinearGradient
        colors={['rgba(0,0,0,0.35)', 'transparent', 'transparent', 'rgba(0,0,0,0.6)']}
        locations={[0, 0.18, 0.45, 1]}
        style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}
      />

      {/* Top: close and the REC timer */}
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: insets.top + space.sm,
        }}>
        <RoundButton dark icon="xmark" label="Close camera" onPress={() => router.back()} />
        <View
          style={{
            alignItems: 'center',
            backgroundColor: recording ? colors.live : 'rgba(0,0,0,0.42)',
            borderRadius: radius.pill,
            flexDirection: 'row',
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}>
          {recording ? (
            <PulseDot color={colors.white} />
          ) : (
            <View style={{ backgroundColor: colors.live, borderRadius: 4, height: 8, width: 8 }} />
          )}
          <Text variant="label" color={colors.white} style={{ fontVariant: ['tabular-nums'] }}>
            {recording ? `REC ${duration(elapsed)}` : 'One take, unedited'}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={{ flex: 1 }} />

      {/* Brief · record / stop · flip, then where you are */}
      <View style={{ gap: space.md, paddingBottom: insets.bottom, paddingHorizontal: 28 }}>
      <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
        <CameraControl icon="checklist" label="Brief" onPress={() => setSheet(true)} badge={`${shown.size}/${r.shots.length}`} />
        <Pressable
          accessibilityLabel={recording ? 'Stop recording' : 'Start recording'}
          accessibilityRole="button"
          onPress={toggle}
          style={{
            alignItems: 'center',
            borderColor: colors.white,
            borderRadius: 42,
            borderWidth: 4,
            height: 84,
            justifyContent: 'center',
            width: 84,
          }}>
          <View
            style={{
              backgroundColor: colors.live,
              borderRadius: recording ? 8 : 32,
              height: recording ? 32 : 64,
              width: recording ? 32 : 64,
            }}
          />
        </Pressable>
        <CameraControl icon="camera.rotate.fill" label="Flip camera" onPress={() => Haptics.selectionAsync()} />
      </View>
      <View style={{ alignItems: 'center' }}>
        <LocationCheck position={gps.position} target={r.place.position} place={r.place.title} />
      </View>
      </View>

      <Sheet visible={sheet} onClose={() => setSheet(false)}>
        <Text variant="headline">Show in the video</Text>
        <Text variant="bodySmall" color={colors.muted}>
          Tap each one once you’ve filmed it.
        </Text>
        <ShotList request={r} captured={shown} onToggle={tick} />
        <Button onPress={() => setSheet(false)}>{recording ? 'Back to filming' : 'Done'}</Button>
      </Sheet>
    </View>
  )
}

function Review({ jobId, onRetake }: { jobId: string; onRetake: () => void }) {
  const insets = useSafeAreaInsets()
  const job = useJob(jobId)!
  const { deliver, discardVideo } = useStore()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const r = job.request
  const name = r.traveller.firstName
  const video = job.video
  if (!video) return null
  const shown = new Set(video.shown)
  const missing = r.shots.filter((s) => !shown.has(s.id))

  const upload = async () => {
    setUploading(true)
    await uploadVideo(video, setProgress)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    deliver(job.id)
    router.replace(`/done/${job.id}`)
  }

  return (
    <View style={{ backgroundColor: colors.page, flex: 1 }}>
      <ScreenStatusBar style="dark" />
      <ScrollView contentContainerStyle={{ gap: space.lg, padding: 20, paddingTop: insets.top + space.sm }}>
        {!uploading && <RoundButton icon="xmark" label="Close" onPress={() => router.back()} />}
        <View style={{ gap: space.sm }}>
          <Text variant="display">Review your video</Text>
          <Text variant="lead">Raw and unedited, exactly as you filmed it.</Text>
        </View>

        {/* The take */}
        <View style={{ aspectRatio: 3 / 4, borderRadius: radius.md, overflow: 'hidden' }}>
          <Image source={video.photo} style={{ flex: 1 }} contentFit="cover" />
          <View style={{ alignItems: 'center', bottom: 0, justifyContent: 'center', left: 0, position: 'absolute', right: 0, top: 0 }}>
            <Icon name="play.circle.fill" size={56} color={colors.white} />
          </View>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: radius.pill,
              bottom: 12,
              paddingHorizontal: 10,
              paddingVertical: 4,
              position: 'absolute',
              right: 12,
            }}>
            <Text variant="captionStrong" color={colors.white} style={{ fontVariant: ['tabular-nums'] }}>
              {duration(video.seconds)}
            </Text>
          </View>
        </View>

        <View style={{ gap: space.md }}>
          <Text variant="section">What you showed</Text>
          <ShotList request={r} captured={shown} />
        </View>

        {missing.length > 0 && (
          <Notice tone="warning" icon="exclamationmark.triangle">
            {`You didn’t tick ${missing.length === 1 ? 'one item' : `${missing.length} items`} from ${name}’s brief. You can still send it, or retake.`}
          </Notice>
        )}

        <View style={{ gap: space.sm }}>
          <Fact label="Length" value={duration(video.seconds)} />
          <Fact label="File" value={`Raw 1080p · ${megabytes(video)} MB`} />
          <Fact label="Payout" value={`${euro(r.payout)}, after ${name} accepts`} />
        </View>
      </ScrollView>

      <ActionBar>
        {uploading ? (
          <View style={{ gap: space.sm, paddingVertical: space.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant="label">Uploading to {name}…</Text>
              <Text variant="label" style={{ fontVariant: ['tabular-nums'] }}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
            <View style={{ backgroundColor: colors.hairline, borderRadius: 3, height: 6, overflow: 'hidden' }}>
              <View style={{ backgroundColor: colors.ink, height: 6, width: `${progress * 100}%` }} />
            </View>
            <Text variant="caption" color={colors.muted}>
              Keep the app open until it’s done.
            </Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            <Button
              variant="secondary"
              icon="arrow.counterclockwise"
              onPress={() => {
                discardVideo(job.id)
                onRetake()
              }}
              style={{ paddingHorizontal: 20 }}>
              Retake
            </Button>
            <Button icon="arrow.up.circle" onPress={upload} style={{ flex: 1 }}>
              Upload to {name}
            </Button>
          </View>
        )}
      </ActionBar>
    </View>
  )
}
