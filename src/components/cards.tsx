import { Image } from 'expo-image'
import { Pressable, View } from 'react-native'

import { distanceLabel } from '@/lib/geo'
import { euro } from '@/lib/money'
import { clock, day, dayClock, daySentence, duration } from '@/lib/time'
import { colors, radius, shadow, space, raised } from '@/theme'
import type { Job, Request } from '@/types'

import { Icon, StatusPill, Tag, Text } from './ui'

// --- Shared wording, so cards and detail screens say the same thing ---

export const modeLabel = (request: Request) =>
  request.mode === 'live' ? `Live · ${request.minutes} min` : 'Recorded'

export const timingLabel = (request: Request) =>
  request.mode === 'live' && request.start
    ? `${dayClock(request.start)} · ${request.minutes} min call`
    : request.deadline
      ? `Deliver by ${daySentence(request.deadline).replace(/^on /, '')}, ${clock(request.deadline)}`
      : ''

export function jobLine(job: Job) {
  const r = job.request
  switch (job.status) {
    case 'scheduled':
      return timingLabel(r)
    case 'live':
      return 'Call in progress'
    case 'awaiting':
      return job.callSeconds
        ? `Call ended · ${duration(job.callSeconds)}`
        : `Delivered ${job.deliveredAt ? daySentence(job.deliveredAt) : ''}`
    case 'completed':
      return `Paid ${job.releasedAt ? daySentence(job.releasedAt) : ''}`
  }
}

/** Airbnb-style card: photo first, then the facts and the traveller's doubt */
export function RequestCard({
  request,
  distance,
  onPress,
}: {
  request: Request
  distance: number
  onPress: () => void
}) {
  const live = request.mode === 'live'
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${request.place.title}, ${modeLabel(request)}, ${euro(request.payout)}`}
      onPress={onPress}
      style={({ pressed }) => ({ gap: space.md, transform: [{ scale: pressed ? 0.985 : 1 }] })}>
      <View style={{ aspectRatio: 16 / 10, borderRadius: radius.md, overflow: 'hidden' }}>
        <Image source={request.place.photo} style={{ flex: 1 }} contentFit="cover" transition={200} />
        <View style={{ flexDirection: 'row', gap: 6, left: 12, position: 'absolute', top: 12 }}>
          <View
            style={[
              {
                alignItems: 'center',
                backgroundColor: live ? colors.live : colors.canvas,
                borderRadius: radius.pill,
                flexDirection: 'row',
                gap: 6,
                paddingHorizontal: 10,
                paddingVertical: 4,
              },
              shadow,
            ]}>
            <Icon name={live ? 'video.fill' : 'record.circle'} size={12} color={live ? colors.white : colors.ink} />
            <Text variant="captionStrong" color={live ? colors.white : colors.ink}>
              {modeLabel(request)}
            </Text>
          </View>
          <Tag onPhoto>{request.category}</Tag>
        </View>
      </View>
      <View style={{ gap: 2 }}>
        <View style={{ flexDirection: 'row', gap: space.md, justifyContent: 'space-between' }}>
          <Text variant="title" style={{ flex: 1 }} numberOfLines={1}>
            {request.place.title}
          </Text>
          <Text variant="title">{euro(request.payout)}</Text>
        </View>
        <Text variant="bodySmall" color={colors.muted}>
          {request.place.area} · {distanceLabel(distance)} away
        </Text>
        <Text variant="bodySmall" color={colors.muted}>
          {timingLabel(request)}
        </Text>
        <Text variant="lead" style={{ fontSize: 16, lineHeight: 22, marginTop: 6 }} numberOfLines={2}>
          “{request.doubt}”
        </Text>
      </View>
    </Pressable>
  )
}

/** Compact row card for jobs and earnings */
/**
 * Compact row for a job. In the Jobs and Earnings tabs (`inSection`) the card
 * leads with the money instead of a status pill: amount, pending amount, or
 * paid. Only Live now keeps its pill.
 */
export function JobCard({
  job,
  onPress,
  trailing,
  inSection,
  flat,
}: {
  job: Job
  onPress: () => void
  trailing?: string
  inSection?: boolean
  /** A list where every row is plain: no white cards, rows flush with the page */
  flat?: boolean
}) {
  const r = job.request
  const paid = inSection && job.status === 'completed'
  // In the Jobs and Earnings lists, jobs you still have to do are white cards;
  // awaiting and completed ones are plain rows, since there's nothing to do
  const plain = flat || (inSection && (job.status === 'awaiting' || job.status === 'completed'))
  const showPill = !inSection || job.status === 'live'
  // A job you still have to do: white card with the photo across the top, so
  // nothing has to line up with the plain rows below it
  const featured = inSection && !plain

  const text = (
    <>
      {showPill && <StatusPill status={job.status} />}
      {inSection && job.status !== 'live' && <MoneyLine job={job} pendingDetail={flat} />}
      <Text variant="title" numberOfLines={1}>
        {r.place.title}
      </Text>
      <Text variant="caption" color={colors.muted} numberOfLines={1}>
        {r.mode === 'live' ? 'Live' : 'Recorded'} · {paid ? r.place.area : jobLine(job)}
      </Text>
    </>
  )

  if (featured) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          { backgroundColor: colors.canvas, borderRadius: radius.md, overflow: 'hidden', transform: [{ scale: pressed ? 0.985 : 1 }] },
          raised,
        ]}>
        <Image source={r.place.photo} style={{ aspectRatio: 16 / 9, width: '100%' }} contentFit="cover" transition={150} />
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.md, padding: space.base }}>
          <View style={{ flex: 1, gap: 4 }}>{text}</View>
          <Icon name="chevron.right" size={12} color={colors.mutedSoft} />
        </View>
      </Pressable>
    )
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        alignItems: 'center',
        backgroundColor: plain ? 'transparent' : colors.card,
        borderRadius: radius.md,
        flexDirection: 'row',
        gap: space.md,
        // Plain rows sit flush with the page edge
        paddingHorizontal: plain ? 0 : space.md,
        paddingVertical: space.md,
        transform: [{ scale: pressed ? 0.985 : 1 }],
      })}>
      <Image
        source={r.place.photo}
        style={{ borderRadius: radius.sm, height: 72, width: 72 }}
        contentFit="cover"
        transition={150}
      />
      <View style={{ flex: 1, gap: 4 }}>{text}</View>
      {!inSection && <Text variant="label">{trailing ?? euro(r.payout)}</Text>}
      <Icon name="chevron.right" size={12} color={colors.mutedSoft} />
    </Pressable>
  )
}

/** First line of a job card in the Jobs tab: where the money is */
/**
 * `pendingDetail` (Earnings, where everything not paid counts as Pending): say
 * what the money is waiting for. "Pending" is the word filmers know from other
 * gig apps; we avoid "escrow" in the filmer app.
 */
function MoneyLine({ job, pendingDetail }: { job: Job; pendingDetail?: boolean }) {
  const amount = euro(job.request.payout)
  if (job.status === 'completed')
    return (
      <Text variant="label" color={colors.success}>
        Paid {amount}
        {job.releasedAt ? ` · ${day(job.releasedAt)}` : ''}
      </Text>
    )
  // Still to film: on Jobs just the amount you'll earn
  if (job.status === 'scheduled' && !pendingDetail) return <Text variant="label">{amount}</Text>
  return (
    <Text variant="label" color={colors.warning}>
      {amount} · {job.status === 'scheduled' ? 'after the job' : `waiting for ${job.request.traveller.firstName}`}
    </Text>
  )
}
