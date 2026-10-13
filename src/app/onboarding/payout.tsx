// Onboarding step 3 of 4: choose a payout option (visual only)
import { router } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import { PayoutOption, payoutOptions } from '@/components/filmer'
import { OnboardingScreen } from '@/components/onboarding'
import { Button, Text } from '@/components/ui'
import { useStore } from '@/state/store'
import { colors, space } from '@/theme'
import type { PayoutMethod } from '@/types'

const methods: PayoutMethod[] = ['bank', 'paypal', 'wise']

export default function PayoutStep() {
  const { draft } = useStore()
  const [method, setMethod] = useState<PayoutMethod>(draft?.payout?.method ?? 'bank')

  return (
    <OnboardingScreen
      step={3}
      title="Choose how you get paid"
      lead="Money is released here once the traveller accepts your video."
      footer={
        <>
          <Button onPress={() => router.push({ pathname: '/onboarding/connect', params: { method } })}>
            {payoutOptions[method].cta}
          </Button>
          <Text variant="caption" color={colors.muted} style={{ textAlign: 'center' }}>
            Your payout details are encrypted and never shared with travellers.
          </Text>
        </>
      }>
      <View accessibilityRole="radiogroup" style={{ gap: space.md }}>
        {methods.map((m) => (
          <PayoutOption key={m} method={m} selected={m === method} onPress={() => setMethod(m)} />
        ))}
      </View>
    </OnboardingScreen>
  )
}
