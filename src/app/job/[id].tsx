import * as Haptics from 'expo-haptics'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Linking, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { BriefBlocks, WhenCard } from '@/components/brief'
import { HeroChrome, HeroPhoto, HeroScroll, useHero } from '@/components/hero'
import { modeLabel } from '@/components/cards'
import { ActionBar, Sheet } from '@/components/layout'
import { PlaceMap } from '@/components/maps'
import {
  BackButton,
  Button,
  Chip,
  Divider,
  Fact,
  Icon,
  Notice,
  PrototypeTag,
  Stars,
  StatusPill,
  Tag,
  Text,
  TextButton,
} from '@/components/ui'
import { areas } from '@/data/seed'
import { coordinates, distanceLabel, metresBetween } from '@/lib/geo'
import { euro } from '@/lib/money'
import { clock, day, dayClock, daySentence, duration, useNow } from '@/lib/time'
import { currentPosition, type Fix } from '@/services/location'
import { useJob, useStore } from '@/state/store'
import { colors, fonts, radius, space } from '@/theme'
import type { Job } from '@/types'

// Live calls can be joined from five minutes before the exact start minute
const JOIN_EARLY_MS = 5 * 60_000
// Travelers have 24 hours to accept before it is accepted automatically
const ACCEPT_WINDOW_MS = 24 * 3600_000

// "6h 37m" until the job is accepted automatically
const waitLeft = (job: Job, now: number) => {
  const left = Math.max(0, (job.deliveredAt ?? now) + ACCEPT_WINDOW_MS - now) / 1000
  return `${Math.floor(left / 3600)}h ${String(Math.floor((left % 3600) / 60)).padStart(2, '0')}m`
}

// Flag a brief before the session starts. Walkers only film from public space.
const problems = [
  'Brief needs inside access',
  'Can’t be there on time',
  'No public access',
  'Wrong address',
  'Not safe to film',
  'Something else',
]

