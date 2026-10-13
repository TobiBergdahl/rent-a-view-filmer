import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'

import { StoreProvider, useStore } from '@/state/store'
import { colors, fonts } from '@/theme'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    [fonts.display]: require('@/assets/fonts/FrauncesSoft-Display.ttf'),
    [fonts.serif]: require('@/assets/fonts/FrauncesSoft-Medium.ttf'),
    [fonts.serifSemiBold]: require('@/assets/fonts/FrauncesSoft-SemiBold.ttf'),
    [fonts.serifItalic]: require('@/assets/fonts/FrauncesSoft-Italic.ttf'),
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  })

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync()
  }, [loaded, error])

  if (!loaded && !error) return null

  return (
    <StoreProvider>
      <StatusBar style="dark" />
      <Routes />
    </StoreProvider>
  )
}

function Routes() {
  const { filmer } = useStore()
  const signedIn = !!filmer
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.page } }}>
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="onboarding/profile" />
        <Stack.Screen name="onboarding/payout" />
        <Stack.Screen name="onboarding/connect" />
        <Stack.Screen name="onboarding/done" options={{ gestureEnabled: false }} />
      </Stack.Protected>
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="request/[id]" />
        <Stack.Screen name="job/[id]" />
        {/* Camera and call take over the whole screen */}
        <Stack.Screen
          name="record/[id]"
          options={{ presentation: 'fullScreenModal', contentStyle: { backgroundColor: colors.camera } }}
        />
        <Stack.Screen
          name="live/[id]"
          options={{ presentation: 'fullScreenModal', contentStyle: { backgroundColor: colors.camera } }}
        />
        <Stack.Screen name="done/[id]" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
        <Stack.Screen
          name="paid/[id]"
          options={{ presentation: 'fullScreenModal', animation: 'fade', contentStyle: { backgroundColor: colors.ink } }}
        />
      </Stack.Protected>
    </Stack>
  )
}
