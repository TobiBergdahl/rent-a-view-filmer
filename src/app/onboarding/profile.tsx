// Onboarding step 2 of 4: profile details and the optional tour guide licence
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { Pressable, View } from 'react-native'

import { LicenceCard } from '@/components/filmer'
import { TextField } from '@/components/layout'
import { OnboardingScreen } from '@/components/onboarding'
import { Avatar, Button, Icon, Text } from '@/components/ui'
import { useStore } from '@/state/store'
import { colors, space } from '@/theme'

export default function ProfileStep() {
  const { draft, updateDraft } = useStore()
  if (!draft) return null

  // Prototype: the photo stays in memory. Production: upload to storage.
  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (!result.canceled) updateDraft({ photo: result.assets[0].uri })
  }

  return (
    <OnboardingScreen
      step={2}
      title="Add your profile details"
      lead="This is what travellers see when you take their request."
      footer={
        <>
          <Button onPress={() => router.push('/onboarding/payout')}>Continue</Button>
          <Text variant="caption" color={colors.muted} style={{ textAlign: 'center' }}>
            You can change your profile later.
          </Text>
        </>
      }>
      <Pressable
        accessibilityLabel={draft.photo ? 'Change profile photo' : 'Add a profile photo'}
        accessibilityRole="button"
        onPress={pickPhoto}
        style={({ pressed }) => ({
          alignItems: 'center',
          flexDirection: 'row',
          gap: space.base,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        })}>
        {draft.photo ? (
          <Avatar name={draft} photo={draft.photo} size={72} />
        ) : (
          <View
            style={{
              alignItems: 'center',
              backgroundColor: colors.canvas,
              borderRadius: 36,
              height: 72,
              justifyContent: 'center',
              width: 72,
            }}>
            <Icon name="camera" size={24} color={colors.muted} />
          </View>
        )}
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="title">{draft.photo ? 'Change photo' : 'Add a profile photo'}</Text>
          <Text variant="bodySmall" color={colors.muted}>
            A clear, friendly face helps travellers trust you.
          </Text>
        </View>
      </Pressable>

      <View style={{ gap: space.base }}>
        <View style={{ flexDirection: 'row', gap: space.md }}>
          <TextField label="First name" value={draft.firstName} onChangeText={(firstName) => updateDraft({ firstName })} style={{ flex: 1 }} />
          <TextField label="Last name" value={draft.lastName} onChangeText={(lastName) => updateDraft({ lastName })} style={{ flex: 1 }} />
        </View>
        <TextField
          label="Bio"
          multiline
          value={draft.bio}
          onChangeText={(bio) => updateDraft({ bio })}
          placeholder="Where you’re from, what you know well, how you film"
        />
      </View>

      <LicenceCard licence={draft.guideLicence} onChange={(guideLicence) => updateDraft({ guideLicence })} />
    </OnboardingScreen>
  )
}