export default function JobDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  const job = useJob(id)
  const { filmer, arrive, travellerAccepts } = useStore()
  const now = useNow()
  const [sheet, setSheet] = useState<'arrive' | 'problem' | 'reported' | null>(null)
  const [fix, setFix] = useState<Fix | null>(null)
  const [problem, setProblem] = useState<string | null>(null)

  const hero = useHero(160)

  if (!job) {
    return (
      <View style={{ flex: 1, gap: space.base, padding: 20, paddingTop: insets.top + space.sm }}>
        <BackButton />
        <Text variant="headline">Job not found</Text>
      </View>
    )
  }

  const r = job.request
  const live = r.mode === 'live'
  const name = r.traveller.firstName
  const target = r.place.position
  const here = job.arrivedAt ? undefined : areas[filmer!.area].centre
  const away = here ? metresBetween(here, target) : 0
  const captured = new Set(job.video?.shown ?? [])
  const startsIn = live ? r.start! - now : 0
  const canJoin = live && startsIn <= JOIN_EARLY_MS

  const checkArrival = async () => {
    setFix(null)
    setSheet('arrive')
    setFix(await currentPosition(target))
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  }

  const navigate = () =>
    Linking.openURL(`http://maps.apple.com/?daddr=${target[0]},${target[1]}&dirflg=w`)

  // --- The one thing to do next, in the action bar ---
  let action: React.ReactNode = null
  if (job.status === 'scheduled' && !live && !job.arrivedAt) {
    action = (
      <>
        <Button icon="location.fill" onPress={checkArrival}>
          I’ve arrived
        </Button>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TextButton color={colors.muted} onPress={() => setSheet('problem')}>
            Can’t do this job?
          </TextButton>
        </View>
      </>
    )
  } else if (job.status === 'scheduled' && !live) {
    action = (
      <Button icon="record.circle" onPress={() => router.push(`/record/${job.id}`)}>
        {job.video ? 'Review your video' : 'Start filming'}
      </Button>
    )
  } else if (job.status === 'scheduled' && live) {
    action = (
      <>
        <Button
          icon="video.fill"
          disabled={!canJoin}
          onPress={() => router.push(`/live/${job.id}`)}>
          {canJoin
            ? startsIn > 0
              ? `Join call · starts in ${duration(startsIn / 1000)}`
              : 'Join call now'
            : `Join opens at ${clock(r.start! - JOIN_EARLY_MS)}`}
        </Button>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TextButton color={colors.muted} onPress={() => setSheet('problem')}>
            Can’t do this job?
          </TextButton>
        </View>
      </>
    )
  } else if (job.status === 'live') {
    action = (
      <Button icon="video.fill" onPress={() => router.push(`/live/${job.id}`)}>
        Return to the call
      </Button>
    )
  }

  // Phases: on the way (where and when first), on site (the brief first),
  // after (payment status first)
  const phase: 'travel' | 'onSite' | 'after' =
    job.status === 'awaiting' || job.status === 'completed'
      ? 'after'
      : job.status === 'live' || job.arrivedAt
        ? 'onSite'
        : 'travel'

  // Live jobs: the Join button already counts down to the start, and the
  // progress shows the time. Recorded jobs keep the card for the deadline.
  const when = live ? null : <WhenCard request={r} raised={phase === 'travel'} />
  // Once delivered, the brief is reference only: start it collapsed
  const brief = (
    <BriefBlocks request={r} captured={live ? undefined : captured} collapsible={job.status === 'awaiting'} />
  )
  const onSiteNote = job.arrivedAt ? (
    <Notice tone="success" icon="checkmark.circle">
      {`On location since ${clock(job.arrivedAt)}. GPS verified.`}
    </Notice>
  ) : null
  // Map, then one row: where it is, how far, and how to get there
  const gettingThere = (
    <View style={{ gap: space.md }}>
      <Text variant="section">Getting there</Text>
      <PlaceMap position={target} delta={0.008} height={200} />
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.md }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="label" numberOfLines={1}>
            {r.place.address}
          </Text>
          {here && (
            <Text variant="caption" color={colors.muted}>
              {distanceLabel(away)} away
            </Text>
          )}
        </View>
        <Button variant="secondary" compact icon="arrow.triangle.turn.up.right.diamond" onPress={navigate}>
          Navigate
        </Button>
      </View>
    </View>
  )

  return (
    <View style={{ flex: 1 }}>
      <HeroPhoto hero={hero} photo={r.place.photo} />
      <HeroScroll hero={hero}>
        <View style={{ gap: space.sm }}>
          <StatusPill status={job.status} />
          <Text variant="display">{r.place.title}</Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Tag icon={live ? 'video.fill' : 'record.circle'}>
              {live ? `Live · ${clock(r.start!)} · ${r.minutes} min` : modeLabel(r)}
            </Tag>
            <Tag>{r.category}</Tag>
          </View>
        </View>

        {/* Ordered by what the filmer needs right now */}
        {phase === 'travel' && (
          <>
            {when}
            {gettingThere}
            {brief}
            <Progress job={job} />
          </>
        )}
        {phase === 'onSite' && (
          <>
            {onSiteNote}
            {brief}
            {when}
            <Progress job={job} />
          </>
        )}
        {phase === 'after' && (
          <>
            <Progress job={job} now={now} />
            {job.status === 'awaiting' && (
              <AwaitingNote
                job={job}
                now={now}
                onSimulate={() => {
                  travellerAccepts(job.id)
                  router.push(`/paid/${job.id}`)
                }}
              />
            )}
            {/* Completed: the work is done, so just the question it answered */}
            {job.status === 'completed' ? (
              <View style={{ gap: space.lg, paddingHorizontal: 20 }}>
                <View style={{ gap: 4 }}>
                  <Text variant="caption" color={colors.muted}>
                    {name} asked
                  </Text>
                  <Text variant="bodySmall" style={{ fontFamily: fonts.serifItalic, fontSize: 16, lineHeight: 22 }}>
                    “{r.doubt}”
                  </Text>
                </View>
                {job.rating && (
                  <View style={{ gap: 4 }}>
                    <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.sm }}>
                      <Text variant="caption" color={colors.muted}>
                        {name} rated you
                      </Text>
                      <Stars value={job.rating.stars} size={11} />
                    </View>
                    <Text variant="bodySmall" style={{ fontFamily: fonts.serifItalic, fontSize: 16, lineHeight: 22 }}>
                      “{job.rating.comment}”
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              brief
            )}
          </>
        )}

        <Divider style={{ marginHorizontal: 20 }} />
        <View style={{ gap: space.sm, paddingHorizontal: 20 }}>
          <Fact label="Payout" value={euro(r.payout)} strong />
          <Fact label="Accepted" value={dayClock(job.acceptedAt)} />
          <Fact label="Address" value={r.place.address} />
        </View>

        {job.status === 'completed' && (
          <Button variant="secondary" icon="eurosign.circle" onPress={() => {
              // The job sits on top of the tabs: close it, then switch tab
              router.dismissAll()
              router.navigate('/earnings')
            }}>
            See all earnings
          </Button>
        )}
      </HeroScroll>

      <HeroChrome hero={hero} />

      {action && <ActionBar>{action}</ActionBar>}

      {/* Blueprint: "Confirm presence" with GPS verification */}
      <Sheet visible={sheet === 'arrive'} onClose={() => setSheet(null)}>
        <Text variant="headline">Confirm you’re there</Text>
        {!fix ? (
          <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.md, paddingVertical: space.base }}>
            <ActivityIndicator color={colors.ink} />
            <Text variant="body" color={colors.muted}>
              Checking your GPS position…
            </Text>
          </View>
        ) : (
          <>
            <View style={{ backgroundColor: colors.successTint, borderRadius: radius.sm, gap: 6, padding: space.base }}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.sm }}>
                <Icon name="checkmark.seal.fill" size={18} color={colors.success} />
                <Text variant="label" color={colors.success}>
                  {Math.round(metresBetween(fix.position, target))} m from the pin
                </Text>
              </View>
              <Text variant="caption" color={colors.body} style={{ fontFamily: fonts.sansMedium }}>
                {coordinates(fix.position)} · accurate to {fix.accuracy} m · {clock(now)}
              </Text>
            </View>
            <PlaceMap position={target} filmer={fix.position} height={150} delta={0.003} />
            <Text variant="bodySmall" color={colors.muted}>
              Every clip is stamped with this position and the time, so {name} knows the footage is real and from today.
            </Text>
            <Button
              icon="record.circle"
              onPress={() => {
                arrive(job.id)
                setSheet(null)
                router.push(`/record/${job.id}`)
              }}>
              Start filming
            </Button>
          </>
        )}
      </Sheet>

      {/* Blueprint: "Access blocked". Flag a brief you can't meet before the session. */}
      <Sheet visible={sheet === 'problem'} onClose={() => setSheet(null)}>
        <Text variant="headline">Can’t do this job?</Text>
        <Text variant="body" color={colors.body}>
          Tell us before the session starts and we’ll sort it out with {name}. Never enter a property or a private area.
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
          {problems.map((p) => (
            <Chip key={p} label={p} selected={problem === p} onPress={() => setProblem(p)} />
          ))}
        </View>
        <Button disabled={!problem} onPress={() => setSheet('reported')}>
          Report the problem
        </Button>
        <Button variant="secondary" onPress={() => setSheet(null)}>
          Cancel
        </Button>
      </Sheet>
      <Sheet visible={sheet === 'reported'} onClose={() => setSheet(null)}>
        <Icon name="checkmark.circle.fill" size={40} color={colors.success} />
        <Text variant="headline">Thanks, we’re on it</Text>
        <Text variant="body" color={colors.body}>
          Support will contact {name} and get back to you. Reporting a real problem doesn’t affect your reliability score.
        </Text>
        <Button onPress={() => setSheet(null)}>OK</Button>
      </Sheet>
    </View>
  )
}

