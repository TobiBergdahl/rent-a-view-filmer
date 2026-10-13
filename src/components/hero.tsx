// Fixed photo header with a content sheet that scrolls over it. Shared by the
// request and job screens:
// - the photo stays put and stretches from its top edge when pulled down
// - the back button fades out as you scroll into the content
// - a page-coloured strip fades in behind the status bar once the photo is gone
import { Image } from 'expo-image'
import type { ReactNode } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors, radius, space } from '@/theme'

import { BackButton } from './ui'

// How far the sheet's rounded top overlaps the photo
const OVERLAP = 28

export function useHero(photoHeight: number) {
  const insets = useSafeAreaInsets()
  const scrollY = useSharedValue(0)
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y
  })
  const photoStyle = useAnimatedStyle(() => ({
    height: photoHeight + Math.max(0, -scrollY.value),
  }))
  const backStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 120], [1, 0], Extrapolation.CLAMP),
    pointerEvents: scrollY.value > 100 ? 'none' : 'auto',
  }))
  const gone = photoHeight - OVERLAP - insets.top
  const barStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [gone - 24, gone], [0, 1], Extrapolation.CLAMP),
  }))
  return { onScroll, photoStyle, backStyle, barStyle, photoHeight }
}

type Hero = ReturnType<typeof useHero>

/** The fixed photo; render before the scroll view */
export function HeroPhoto({ hero, photo }: { hero: Hero; photo?: string }) {
  return (
    <Animated.View style={[{ left: 0, overflow: 'hidden', position: 'absolute', right: 0, top: 0 }, hero.photoStyle]}>
      <Image source={photo} style={{ flex: 1 }} contentFit="cover" transition={200} />
    </Animated.View>
  )
}

/** Scroll view with a window onto the photo, then the content on a sheet */
export function HeroScroll({
  hero,
  children,
  sheetStyle,
}: {
  hero: Hero
  children: ReactNode
  sheetStyle?: StyleProp<ViewStyle>
}) {
  return (
    <Animated.ScrollView onScroll={hero.onScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingBottom: space.xl }}>
      <View style={{ height: hero.photoHeight }} />
      <View
        style={[
          {
            backgroundColor: colors.page,
            borderTopLeftRadius: radius.lg,
            borderTopRightRadius: radius.lg,
            gap: space.lg,
            marginTop: -OVERLAP,
            padding: 20,
            paddingTop: space.lg,
          },
          sheetStyle,
        ]}>
        {children}
      </View>
    </Animated.ScrollView>
  )
}

/** Back button and status-bar strip; render after the scroll view */
export function HeroChrome({ hero }: { hero: Hero }) {
  const insets = useSafeAreaInsets()
  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[{ backgroundColor: colors.page, height: insets.top, left: 0, position: 'absolute', right: 0, top: 0 }, hero.barStyle]}
      />
      <Animated.View style={[{ left: 20, position: 'absolute', top: insets.top + space.sm }, hero.backStyle]}>
        <BackButton />
      </Animated.View>
    </>
  )
}
