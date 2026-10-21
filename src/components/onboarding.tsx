// Shared frame for the five onboarding steps (Blueprint: filmer onboarding)
import type { ReactNode } from 'react'
import { KeyboardAvoidingView, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors, space } from '@/theme'

import { ActionBar } from './layout'
import { BackButton, Kicker, Text } from './ui'

export const ONBOARDING_STEPS = 5

export function OnboardingScreen({
  step,
  title,
  lead,
  children,
  footer,
  back = true,
}: {
  step: number | 'done'
  title: string
  lead: string
  children: ReactNode
  footer: ReactNode
  back?: boolean
}) {
  const insets = useSafeAreaInsets()
  return (
    <KeyboardAvoidingView behavior="padding" style={{ backgroundColor: colors.page, flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ gap: space.lg, padding: 20, paddingBottom: space.xl, paddingTop: insets.top + space.sm }}>
        <View style={{ height: 40, justifyContent: 'center' }}>{back && <BackButton />}</View>
        <View style={{ gap: space.sm }}>
          <Kicker>{step === 'done' ? 'All done' : `Step ${step} of ${ONBOARDING_STEPS}`}</Kicker>
          <Text variant="display">{title}</Text>
          <Text variant="lead">{lead}</Text>
        </View>
        {children}
      </ScrollView>
      <ActionBar>{footer}</ActionBar>
    </KeyboardAvoidingView>
  )
}
