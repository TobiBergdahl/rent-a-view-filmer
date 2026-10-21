import * as Haptics from 'expo-haptics'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { modeLabel } from '@/components/cards'
import { ActionBar, Sheet } from '@/components/layout'
import { PlaceMap } from '@/components/maps'
import { BriefBlocks, WhenCard } from '@/components/brief'
import { HeroChrome, HeroPhoto, HeroScroll, useHero } from '@/components/hero'
import { BackButton, Button, Chip, Divider, Fact, Tag, Text } from '@/components/ui'
import { areas } from '@/data/seed'
import { distanceLabel, metresBetween } from '@/lib/geo'
import { euro } from '@/lib/money'
import { useStore } from '@/state/store'
import { buttonHeight, colors, radius, space } from '@/theme'

const PHOTO_HEIGHT = 300

const declineReasons = ['Too far', 'Not available then', 'Needs inside access', 'Not comfortable filming this', 'Something else']

export default function RequestDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  const { requests, jobs, filmer, accept, decline } = useStore()

  const hero = useHero(PHOTO_HEIGHT)
  const request = requests.find((r) => r.id === id)
  const [sheet, setSheet] = useState<'accept' | 'decline' | null>(null)
  const [reason, setReason] = useState<string | null>(null)
  // Set while navigating away after accepting or declining, so the screen
  // doesn't flash "no longer open" on its way out
  const [leaving, setLeaving] = useState(false)

  if (!request && leaving) return <View style={{ flex: 1 }} />
  if (!request) {
    return (
      <View style={{ flex: 1, gap: space.base, padding: 20, paddingTop: insets.top + space.sm }}>
        <BackButton />
        <Text variant="headline">This request is no longer open</Text>
        <Text color={colors.muted}>Another walker may have taken it.</Text>
      </View>
    )
  }

  const distance = metresBetween(areas[filmer!.area].centre, request.place.position)
  const name = request.traveller.firstName

  return (
    <View style={{ flex: 1 }}>
      <HeroPhoto hero={hero} photo={request.place.photo} />
      <HeroScroll hero={hero}>
          <View style={{ gap: space.sm }}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <Tag icon={request.mode === 'live' ? 'video.fill' : 'record.circle'}>{modeLabel(request)}</Tag>
              <Tag>{request.category}</Tag>
            </View>
            <Text variant="display">{request.place.title}</Text>
            <Text variant="body" color={colors.muted}>
              {request.place.address} · {distanceLabel(distance)} away
            </Text>
          </View>

          <BriefBlocks request={request} firstTime={!jobs.some((j) => j.status === 'completed')} />

          <WhenCard request={request} />

          <View style={{ gap: space.md }}>
            <Text variant="section">Where</Text>
            <PlaceMap position={request.place.position} height={200} />
            <Text variant="bodySmall" color={colors.muted}>
              {request.place.address}
            </Text>
          </View>

      </HeroScroll>

      <HeroChrome hero={hero} />

      <ActionBar>
        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* Same height as the buttons */}
          <Text variant="display" style={{ lineHeight: buttonHeight }}>
            {euro(request.payout)}
          </Text>
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            <Button variant="secondary" onPress={() => setSheet('decline')} style={{ paddingHorizontal: 20 }}>
              Decline
            </Button>
            <Button onPress={() => setSheet('accept')} style={{ paddingHorizontal: 24 }}>
              Accept
            </Button>
          </View>
        </View>
        <Text variant="caption" color={colors.muted} style={{ textAlign: 'center' }}>
          You get paid when {name} accepts, or automatically after 24 hours.
        </Text>
      </ActionBar>

      {/* Blueprint: "Accept this job?" — an important commitment */}
      <Sheet visible={sheet === 'accept'} onClose={() => setSheet(null)}>
        <Text variant="headline">Accept this job?</Text>
        <Text variant="body" color={colors.body}>
          {request.mode === 'live'
            ? `You commit to be at the pin and join the call at the exact minute. ${name} will be waiting.`
            : `You commit to go to the pin and film the brief before the deadline.`}
        </Text>
        <View style={{ backgroundColor: colors.card, borderRadius: radius.sm, gap: space.sm, padding: space.base }}>
          <Fact label="Place" value={request.place.title} />
          <Fact label="Distance" value={`${distanceLabel(distance)} away`} />
          <Fact label="Payout" value={euro(request.payout)} strong />
        </View>
        <Text variant="caption" color={colors.muted}>
          Late cancellations or not showing up lower your reliability score.
        </Text>
        <Button
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            setLeaving(true)
            accept(request.id)
            setSheet(null)
            router.replace(`/job/${request.id}`)
          }}>
          Yes, accept the job
        </Button>
        <Button variant="secondary" onPress={() => setSheet(null)}>
          Not now
        </Button>
      </Sheet>

      <Sheet visible={sheet === 'decline'} onClose={() => setSheet(null)}>
        <Text variant="headline">Decline this request?</Text>
        <Text variant="body" color={colors.body}>
          It goes back to other walkers. Telling us why helps us send you better requests.
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
          {declineReasons.map((r) => (
            <Chip key={r} label={r} selected={reason === r} onPress={() => setReason(r)} />
          ))}
        </View>
        <Divider />
        <Button
          onPress={() => {
            setLeaving(true)
            decline(request.id)
            setSheet(null)
            router.back()
          }}>
          Decline request
        </Button>
        <Button variant="secondary" onPress={() => setSheet(null)}>
          Keep it
        </Button>
      </Sheet>
    </View>
  )
}
