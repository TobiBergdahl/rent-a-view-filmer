// The design system's building blocks. See DESIGN.md in the web repo for the rules:
// ink pills act, yellow highlights, cards are borderless grey, one shadow.
import * as Haptics from 'expo-haptics'
import { Image } from 'expo-image'
import { router, useFocusEffect } from 'expo-router'
import { setStatusBarStyle } from 'expo-status-bar'
import { SymbolView, type SymbolViewProps } from 'expo-symbols'
import { useCallback, type ReactNode } from 'react'
import {
  ActivityIndicator,
  Pressable,
  Text as RNText,
  View,
  type PressableProps,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native'

import { statusLabel } from '@/state/store'
import { buttonHeight, colors, fonts, radius, shadow, space, type, raised } from '@/theme'
import type { JobStatus } from '@/types'

export type SymbolName = Extract<SymbolViewProps['name'], string>

// --- Text ---

type Variant = keyof typeof type

export function Text({
  variant = 'body',
  color,
  style,
  ...props
}: TextProps & { variant?: Variant; color?: string }) {
  // Section headings default to muted; everything else to ink
  const fallback = variant === 'section' ? colors.muted : colors.ink
  return <RNText {...props} style={[type[variant], { color: color ?? fallback }, style]} />
}

// --- Icons (SF Symbols on iOS) ---

export function Icon({
  name,
  size = 20,
  color = colors.ink,
  weight = 'medium',
  style,
}: {
  name: SymbolName
  size?: number
  color?: string
  weight?: SymbolViewProps['weight']
  style?: StyleProp<ViewStyle>
}) {
  return (
    <SymbolView name={name} size={size} tintColor={color} weight={weight} style={[{ width: size, height: size }, style]} />
  )
}

// --- Buttons: every button is a pill ---

type ButtonVariant = 'primary' | 'secondary' | 'sunrise' | 'live' | 'light' | 'ghostLight'

const buttonColors: Record<ButtonVariant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.ink, fg: colors.white, border: colors.ink },
  secondary: { bg: 'transparent', fg: colors.ink, border: 'rgba(0,0,0,0.18)' },
  sunrise: { bg: colors.sunrise, fg: colors.black, border: colors.sunrise },
  live: { bg: colors.live, fg: colors.white, border: colors.live },
  light: { bg: colors.white, fg: colors.ink, border: colors.white },
  ghostLight: { bg: 'rgba(255,255,255,0.14)', fg: colors.white, border: 'rgba(255,255,255,0.28)' },
}

export function Button({
  children,
  variant = 'primary',
  icon,
  loading,
  disabled,
  onPress,
  style,
  compact,
}: {
  children: ReactNode
  variant?: ButtonVariant
  icon?: SymbolName
  loading?: boolean
  disabled?: boolean
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  compact?: boolean
}) {
  const c = buttonColors[variant]
  const inactive = disabled || loading
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        onPress?.()
      }}
      style={({ pressed }) => [
        {
          alignItems: 'center',
          backgroundColor: c.bg,
          borderColor: c.border,
          borderRadius: radius.pill,
          borderWidth: 1,
          flexDirection: 'row',
          gap: space.sm,
          justifyContent: 'center',
          minHeight: compact ? 40 : buttonHeight,
          opacity: disabled ? 0.35 : 1,
          paddingHorizontal: compact ? 18 : 28,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={c.fg} />
      ) : (
        <>
          {icon && <Icon name={icon} color={c.fg} size={18} />}
          <Text variant={compact ? 'label' : 'button'} color={c.fg} numberOfLines={1}>
            {children}
          </Text>
        </>
      )}
    </Pressable>
  )
}

/** Ink, underlined */
export function TextButton({
  children,
  onPress,
  color = colors.ink,
  style,
}: {
  children: ReactNode
  onPress: () => void
  color?: string
  style?: StyleProp<TextStyle>
}) {
  return (
    <Pressable accessibilityRole="button" hitSlop={10} onPress={onPress}>
      {({ pressed }) => (
        <Text
          variant="label"
          color={color}
          style={[{ opacity: pressed ? 0.6 : 1, textDecorationLine: 'underline' }, style]}>
          {children}
        </Text>
      )}
    </Pressable>
  )
}

