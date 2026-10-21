// Onboarding step 3 of 5: how to film respectfully. People in the footage
// have rights too (GDPR), and one careless clip can hurt the brand.
import { router } from 'expo-router'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { OnboardingScreen } from '@/components/onboarding'
import { Button, Icon, Text, type SymbolName } from '@/components/ui'
import { colors, radius, space } from '@/theme'

const rules: { icon: SymbolName; title: string; text: string }[] = [
  {
    icon: 'arrow.up.left.and.arrow.down.right',
    title: 'Keep it wide',
    text: 'Film beaches and streets in wide shots. Show the place, not the people in it.',
  },
  {
    icon: 'person.crop.circle.badge.xmark',
    title: 'No close-ups of people',
    text: 'Never zoom in on anyone, and don’t linger on a person who happens to be in the shot.',
  },
  {
    icon: 'eye.slash',
    title: 'No faces inside venues',
    text: 'In cafés, shops and lobbies, point the camera away from guests and staff.',
  },
  {
    icon: 'hand.raised',
    title: 'If someone asks, stop',
    text: 'If anyone asks you not to film them, stop and move on. Be friendly, always.',
  },
]

export default function RespectStep() {
  const [agreed, setAgreed] = useState(false)

  return (
    <OnboardingScreen
      step={3}
      title="How to film respectfully"
      lead="You film public places where people live and relax. Keep them out of it."
      footer={
        <Button disabled={!agreed} onPress={() => router.push('/onboarding/payout')}>
          Continue
        </Button>
      }>
      <View style={{ gap: space.lg }}>
        {rules.map((rule) => (
          <View key={rule.title} style={{ alignItems: 'flex-start', flexDirection: 'row', gap: space.md }}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: colors.surfaceStrong,
                borderRadius: radius.sm,
                height: 40,
                justifyContent: 'center',
                width: 40,
              }}>
              <Icon name={rule.icon} size={18} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text variant="title">{rule.title}</Text>
              <Text variant="bodySmall" color={colors.body}>
                {rule.text}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: agreed }}
        onPress={() => setAgreed(!agreed)}
        style={{ alignItems: 'center', flexDirection: 'row', gap: space.md, paddingVertical: space.sm }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: agreed ? colors.ink : colors.canvas,
            borderColor: agreed ? colors.ink : colors.hairline,
            borderRadius: 6,
            borderWidth: 1.5,
            height: 22,
            justifyContent: 'center',
            width: 22,
          }}>
          {agreed && <Icon name="checkmark" size={12} color={colors.white} weight="bold" />}
        </View>
        <Text variant="bodySmall" style={{ flex: 1 }}>
          I’ll respect people’s privacy when I film
        </Text>
      </Pressable>
    </OnboardingScreen>
  )
}
