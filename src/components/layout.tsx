import { useState, type ReactNode } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Path } from 'react-native-svg'

import { colors, fonts, radius, shadow, space } from '@/theme'

import { Text } from './ui'

/** The web app's logo mark (assets/logo-mark.svg): an "A" in a soft square */
export function LogoMark({ size = 40, color = colors.cream }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 62.4014 62.4014" accessibilityLabel="Rent A View">
      <Path
        fill={color}
        d="M38.4014 0C51.656 0 62.4011 10.7444 62.4014 23.999V38.4014C62.4011 51.656 51.656 62.4014 38.4014 62.4014H24C10.7453 62.4014 0.000263885 51.656 0 38.4014V23.999C0.000263885 10.7444 10.7453 0 24 0H38.4014ZM21.4424 33.7949C15.014 32.9404 10.8154 31.5645 10.8154 31.5645V37.459C10.8154 37.459 14.3126 38.4537 19.6357 39.2148L17.7783 44.79H24.9844L26.3496 39.9102C27.9052 40.0084 29.5303 40.0674 31.2012 40.0674C32.8872 40.0674 34.5234 40.0071 36.0869 39.9072L37.4629 44.79H44.5869L42.7197 39.2158C48.0079 38.4546 51.458 37.459 51.458 37.459L51.5859 31.5645C51.5585 31.5736 47.3718 32.9687 40.9131 33.8184L35.4863 17.6104H26.8379L21.4424 33.7949ZM34.5312 34.3838C33.481 34.4313 32.3987 34.459 31.2891 34.459C30.1285 34.459 28.996 34.4277 27.8975 34.376L31.0801 23.0049H31.3271L34.5312 34.3838Z"
      />
    </Svg>
  )
}

/** White input, hairline border, 12px radius, 48 tall. Ink border on focus. */
export function TextField({
  label,
  multiline,
  style,
  ...props
}: TextInputProps & { label: string; style?: StyleProp<ViewStyle> }) {
  const [focused, setFocused] = useState(false)
  return (
    <View style={[{ gap: space.sm }, style]}>
      <Text variant="label">{label}</Text>
      <TextInput
        placeholderTextColor={colors.mutedSoft}
        selectionColor={colors.ink}
        cursorColor={colors.ink}
        multiline={multiline}
        {...props}
        onFocus={(e) => {
          setFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          props.onBlur?.(e)
        }}
        style={{
          backgroundColor: colors.canvas,
          borderColor: focused ? colors.ink : colors.hairline,
          borderRadius: radius.sm,
          borderWidth: focused ? 2 : 1,
          color: colors.ink,
          fontFamily: fonts.sans,
          fontSize: 16,
          minHeight: multiline ? 112 : 48,
          paddingHorizontal: focused ? 13 : 14,
          paddingTop: multiline ? 12 : 0,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
    </View>
  )
}

/** Floating white sheet from the bottom, over a scrim */
export function Sheet({
  visible,
  onClose,
  children,
  dismissable = true,
}: {
  visible: boolean
  onClose: () => void
  children: ReactNode
  dismissable?: boolean
}) {
  const insets = useSafeAreaInsets()
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable
          accessibilityLabel="Close"
          onPress={dismissable ? onClose : undefined}
          style={{ backgroundColor: colors.scrim, bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}
        />
        <View
          style={[
            {
              backgroundColor: colors.canvas,
              borderRadius: radius.lg,
              gap: space.base,
              margin: space.sm,
              marginBottom: Math.max(insets.bottom, space.sm),
              padding: space.lg,
            },
            shadow,
          ]}>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

/** Sticky bottom action bar, Airbnb reservation style */
export function ActionBar({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const insets = useSafeAreaInsets()
  return (
    <View
      style={[
        {
          backgroundColor: colors.page,
          borderTopColor: colors.hairlineSoft,
          borderTopWidth: 1,
          gap: space.md,
          paddingBottom: Math.max(insets.bottom, space.base),
          paddingHorizontal: 20,
          paddingTop: space.md,
        },
        style,
      ]}>
      {children}
    </View>
  )
}

export function Section({
  title,
  children,
  action,
  style,
}: {
  title: string
  children: ReactNode
  action?: ReactNode
  style?: StyleProp<ViewStyle>
}) {
  return (
    <View style={[{ gap: space.md }, style]}>
      <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text variant="section">{title}</Text>
        {action}
      </View>
      {children}
    </View>
  )
}

/** Screen title block: serif headline with an optional italic lead */
export function ScreenTitle({ title, lead, kicker }: { title: string; lead?: string; kicker?: ReactNode }) {
  return (
    <View style={{ gap: space.sm }}>
      {kicker}
      <Text variant="display">{title}</Text>
      {lead && <Text variant="lead">{lead}</Text>}
    </View>
  )
}