/** Round floating button over photos and maps (back, close, recentre) */
export function RoundButton({
  icon,
  onPress,
  label,
  dark,
  style,
}: {
  icon: SymbolName
  onPress: () => void
  label: string
  dark?: boolean
  style?: StyleProp<ViewStyle>
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        {
          alignItems: 'center',
          backgroundColor: dark ? 'rgba(0,0,0,0.42)' : colors.canvas,
          borderRadius: radius.pill,
          height: 40,
          justifyContent: 'center',
          transform: [{ scale: pressed ? 0.94 : 1 }],
          width: 40,
        },
        !dark && shadow,
        style,
      ]}>
      <Icon name={icon} size={16} weight="semibold" color={dark ? colors.white : colors.ink} />
    </Pressable>
  )
}

export function BackButton({ dark, style }: { dark?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <RoundButton
      dark={dark}
      icon="chevron.left"
      label="Back"
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      style={style}
    />
  )
}

// --- Surfaces ---

export function Card({
  children,
  style,
  onPress,
  white,
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  onPress?: PressableProps['onPress']
  white?: boolean
}) {
  const base: ViewStyle = {
    backgroundColor: white ? colors.canvas : colors.card,
    ...(white ? raised : {}),
    borderRadius: radius.md,
    padding: 20,
    gap: space.md,
  }
  if (!onPress) return <View style={[base, style]}>{children}</View>
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [base, { transform: [{ scale: pressed ? 0.985 : 1 }] }, style]}>
      {children}
    </Pressable>
  )
}

/** Yellow pill that labels a section */
export function Kicker({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          backgroundColor: colors.accent,
          borderRadius: radius.pill,
          paddingHorizontal: 12,
          paddingVertical: 4,
        },
        style,
      ]}>
      <Text variant="captionStrong">{children}</Text>
    </View>
  )
}

const statusColors: Record<JobStatus, { bg: string; fg: string }> = {
  scheduled: { bg: 'rgba(0,0,0,0.07)', fg: colors.body },
  live: { bg: colors.live, fg: colors.white },
  awaiting: { bg: colors.warningTint, fg: colors.warning },
  completed: { bg: colors.successTint, fg: colors.success },
}

/** Same labels and colours as the web dashboard */
export function StatusPill({ status, style }: { status: JobStatus; style?: StyleProp<ViewStyle> }) {
  const c = statusColors[status]
  return (
    <View
      style={[
        {
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: c.bg,
          borderRadius: radius.pill,
          flexDirection: 'row',
          gap: 6,
          paddingHorizontal: 10,
          paddingVertical: 3,
        },
        style,
      ]}>
      {status === 'live' && <View style={{ backgroundColor: colors.white, borderRadius: 4, height: 6, width: 6 }} />}
      <Text variant="captionStrong" color={c.fg}>
        {statusLabel[status]}
      </Text>
    </View>
  )
}

/** Neutral pill for facts like "Recorded" or "Beach". Not a button. */
export function Tag({
  children,
  icon,
  style,
  onPhoto,
}: {
  children: ReactNode
  icon?: SymbolName
  style?: StyleProp<ViewStyle>
  onPhoto?: boolean
}) {
  return (
    <View
      style={[
        {
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: onPhoto ? colors.canvas : colors.surfaceStrong,
          borderRadius: radius.pill,
          flexDirection: 'row',
          gap: 5,
          paddingHorizontal: 10,
          paddingVertical: 4,
        },
        onPhoto && shadow,
        style,
      ]}>
      {icon && <Icon name={icon} size={12} color={colors.body} weight="semibold" />}
      <Text variant="captionStrong" color={colors.body}>
        {children}
      </Text>
    </View>
  )
}

/** Selectable chip (white control, ink when selected) */
export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string
  selected?: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={() => {
        Haptics.selectionAsync()
        onPress()
      }}
      style={({ pressed }) => ({
        backgroundColor: selected ? colors.ink : colors.canvas,
        borderColor: selected ? colors.ink : colors.hairline,
        borderRadius: radius.pill,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 8,
        transform: [{ scale: pressed ? 0.96 : 1 }],
      })}>
      <Text variant="label" color={selected ? colors.white : colors.ink} style={{ fontFamily: fonts.sansMedium }}>
        {label}
      </Text>
    </Pressable>
  )
}

