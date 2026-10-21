// Onboarding done: profile is live and payouts are set up
import { View } from 'react-native'

import { PayoutTile, TravellerPreview } from '@/components/filmer'
import { OnboardingScreen } from '@/components/onboarding'
import { Button, Fact, Notice, Text } from '@/components/ui'
import { useStore } from '@/state/store'
import { colors, space } from '@/theme'

export default function OnboardingDone() {
  const { draft, finishOnboarding } = useStore()
  if (!draft) return null
  const payout = draft.payout

  return (
    <OnboardingScreen
      step="done"
      back={false}
      title="You’re all set"
      lead={`Welcome to Rent A View, ${draft.firstName}. Here’s how travelers will see you.`}
      footer={
        // The root layout switches to the app once the filmer is signed in
        <Button onPress={finishOnboarding}>See nearby requests</Button>
      }>
      <TravellerPreview filmer={draft} />

      {/* Said once, here, instead of on every request */}
      <Notice icon="hand.thumbsup">
        Your job is an honest answer. If the place isn’t what the traveler hoped and they don’t book, that’s a success too.
      </Notice>

      {draft.guideLicence?.status === 'pending' && (
        <Notice icon="flag">
          We’re checking your tour guide licence. Once it’s approved, travelers see the “Licensed tour guide” badge.
        </Notice>
      )}

      {payout && (
        <View style={{ gap: space.base }}>
          <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.md }}>
            <PayoutTile method={payout.method} />
            <View style={{ flex: 1 }}>
              <Text variant="title">{payout.provider}</Text>
              <Text variant="caption" color={colors.muted} numberOfLines={1}>
                {payout.detail}
              </Text>
            </View>
          </View>
          <Fact label="Status" value="Connected" />
        </View>
      )}

      <Text variant="caption" color={colors.muted} style={{ textAlign: 'center' }}>
        You can change your profile and payout method any time in Profile.
      </Text>
    </OnboardingScreen>
  )
}
