import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { LogoMark } from '@/components/layout'
import { Button, ScreenStatusBar, Text, Wordmark } from '@/components/ui'
import { colors, radius, space } from '@/theme'

// The web landing page's filmer pitch, word for word
const steps = ['Choose nearby requests', 'Film what the traveler asks', 'Get paid after verification']

export default function Welcome() {
  const insets = useSafeAreaInsets()
  return (
    <View style={{ backgroundColor: colors.ink, flex: 1 }}>
      <ScreenStatusBar style="light" />
      <Image
        source={require('@/assets/images/welcome.jpg')}
        style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}
        contentFit="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.82)']}
        locations={[0, 0.25, 0.5, 0.85]}
        style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          paddingBottom: insets.bottom + space.base,
          paddingHorizontal: 24,
          paddingTop: insets.top + space.base,
        }}>
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.md }}>
          <LogoMark size={36} />
          <Wordmark color={colors.cream} size={20} />
          <View
            style={{
              backgroundColor: colors.accent,
              borderRadius: radius.pill,
              marginLeft: 'auto',
              paddingHorizontal: 10,
              paddingVertical: 3,
            }}>
            <Text variant="captionStrong">For filmers</Text>
          </View>
        </View>

        <View style={{ gap: space.lg }}>
          <Text variant="hero" color={colors.cream}>
            Be their eyes{'\n'}on the ground.
          </Text>
          <Text variant="lead" color={colors.cream} style={{ opacity: 0.9 }}>
            Travellers have a doubt. You go and look, honestly, and get paid for it.
          </Text>
          <View style={{ gap: space.sm }}>
            {steps.map((step, i) => (
              <View key={step} style={{ alignItems: 'center', flexDirection: 'row', gap: space.md }}>
                <View
                  style={{
                    alignItems: 'center',
                    borderColor: 'rgba(255,252,235,0.5)',
                    borderRadius: 14,
                    borderWidth: 1,
                    height: 28,
                    justifyContent: 'center',
                    width: 28,
                  }}>
                  <Text variant="captionStrong" color={colors.cream}>
                    {i + 1}
                  </Text>
                </View>
                <Text variant="body" color={colors.cream}>
                  {step}
                </Text>
              </View>
            ))}
          </View>
          <View style={{ gap: space.md, marginTop: space.sm }}>
            <Button variant="sunrise" onPress={() => router.push('/sign-up')}>
              Become a filmer
            </Button>
            <Button variant="ghostLight" onPress={() => router.push('/sign-in')}>
              Log in
            </Button>
          </View>
        </View>
      </View>
    </View>
  )
}