/** Accent-tint info note */
export function Notice({
  children,
  icon = 'info.circle',
  tone = 'info',
  style,
}: {
  children: ReactNode
  icon?: SymbolName
  tone?: 'info' | 'success' | 'warning'
  style?: StyleProp<ViewStyle>
}) {
  const bg = { info: colors.surfaceStrong, success: colors.successTint, warning: colors.warningTint }[tone]
  const fg = { info: colors.muted, success: colors.success, warning: colors.warning }[tone]
  return (
    <View
      style={[
        {
          alignItems: 'flex-start',
          backgroundColor: bg,
          borderRadius: radius.sm,
          flexDirection: 'row',
          gap: space.md,
          paddingHorizontal: space.base,
          paddingVertical: 14,
        },
        style,
      ]}>
      <Icon name={icon} size={16} color={fg} style={{ marginTop: 2 }} />
      <View style={{ flex: 1 }}>
        {typeof children === 'string' ? (
          <Text variant="bodySmall" color={colors.body}>
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </View>
  )
}

/** Yellow tile behind an icon */
export function IconTile({ name, size = 40, tint = colors.surfaceStrong }: { name: SymbolName; size?: number; tint?: string }) {
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: tint,
        borderRadius: radius.sm,
        height: size,
        justifyContent: 'center',
        width: size,
      }}>
      <Icon name={name} size={size * 0.45} />
    </View>
  )
}

export function Avatar({
  name,
  photo,
  size = 40,
}: {
  name: { firstName: string; lastName: string }
  photo?: string
  size?: number
}) {
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: colors.hairlineSoft,
        borderRadius: size / 2,
        height: size,
        justifyContent: 'center',
        overflow: 'hidden',
        width: size,
      }}>
      {photo ? (
        <Image source={photo} style={{ height: size, width: size }} contentFit="cover" transition={150} />
      ) : (
        <Text
          variant="label"
          color={colors.body}
          style={{ fontFamily: fonts.serifSemiBold, fontSize: size * 0.38, lineHeight: size * 0.46 }}>
          {name.firstName[0]}
          {name.lastName[0]}
        </Text>
      )}
    </View>
  )
}

export function Stars({ value, size = 14, color = colors.ink }: { value: number; size?: number; color?: string }) {
  return (
    <View accessibilityLabel={`${value} out of 5 stars`} style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon
          key={n}
          name={value >= n ? 'star.fill' : value >= n - 0.5 ? 'star.leadinghalf.filled' : 'star'}
          size={size}
          color={color}
        />
      ))}
    </View>
  )
}

/** "Label ........ value" fact row */
export function Fact({ label, value, strong }: { label: string; value: ReactNode; strong?: boolean }) {
  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.base, justifyContent: 'space-between' }}>
      <Text variant="bodySmall" color={colors.muted}>
        {label}
      </Text>
      {typeof value === 'string' ? (
        <Text variant={strong ? 'title' : 'bodySmall'} style={{ flexShrink: 1, textAlign: 'right' }}>
          {value}
        </Text>
      ) : (
        value
      )}
    </View>
  )
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[{ backgroundColor: colors.hairlineSoft, height: 1 }, style]} />
}

/** Small wordmark-style tag shown on prototype-only controls, like the web's "wireframe" pill */
export function PrototypeTag() {
  return (
    <View style={{ backgroundColor: colors.mutedSoft, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2 }}>
      <Text variant="captionStrong" color={colors.white}>
        Prototype
      </Text>
    </View>
  )
}

export function Wordmark({ color = colors.ink, size = 24 }: { color?: string; size?: number }) {
  return (
    <Text
      style={{ fontFamily: fonts.serifSemiBold, fontSize: size, letterSpacing: -size * 0.02, lineHeight: size * 1.15 }}
      color={color}>
      Rent A View
    </Text>
  )
}

/**
 * Status bar style while this screen is focused; back to dark when it isn't.
 * (Expo Go can't use native-stack's per-screen statusBarStyle.)
 */
export function ScreenStatusBar({ style }: { style: 'light' | 'dark' }) {
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle(style, true)
      return () => setStatusBarStyle('dark', true)
    }, [style]),
  )
  return null
}
