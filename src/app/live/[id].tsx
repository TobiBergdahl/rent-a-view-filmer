// Live job: wait for the exact minute, then a video call with the traveler
// while sharing GPS. Production: a live-video provider (e.g. LiveKit, Daily,
// Agora) and publishing the GPS fixes to the API for the traveler's map.
import { BlurView } from 'expo-blur'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ShotList } from '@/components/brief'
import { CameraControl, LocationCheck, PulseDot, Viewfinder } from '@/components/camera'
import { Sheet } from '@/components/layout'
import { Avatar, Button, Icon, PrototypeTag, RoundButton, ScreenStatusBar, Text, TextButton, type SymbolName } from '@/components/ui'
import { liveStreet } from '@/data/photos'
import { clock, duration, useNow } from '@/lib/time'
import { useFilmerPosition } from '@/services/location'
import { useJob, useStore } from '@/state/store'
import { colors, fonts, radius, space } from '@/theme'

export default function Live() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const job = useJob(id)
  const { startCall } = useStore()
  const now = useNow(500)
  const [skipped, setSkipped] = useState(false)

  const due = !!job && (job.status === 'live' || skipped || now >= job.request.start!)
  useEffect(() => {
    if (job && due && job.status === 'scheduled') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      startCall(job.id)
    }
  }, [due, job, startCall])

  if (job?.status === 'scheduled') return <Lobby jobId={job.id} now={now} onSkip={() => setSkipped(true)} />
  if (job?.status === 'live') return <Call jobId={job.id} now={now} />
  // Call ended: on its way to the done screen
  return <View style={{ backgroundColor: colors.camera, flex: 1 }} />
}

function Lobby({ jobId, now, onSkip }: { jobId: string; now: number; onSkip: () => void }) {
  const insets = useSafeAreaInsets()
  const job = useJob(jobId)!
  const r = job.request
  const t = r.traveller
  const left = (r.start! - now) / 1000
  return (
    <View style={{ backgroundColor: colors.camera, flex: 1 }}>
      <ScreenStatusBar style="light" />
      <Viewfinder photo={r.place.photo} style={{ bottom: 0, left: 0, opacity: 0.45, position: 'absolute', right: 0, top: 0 }} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        locations={[0.45, 1]}
        style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}
      />
      <View style={{ flex: 1, paddingBottom: insets.bottom + space.base, paddingTop: insets.top + space.sm }}>
        <View style={{ paddingHorizontal: 20 }}>
          <RoundButton dark icon="xmark" label="Leave" onPress={() => router.back()} />
        </View>
        <View style={{ alignItems: 'center', gap: space.sm, paddingBottom: space.lg }}>
          <Avatar name={t} photo={t.photo} size={72} />
          <Text variant="lead" color={colors.cream}>
            {t.firstName} joins at {clock(r.start!)}
          </Text>
          <Text variant="hero" color={colors.cream} style={{ fontSize: 72, fontVariant: ['tabular-nums'], lineHeight: 76 }}>
            {duration(left)}
          </Text>
          <Text variant="caption" color="rgba(255,255,255,0.75)" style={{ textAlign: 'center' }}>
            {r.minutes} min call · starts on the exact minute
          </Text>
        </View>

        {/* The brief, to read while waiting: dark glass with light text */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}>
          <BlurView
            intensity={40}
            tint="dark"
            style={{ backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: radius.md, gap: space.lg, overflow: 'hidden', padding: 20 }}>
            <View style={{ gap: space.sm }}>
              <Text variant="captionStrong" color="rgba(255,255,255,0.7)">
                {t.firstName} wants to know
              </Text>
              <Text variant="headline" color={colors.cream} style={{ fontFamily: fonts.serifItalic }}>
                “{r.doubt}”
              </Text>
            </View>
            <View style={{ gap: space.sm }}>
              <Text variant="label" color={colors.white}>
                The brief
              </Text>
              <Text variant="bodySmall" color="rgba(255,255,255,0.85)">
                {r.brief}
              </Text>
            </View>
            <View style={{ gap: space.sm }}>
              <Text variant="label" color={colors.white}>
                Show during the call
              </Text>
              {r.shots.map((shot, i) => (
                <View key={shot.id} style={{ alignItems: 'center', flexDirection: 'row', gap: space.md }}>
                  <View
                    style={{
                      alignItems: 'center',
                      borderColor: 'rgba(255,255,255,0.4)',
                      borderRadius: 6,
                      borderWidth: 1,
                      height: 24,
                      justifyContent: 'center',
                      width: 24,
                    }}>
                    <Text variant="captionStrong" color={colors.white}>
                      {i + 1}
                    </Text>
                  </View>
                  <Text variant="bodySmall" color={colors.white} style={{ flex: 1 }}>
                    {shot.label}
                  </Text>
                </View>
              ))}
            </View>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', height: 1 }} />
            <View style={{ gap: space.sm }}>
              <Row icon="location.fill" text={`Location sharing on. ${t.firstName} sees you on a map.`} />
              <Row icon="mic.fill" text="Mic on" />
            </View>
          </BlurView>
        </ScrollView>

        <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.sm, justifyContent: 'center', paddingTop: space.md }}>
          <PrototypeTag />
          <TextButton color={colors.white} onPress={onSkip}>
            Skip the wait
          </TextButton>
        </View>
      </View>
    </View>
  )
}

