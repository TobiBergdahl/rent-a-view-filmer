import { router } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ScreenTitle, TextField } from '@/components/layout'
import { BackButton, Button, PrototypeTag, Text, TextButton } from '@/components/ui'
import { signIn } from '@/services/auth'
import { useStore } from '@/state/store'
import { colors, space } from '@/theme'

export default function SignIn() {
  const insets = useSafeAreaInsets()
  const store = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setBusy(true)
    // The root layout's guard switches to the app once a filmer is set
    store.signIn(await signIn(email, password))
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ gap: space.lg, padding: 20, paddingTop: insets.top + space.sm }}>
        <BackButton />
        <ScreenTitle title="Welcome back" lead="Sign in to your walker account." />
        <View style={{ gap: space.base }}>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            secureTextEntry
            textContentType="password"
            onSubmitEditing={submit}
          />
          <Button loading={busy} onPress={submit}>
            Sign in
          </Button>
        </View>
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.sm }}>
          <PrototypeTag />
          <Text variant="caption" color={colors.muted} style={{ flex: 1 }}>
            Any email and password signs you in as Luka M.
          </Text>
        </View>
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
          <Text variant="bodySmall" color={colors.muted}>
            New here?
          </Text>
          <TextButton color={colors.muted} onPress={() => router.replace('/sign-up')}>
            Become a walker
          </TextButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
