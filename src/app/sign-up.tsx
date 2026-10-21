// Onboarding step 1 of 5: account details
import { router } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import { TextField } from '@/components/layout'
import { OnboardingScreen } from '@/components/onboarding'
import { Button, Text, TextButton } from '@/components/ui'
import { signUp } from '@/services/auth'
import { useStore } from '@/state/store'
import { colors, space } from '@/theme'

// Prefilled for demos, like the web prototype's account form
const demo = { firstName: 'Ana', lastName: 'Kovač', email: 'ana.kovac@example.com' }

export default function SignUp() {
  const { draft, startDraft, updateDraft } = useStore()
  const [firstName, setFirstName] = useState(draft?.firstName ?? demo.firstName)
  const [lastName, setLastName] = useState(draft?.lastName ?? demo.lastName)
  const [email, setEmail] = useState(draft?.email ?? demo.email)
  const [busy, setBusy] = useState(false)
  const ready = firstName.trim() && lastName.trim() && email.includes('@')

  const submit = async () => {
    const details = { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() }
    if (draft) updateDraft(details)
    else {
      setBusy(true)
      startDraft(await signUp(details))
      setBusy(false)
    }
    router.push('/onboarding/profile')
  }

  return (
    <OnboardingScreen
      step={1}
      title="Create your walker account"
      lead="Your details first, then your profile and how you get paid."
      footer={
        <>
          <Button disabled={!ready} loading={busy} onPress={submit}>
            Continue
          </Button>
          <Text variant="caption" color={colors.muted} style={{ textAlign: 'center' }}>
            By continuing you agree to Rent A View’s terms and privacy policy.
          </Text>
        </>
      }>
      <View style={{ gap: space.base }}>
        <View style={{ flexDirection: 'row', gap: space.md }}>
          <TextField label="First name" value={firstName} onChangeText={setFirstName} style={{ flex: 1 }} textContentType="givenName" />
          <TextField label="Last name" value={lastName} onChangeText={setLastName} style={{ flex: 1 }} textContentType="familyName" />
        </View>
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        {!draft && (
          <TextField
            label="Password"
            secureTextEntry
            placeholder="Any password works in the prototype"
            textContentType="newPassword"
          />
        )}
      </View>
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
        <Text variant="bodySmall" color={colors.muted}>
          Already a walker?
        </Text>
        <TextButton color={colors.muted} onPress={() => router.replace('/sign-in')}>
          Sign in
        </TextButton>
      </View>
    </OnboardingScreen>
  )
}