function Progress({ job, now }: { job: Job; now?: number }) {
  const live = job.request.mode === 'live'
  const name = job.request.traveller.firstName
  const steps = [
    { label: 'Job accepted', done: true, detail: day(job.acceptedAt) },
    { label: 'On location', done: !!job.arrivedAt, detail: job.arrivedAt ? clock(job.arrivedAt) : '' },
    live
      ? { label: 'Live call', done: !!job.callSeconds, detail: job.status === 'live' ? 'Live now' : job.callSeconds ? duration(job.callSeconds) : clock(job.request.start!) }
      : { label: 'Video delivered', done: !!job.deliveredAt, detail: job.deliveredAt ? dayClock(job.deliveredAt) : job.video ? 'Not sent yet' : '' },
    { label: `Accepted by ${name}`, done: job.status === 'completed', detail: job.releasedAt
        ? `Paid ${daySentence(job.releasedAt)}`
        : job.status === 'awaiting' && now
          ? `${waitLeft(job, now)} left`
          : 'Pending' },
  ]
  // A step is done once any later step is: you can't deliver without being on location
  steps.forEach((step, i) => {
    if (steps.slice(i + 1).some((later) => later.done)) step.done = true
  })
  const current = steps.findIndex((s) => !s.done)
  // The last step turns green once the money is released
  const paidStep = (i: number) => i === steps.length - 1 && job.status === 'completed'
  return (
    <View style={{ paddingHorizontal: 20 }}>
      {steps.map((step, i) => {
        const active = i === current
        return (
          <View key={step.label} style={{ flexDirection: 'row', gap: space.md, minHeight: i === steps.length - 1 ? 0 : 40 }}>
            <View style={{ alignItems: 'center', width: 20 }}>
              <View
                style={{
                  alignItems: 'center',
                  // Same check in a circle for every step: ink when done, greyed out when not
                  backgroundColor: paidStep(i) ? colors.successVivid : step.done ? colors.ink : colors.hairline,
                  borderColor: paidStep(i) ? colors.successVivid : step.done ? colors.ink : colors.hairline,
                  borderRadius: 10,
                  borderWidth: 1.5,
                  height: 20,
                  justifyContent: 'center',
                  width: 20,
                }}>
                <Icon name="checkmark" size={10} color={colors.white} weight="bold" />
              </View>
              {i < steps.length - 1 && (
                <View style={{ backgroundColor: step.done ? colors.ink : colors.hairline, flex: 1, width: 1.5 }} />
              )}
            </View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: i === steps.length - 1 ? 0 : space.base }}>
              <Text variant={active ? 'label' : 'bodySmall'} color={step.done || active ? colors.ink : colors.muted}>
                {step.label}
              </Text>
              <Text variant="caption" color={job.status === 'live' && step.detail === 'Live now' ? colors.live : colors.muted}>
                {step.detail}
              </Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}

// Plain text under the progress: the money is safe, any honest answer is paid,
// and when it pays out on its own
function AwaitingNote({ job, now, onSimulate }: { job: Job; now: number; onSimulate: () => void }) {
  const name = job.request.traveller.firstName
  const autoAt = (job.deliveredAt ?? now) + ACCEPT_WINDOW_MS
  return (
    <View style={{ gap: space.md, paddingHorizontal: 20 }}>
      <View style={{ alignItems: 'flex-start', flexDirection: 'row', gap: space.md }}>
        <Icon name="checkmark.shield" size={18} color={colors.success} style={{ marginTop: 1 }} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text variant="label">You’re paid for an honest answer</Text>
          <Text variant="bodySmall" color={colors.body}>
            {`Even if your video tells ${name} not to book. You get paid when ${name} accepts, or automatically ${daySentence(autoAt)} at ${clock(autoAt)}.`}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.sm }}>
        <PrototypeTag />
        <TextButton onPress={onSimulate}>Simulate: {name} accepts and rates</TextButton>
      </View>
    </View>
  )
}

