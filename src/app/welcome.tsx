import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Logotype } from '@/components/layout'
import { Button, ScreenStatusBar, Text } from '@/components/ui'
import { colors, space } from '@/theme'

// The web landing page's filmer pitch, word for word
const steps = ['Choose nearby requests', 'Show what the traveler asks', 'Get paid after verification']

// The alley photo (1333×2000) is zoomed and pinned to the bottom edge, so the
// walker (55–73% down, 27–42% across) lands above the headline, not behind it
const PHOTO_ASPECT = 1333 / 2000
const PHOTO_ZOOM = 1.5
const PHOTO_FOCUS_X = 0.42

export default function Welcome() {
  const insets = useSafeAreaInsets()
  const screen = useWindowDimensions()
  const photoHeight = screen.height * PHOTO_ZOOM
  const photoWidth = photoHeight * PHOTO_ASPECT
  return (
    <View style={{ backgroundColor: colors.ink, flex: 1 }}>
      <ScreenStatusBar style="light" />
      <Image
        source={require('@/assets/images/welcome.jpg')}
        style={{
          bottom: 0,
          height: photoHeight,
          left: screen.width / 2 - photoWidth * PHOTO_FOCUS_X,
          position: 'absolute',
          width: photoWidth,
        }}
        contentFit="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.85)']}
        locations={[0, 0.2, 0.45, 0.75]}
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
        <View style={{ flexDirection: 'row' }}>
          <Logotype height={20} color={colors.cream} />
        </View>

        <View style={{ gap: space.lg }}>
          {/* Headline and lead read as one block, a step down from the hero size */}
          <View style={{ gap: space.sm }}>
            <Text variant="hero" color={colors.cream} style={{ fontSize: 38, letterSpacing: -1.2, lineHeight: 39 }}>
              Be their eyes{'\n'}on the ground.
            </Text>
            <Text variant="lead" color={colors.cream} style={{ opacity: 0.9 }}>
              Travelers have a doubt. You go and look, honestly, and get paid for it.
            </Text>
          </View>
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
              Become a walker
            </Button>
            <Button variant="ghostLight" onPress={() => router.push('/sign-in')}>
              Sign in to your walker account
            </Button>
          </View>
        </View>
      </View>
    </View>
  )
}