function Row({ icon, text }: { icon: SymbolName; text: string }) {
  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.md }}>
      <Icon name={icon} size={16} color={colors.white} />
      <Text variant="bodySmall" color={colors.white} style={{ flex: 1 }}>
        {text}
      </Text>
    </View>
  )
}

function Call({ jobId, now }: { jobId: string; now: number }) {
  const insets = useSafeAreaInsets()
  const job = useJob(jobId)!
  const { endCall } = useStore()
  const r = job.request
  const t = r.traveller
  const [muted, setMuted] = useState(false)
  const [sheet, setSheet] = useState<'brief' | 'end' | null>(null)
  const [shown, setShown] = useState<Set<string>>(new Set())
  const [speaking, setSpeaking] = useState(false)
  // Location is always shared during a live call: it's part of the proof
  const gps = useFilmerPosition(r.place.position, true)

  const elapsed = (now - (job.callStartedAt ?? now)) / 1000
  const total = r.minutes! * 60
  const over = elapsed > total
  const nearlyDone = !over && total - elapsed < 60

  // A voice call, like FaceTime: the traveler talks and their tile lights up
  // while they speak (simulated). Production: the live-video provider's
  // active-speaker events.
  useEffect(() => {
    if (!r.talk) return
    let timer: ReturnType<typeof setTimeout>
    const toggle = (on: boolean) => {
      setSpeaking(on)
      timer = setTimeout(() => toggle(!on), on ? 2500 + Math.random() * 3000 : 1500 + Math.random() * 4000)
    }
    timer = setTimeout(() => toggle(true), 2000)
    return () => clearTimeout(timer)
  }, [r.talk])

  const end = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    endCall(job.id, Math.round(elapsed))
    setSheet(null)
    router.replace(`/done/${job.id}`)
  }

  return (
    <View style={{ backgroundColor: colors.camera, flex: 1 }}>
      <ScreenStatusBar style="light" />
      {/* Same street-level frame the traveler sees on the web */}
      <Viewfinder
        photo={r.id === 'banje-beachfront' ? liveStreet : r.place.photo}
        style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'transparent', 'transparent', 'rgba(0,0,0,0.6)']}
        locations={[0, 0.2, 0.6, 1]}
        style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}
      />

      <View style={{ flex: 1, paddingBottom: insets.bottom, paddingHorizontal: 16, paddingTop: insets.top + space.sm }}>
        {/* Top bar */}
        <View style={{ alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ gap: space.sm }}>
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.sm }}>
              <View style={{ alignItems: 'center', backgroundColor: colors.live, borderRadius: radius.pill, flexDirection: 'row', gap: 6, paddingHorizontal: 10, paddingVertical: 4 }}>
                <PulseDot color={colors.white} size={7} />
                <Text variant="captionStrong" color={colors.white}>
                  Live
                </Text>
              </View>
              <Text variant="label" color={over || nearlyDone ? colors.onDarkWarning : colors.white} style={{ fontVariant: ['tabular-nums'] }}>
                {duration(elapsed)} / {duration(total)}
              </Text>
            </View>
            {(nearlyDone || over) && (
              <Text variant="captionStrong" color={colors.onDarkWarning}>
                {over ? 'Over time. Wrap up when you’re ready.' : 'One minute left'}
              </Text>
            )}
          </View>

          {/* The traveler, picture in picture */}
          <View
            style={{
              backgroundColor: colors.cameraTile,
              borderColor: speaking ? colors.white : 'rgba(255,255,255,0.6)',
              borderRadius: radius.sm,
              borderWidth: speaking ? 3 : 1,
              height: 132,
              overflow: 'hidden',
              width: 96,
            }}>
            <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
              <Avatar name={t} photo={t.photo} size={52} />
            </View>
            <View style={{ alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.45)', bottom: 0, flexDirection: 'row', gap: 4, left: 0, paddingHorizontal: 8, paddingVertical: 4, position: 'absolute', right: 0 }}>
              <Icon
                name={!r.talk ? 'mic.slash.fill' : speaking ? 'waveform' : 'mic.fill'}
                size={10}
                color={colors.white}
              />
              <Text variant="captionStrong" color={colors.white}>
                {t.firstName}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }} />


        {/* Controls */}
        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
          <CameraControl icon={muted ? 'mic.slash.fill' : 'mic.fill'} label={muted ? 'Unmute' : 'Mute'} active={muted} onPress={() => setMuted(!muted)} />
          <CameraControl icon="checklist" label="Brief" onPress={() => setSheet('brief')} badge={`${shown.size}/${r.shots.length}`} />
          <CameraControl icon="camera.rotate.fill" label="Flip camera" onPress={() => Haptics.selectionAsync()} />
          <Pressable
            accessibilityLabel="End call"
            accessibilityRole="button"
            onPress={() => setSheet('end')}
            style={({ pressed }) => ({ alignItems: 'center', backgroundColor: colors.live, borderRadius: radius.pill, flexDirection: 'row', gap: 6, height: 52, justifyContent: 'center', paddingHorizontal: 18, transform: [{ scale: pressed ? 0.95 : 1 }] })}>
            <Icon name="phone.down.fill" size={18} color={colors.white} />
            <Text variant="label" color={colors.white}>
              End
            </Text>
          </Pressable>
        </View>
        <View style={{ alignItems: 'center', marginTop: space.md }}>
          <LocationCheck position={gps.position} target={r.place.position} place={r.place.title} />
        </View>
      </View>

      <Sheet visible={sheet === 'brief'} onClose={() => setSheet(null)}>
        <Text variant="headline">Show during the call</Text>
        <Text variant="bodySmall" color={colors.muted}>
          Tap each one once you’ve shown it.
        </Text>
        <ShotList
          request={r}
          captured={shown}
          onToggle={(shotId) =>
            setShown((s) => {
              const next = new Set(s)
              if (next.has(shotId)) next.delete(shotId)
              else next.add(shotId)
              return next
            })
          }
        />
        <Button onPress={() => setSheet(null)}>Back to the call</Button>
      </Sheet>

      <Sheet visible={sheet === 'end'} onClose={() => setSheet(null)}>
        <Text variant="headline">End the call?</Text>
        <Text variant="body" color={colors.body}>
          {`This ends it for you and ${t.firstName}. You get paid when ${t.firstName} accepts, or automatically after 24 hours.`}
        </Text>
        {shown.size < r.shots.length && (
          <Text variant="bodySmall" color={colors.warning}>
            You’ve ticked {shown.size} of {r.shots.length} things from the brief.
          </Text>
        )}
        <Button variant="live" icon="phone.down.fill" onPress={end}>
          End call
        </Button>
        <Button variant="secondary" onPress={() => setSheet(null)}>
          Keep going
        </Button>
      </Sheet>
    </View>
  )
}
