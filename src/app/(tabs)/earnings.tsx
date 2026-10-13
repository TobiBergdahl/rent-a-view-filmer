import { router } from 'expo-router'
import { useState } from 'react'
import { Pressable, useWindowDimensions, View } from 'react-native'
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { JobCard } from '@/components/cards'
import { Section } from '@/components/layout'
import { Divider, ScreenStatusBar, Stars, Text } from '@/components/ui'
import { euro } from '@/lib/money'
import { day, daySentence, nextPayday, startOfMonth, startOfWeek, useNow } from '@/lib/time'
import { inEscrow, useStore } from '@/state/store'
import { colors, radius, space } from '@/theme'

export default function Earnings() {
  const insets = useSafeAreaInsets()
  const { jobs, filmer } = useStore()
  const now = useNow(60_000)
  // Paid out is shown for a period; Pending is always what's held right now
  const [period, setPeriod] = useState<Period>('week')
  const from = period === 'week' ? startOfWeek(now) : period === 'month' ? startOfMonth(now) : 0
  const pending = jobs.filter(inEscrow)
  const released = jobs
    .filter((j) => !inEscrow(j) && (j.releasedAt ?? 0) >= from)
    .sort((a, b) => (b.releasedAt ?? 0) - (a.releasedAt ?? 0))
  const payday = nextPayday(now)
  const sum = (list: typeof jobs) => list.reduce((total, j) => total + j.request.payout, 0)
  const reviews = jobs
    .filter((j) => j.rating)
    .sort((a, b) => b.rating!.at - a.rating!.at)

  // The summary sits fixed on a dark background; the lists scroll over it
  // like a sheet. Title at the top, totals pinned to the bottom of the header.
  const { height: screenHeight } = useWindowDimensions()
  const headerHeight = Math.round(screenHeight * 0.42)
  const scrollY = useSharedValue(0)
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y
  })
  // Never shorter than the status bar, so the time stays on dark
  const clip = useAnimatedStyle(() => ({
    height: Math.max(insets.top, Math.min(headerHeight, headerHeight - scrollY.value)),
  }))

  return (
    <View style={{ backgroundColor: colors.ink, flex: 1 }}>
      <ScreenStatusBar style="light" />
      {/* The header sits on top and is clipped at the sheet's top edge as the
          sheet scrolls up, so it looks covered but stays tappable */}
      <Animated.View
        style={[
          { backgroundColor: colors.ink, left: 0, overflow: 'hidden', position: 'absolute', right: 0, top: 0, zIndex: 1 },
          clip,
        ]}>
      <View
        style={{
          height: headerHeight,
          justifyContent: 'space-between',
          padding: 20,
          paddingBottom: space.lg,
          paddingTop: insets.top + space.sm,
        }}>
        <View style={{ gap: space.md }}>
          <Text variant="display" color={colors.cream}>
            Earnings
          </Text>
          <PeriodSwitch value={period} onChange={setPeriod} />
        </View>
        <View style={{ gap: space.md }}>
        <View style={{ flexDirection: 'row', gap: space.lg }}>
          <Total label={`Paid out ${periodLabel[period]}`} amount={euro(sum(released))} color={colors.successBright} />
          <Total label="Pending" amount={euro(sum(pending))} color={colors.onDarkWarning} />
        </View>
        <Text variant="caption" color="rgba(255,252,235,0.6)">
          {filmer!.payout
            ? `Next payout ${daySentence(payday)} to ${filmer!.payout.provider}. Money is released when the traveller accepts.`
            : 'Released when the traveller accepts. Add a payout method in Profile to get paid.'}
        </Text>
        </View>
      </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingTop: headerHeight }}>
        <View
          style={{
            backgroundColor: colors.page,
            borderTopLeftRadius: radius.lg,
            borderTopRightRadius: radius.lg,
            flexGrow: 1,
            gap: space.xl,
            padding: 20,
            paddingBottom: insets.bottom + 96,
            paddingTop: space.lg,
          }}>
          {/* Keeps the page colour under the sheet when it bounces at the bottom */}
          <View style={{ backgroundColor: colors.page, bottom: -1000, height: 1000, left: 0, position: 'absolute', right: 0 }} />
      {pending.length > 0 && (
        <Section title="Pending">
          {pending.map((job) => (
            <JobCard key={job.id} job={job} onPress={() => router.push(`/job/${job.id}`)} inSection flat />
          ))}
        </Section>
      )}

      {released.length > 0 && (
        <Section title={`Paid out ${periodLabel[period]}`}>
          {released.map((job) => (
            <JobCard key={job.id} job={job} onPress={() => router.push(`/job/${job.id}`)} inSection flat />
          ))}
        </Section>
      )}

      <Section title="Ratings">
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.sm }}>
          <Text variant="headline">{filmer!.ratingCount ? filmer!.ratingAverage.toFixed(1) : '–'}</Text>
          <Stars value={filmer!.ratingAverage} size={14} />
          <Text variant="bodySmall" color={colors.muted}>
            {filmer!.ratingCount ? `${filmer!.ratingCount} reviews` : 'No reviews yet'}
          </Text>
        </View>
        {reviews.map((job) => (
          <View key={job.id} style={{ gap: space.sm, paddingTop: space.sm }}>
            <Divider style={{ marginBottom: space.sm }} />
            <Text variant="bodySmall">“{job.rating!.comment}”</Text>
            <Text variant="caption" color={colors.muted} numberOfLines={1}>
              {job.request.traveller.firstName} · {job.request.place.title} · {day(job.rating!.at)}
            </Text>
          </View>
        ))}
      </Section>
        </View>
      </Animated.ScrollView>
    </View>
  )
}

function Total({ label, amount, color }: { label: string; amount: string; color: string }) {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <Text variant="captionStrong" color={color}>
        {label}
      </Text>
      <Text variant="display" color={colors.cream} numberOfLines={1} adjustsFontSizeToFit style={{ fontSize: 38, lineHeight: 42 }}>
        {amount}
      </Text>
    </View>
  )
}

type Period = 'week' | 'month' | 'all'
const periodLabel: Record<Period, string> = { week: 'this week', month: 'this month', all: 'in total' }
const periods: { id: Period; label: string }[] = [
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'all', label: 'All time' },
]

/** Light-on-dark segmented control for the header */
function PeriodSwitch({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: radius.pill,
        flexDirection: 'row',
        padding: 3,
      }}>
      {periods.map((p) => {
        const active = p.id === value
        return (
          <Pressable
            key={p.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(p.id)}
            style={{
              backgroundColor: active ? colors.cream : 'transparent',
              borderRadius: radius.pill,
              paddingHorizontal: 14,
              paddingVertical: 6,
            }}>
            <Text variant="label" color={active ? colors.ink : 'rgba(255,252,235,0.75)'}>
              {p.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
