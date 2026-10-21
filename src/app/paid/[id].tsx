// The traveler accepted: the money is released. The payout and the rating
// arrive together as one moment. Production: open this from the push
// notification, or on next launch for jobs accepted while the app was closed.
import * as Haptics from 'expo-haptics'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Avatar, Button, Icon, ScreenStatusBar, Stars, Text } from '@/components/ui'
import { euro } from '@/lib/money'
import { daySentence, nextPayday, now } from '@/lib/time'
import { useJob, useStore } from '@/state/store'
import { colors, fonts, space } from '@/theme'

/* ─────────────────────────────────────────────────────────
 * STORYBOARD
 *
 *    0ms   check mark scales in (soft spring, no overshoot), success haptic
 *  250ms   "Maya accepted" fades in
 *  400ms   amount rises in
 *  650ms   where it's going
 *  900ms   the rating and comment
 * ───────────────────────────────────────────────────────── */
const TIMING = { label: 250, amount: 400, destination: 650, rating: 900 }

export default function Paid() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  const job = useJob(id)
  const { filmer } = useStore()

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  }, [])

  if (!job) return null
  const r = job.request
  const t = r.traveller
  const payout = filmer!.payout

  return (
    <View
      style={{
        backgroundColor: colors.ink,
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: insets.bottom + space.base,
        paddingHorizontal: 24,
        paddingTop: insets.top + space.xxl,
      }}>
      <ScreenStatusBar style="light" />

      <View style={{ alignItems: 'center', gap: space.base }}>
        <Animated.View
          entering={ZoomIn.springify().damping(22).stiffness(180)}
          style={{
            alignItems: 'center',
            backgroundColor: colors.successBright,
            borderRadius: 36,
            height: 72,
            justifyContent: 'center',
            width: 72,
          }}>
          <Icon name="checkmark" size={32} color={colors.ink} weight="bold" />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(TIMING.label).duration(300)}>
          <Text variant="label" color="rgba(255,252,235,0.7)">
            {t.firstName} accepted your {r.mode === 'live' ? 'call' : 'video'}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(TIMING.amount).duration(400)}>
          <Text variant="hero" color={colors.cream} style={{ fontSize: 72, lineHeight: 76, textAlign: 'center' }}>
            {euro(r.payout)}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(TIMING.destination).duration(300)}>
          <Text variant="lead" color="rgba(255,252,235,0.8)" style={{ textAlign: 'center' }}>
            {payout ? `is on its way to ${payout.provider}.` : 'is yours. Add a payout method in Profile to receive it.'}
          </Text>
        </Animated.View>
      </View>

      {job.rating && (
        <Animated.View
          entering={FadeInDown.delay(TIMING.rating).duration(400)}
          style={{
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderRadius: 20,
            gap: space.md,
            padding: 20,
          }}>
          <Stars value={job.rating.stars} size={18} color={colors.accent} />
          <Text
            variant="headline"
            color={colors.cream}
            style={{ fontFamily: fonts.serifItalic, fontSize: 20, lineHeight: 26 }}>
            “{job.rating.comment}”
          </Text>
          <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.sm }}>
            <Avatar name={t} photo={t.photo} size={28} />
            <Text variant="caption" color="rgba(255,252,235,0.7)" numberOfLines={1} style={{ flex: 1 }}>
              {t.firstName} · {r.place.title}
            </Text>
          </View>
        </Animated.View>
      )}

      <View style={{ gap: space.sm }}>
        {payout && (
          <Text variant="caption" color="rgba(255,252,235,0.6)" style={{ textAlign: 'center' }}>
            Paid out {daySentence(nextPayday(now()))}
          </Text>
        )}
        <Button variant="light" onPress={() => router.back()}>
          Done
        </Button>
      </View>
    </View>
  )
}
