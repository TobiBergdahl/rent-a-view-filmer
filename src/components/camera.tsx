// Simulated camera feed for the prototype: a placeholder photo with a slow
// drift so it reads as live video, plus the proof stamp every clip carries.
// Production: expo-camera (CameraView) for recording, and the live-video
// provider's local preview during calls.
import { Image, type ImageProps } from 'expo-image'
import { useEffect } from 'react'
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

import { distanceLabel, metresBetween, ON_LOCATION_RADIUS } from '@/lib/geo'
import { colors, radius } from '@/theme'
import type { LatLng } from '@/types'

import { Icon, Text, type SymbolName } from './ui'

export function Viewfinder({ photo, style }: { photo?: ImageProps['source']; style?: StyleProp<ViewStyle> }) {
  const drift = useSharedValue(0)
  useEffect(() => {
    drift.value = withRepeat(withTiming(1, { duration: 14000, easing: Easing.inOut(Easing.sin) }), -1, true)
  }, [drift])
  const animated = useAnimatedStyle(() => ({
    transform: [
      { scale: 1.12 + drift.value * 0.06 },
      { translateX: -12 + drift.value * 24 },
      { translateY: drift.value * -10 },
    ],
  }))
  return (
    <View style={[{ backgroundColor: colors.camera, overflow: 'hidden' }, style]}>
      <Animated.View style={[{ flex: 1 }, animated]}>
        <Image source={photo} style={{ flex: 1 }} contentFit="cover" transition={300} />
      </Animated.View>
    </View>
  )
}

/** Pulsing red dot for "recording" and "live" */
export function PulseDot({ size = 8, color = colors.live }: { size?: number; color?: string }) {
  const opacity = useSharedValue(1)
  useEffect(() => {
    opacity.value = withRepeat(withSequence(withTiming(0.25, { duration: 600 }), withTiming(1, { duration: 600 })), -1)
  }, [opacity])
  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }))
  return <Animated.View style={[{ backgroundColor: color, borderRadius: size / 2, height: size, width: size }, animated]} />
}

/**
 * Tells the filmer whether they're at the right place, in plain words.
 * The GPS position and time are still saved with every clip and shown to the
 * traveler as proof; the filmer doesn't need to read coordinates.
 */
export function LocationCheck({ position, target, place }: { position: LatLng; target: LatLng; place: string }) {
  const metres = metresBetween(position, target)
  const onSpot = metres <= ON_LOCATION_RADIUS
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: onSpot ? 'rgba(0,0,0,0.45)' : colors.warningTint,
        borderRadius: radius.pill,
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
      }}>
      <Icon
        name={onSpot ? 'checkmark.circle.fill' : 'exclamationmark.triangle.fill'}
        size={14}
        color={onSpot ? colors.successBright : colors.warning}
      />
      <Text variant="captionStrong" color={onSpot ? colors.white : colors.warning} numberOfLines={1}>
        {onSpot ? `You’re at ${place}` : `Wrong place? ${distanceLabel(metres)} from ${place}`}
      </Text>
    </View>
  )
}

/** Round control on dark camera screens (mute, brief, flip). `badge` shows a count. */
export function CameraControl({
  icon,
  label,
  onPress,
  active,
  badge,
}: {
  icon: SymbolName
  label: string
  onPress: () => void
  active?: boolean
  badge?: string
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        alignItems: 'center',
        backgroundColor: active ? colors.white : 'rgba(255,255,255,0.18)',
        borderRadius: 26,
        height: 52,
        justifyContent: 'center',
        transform: [{ scale: pressed ? 0.94 : 1 }],
        width: 52,
      })}>
      <Icon name={icon} size={20} color={active ? colors.ink : colors.white} />
      {badge && (
        <View style={{ backgroundColor: colors.white, borderRadius: radius.pill, paddingHorizontal: 5, position: 'absolute', right: -4, top: -4 }}>
          <Text variant="captionStrong" style={{ fontSize: 12 }}>
            {badge}
          </Text>
        </View>
      )}
    </Pressable>
  )
}
