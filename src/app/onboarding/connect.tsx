// Onboarding step 4 of 4: confirm the payout connection.
// Visual only: no payment provider is called. Production: redirect to the
// provider (bank, PayPal or Wise) via the payment platform's onboarding.
import * as Haptics from 'expo-haptics'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import { payoutOptions, PayoutTile } from '@/components/filmer'
import { OnboardingScreen } from '@/components/onboarding'
import { Button, Divider, Icon, PrototypeTag, Text, type SymbolName } from '@/components/ui'
import { useStore } from '@/state/store'
import { colors, space } from '@/theme'
import type { PayoutMethod } from '@/types'

const assurances: { icon: SymbolName; text: string }[] = [
  { icon: 'checkmark.shield', text: 'Your login stays with the provider. Rent A View never sees it.' },
  { icon: 'lock', text: 'Encrypted connection, used only to pay you.' },
  { icon: 'clock', text: 'Authorise once. Future payouts arrive automatically.' },
]

export default function ConnectStep() {
  const { method = 'bank' } = useLocalSearchParams<{ method?: PayoutMethod }>()
  const { draft, updateDraft } = useStore()
  const [busy, setBusy] = useState(false)
  if (!draft) return null
  const option = payoutOptions[method]
  const detail = option.detail(draft.email)

  const authorise = async () => {
    setBusy(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    updateDraft({ payout: { method, provider: option.provider, detail } })
    setBusy(false)
    router.push('/onboarding/done')
  }

  return (
    <OnboardingScreen
      step={4}
      title="Confirm your payout connection"
      lead={`We’ll send you to ${option.provider} to approve it.`}
      footer={
        <>
          <Button loading={busy} onPress={authorise}>
            Authorise connection
          </Button>
          <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.sm, justifyContent: 'center' }}>
            <PrototypeTag />
            <Text variant="caption" color={colors.muted}>
              Nothing is connected for real.
            </Text>
          </View>
        </>
      }>
      <View style={{ gap: space.base }}>
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.md }}>
          <PayoutTile method={method} size={48} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="title">{option.provider}</Text>
            <Text variant="bodySmall" color={colors.muted} numberOfLines={1}>
              {detail}
            </Text>
          </View>
        </View>
        <Divider />
        {assurances.map((a) => (
          <View key={a.text} style={{ alignItems: 'flex-start', flexDirection: 'row', gap: space.md }}>
            <Icon name={a.icon} size={16} color={colors.body} style={{ marginTop: 2 }} />
            <Text variant="bodySmall" color={colors.body} style={{ flex: 1 }}>
              {a.text}
            </Text>
          </View>
        ))}
      </View>
    </OnboardingScreen>
  )
}
