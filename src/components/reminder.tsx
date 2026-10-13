// A banner that slides in when one of your jobs is about to start, so a live
// call is never just a badge on the Jobs tab.
// Prototype: an in-app banner. Production: a scheduled local notification
// (expo-notifications) plus a push from the server, opening the same job.
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { clock, duration, useNow } from '@/lib/time'
import { useStore } from '@/state/store'
import { colors, radius, shadow, space } from '@/theme'
import type { Job } from '@/types'

import { Icon, Text } from './ui'

// When to remind: live calls 10 min before, recorded deadlines 60 min before
const LIVE_LEAD_MS = 10 * 60_000
const DEADLINE_LEAD_MS = 60 * 60_000

function dueSoon(job: Job, now: number) {
  if (job.status !== 'scheduled') return false
  const r = job.request
  if (r.mode === 'live') return r.start! - now <= LIVE_LEAD_MS && now < r.start! + r.minutes! * 60_000
  return r.deadline! - now <= DEADLINE_LEAD_MS && now < r.deadline!
}

export function JobReminder() {
  const insets = useSafeAreaInsets()
  const { jobs } = useStore()
  const now = useNow()
  const [dismissed, setDismissed] = useState<string[]>([])
  const job = jobs.find((j) => dueSoon(j, now) && !dismissed.includes(j.id))

  // A nudge when a new reminder appears, not on every clock tick
  const jobId = job?.id
  useEffect(() => {
    if (jobId) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
  }, [jobId])

  if (!job) return null
  const r = job.request
  const live = r.mode === 'live'
  const at = live ? r.start! : r.deadline!
  const left = (at - now) / 1000
  const dismiss = () => setDismissed((d) => [...d, job.id])

  return (
    <Animated.View
      entering={SlideInUp.duration(300)}
      exiting={SlideOutUp.duration(200)}
      style={{ left: 12, position: 'absolute', right: 12, top: insets.top + 4, zIndex: 100 }}>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          dismiss()
          router.push(`/job/${job.id}`)
        }}
        style={({ pressed }) => [
          {
            alignItems: 'center',
            backgroundColor: colors.ink,
            borderRadius: radius.md,
            flexDirection: 'row',
            gap: space.md,
            padding: space.md,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
          shadow,
        ]}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: live ? colors.live : colors.onDarkWarning,
            borderRadius: radius.sm,
            height: 40,
            justifyContent: 'center',
            width: 40,
          }}>
          <Icon name={live ? 'video.fill' : 'clock.fill'} size={18} color={colors.white} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="label" color={colors.white} numberOfLines={1}>
            {live
              ? left > 0
                ? `Live call in ${duration(left)}`
                : 'Your live call has started'
              : `Due at ${clock(at)}`}
          </Text>
          <Text variant="caption" color="rgba(255,255,255,0.7)" numberOfLines={1}>
            {r.place.title} · {live ? `with ${r.traveller.firstName}` : 'tap to open the brief'}
          </Text>
        </View>
        <Pressable accessibilityLabel="Dismiss" hitSlop={10} onPress={dismiss}>
          <Icon name="xmark" size={14} color="rgba(255,255,255,0.6)" />
        </Pressable>
      </Pressable>
    </Animated.View>
  )
}
