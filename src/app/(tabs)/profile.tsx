// Profile: what travelers see first, with editing and settings behind
// simple rows instead of always-open forms.
import * as ImagePicker from 'expo-image-picker'
import { useState, type ReactNode } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { FilmerBadges, LicenceCard, PayoutOption, payoutOptions } from '@/components/filmer'
import { Sheet, TextField } from '@/components/layout'
import { Avatar, Button, Divider, Icon, PrototypeTag, RoundButton, Stars, Text, TextButton } from '@/components/ui'
import { useStore } from '@/state/store'
import { colors, radius, raised, space } from '@/theme'
import type { PayoutMethod } from '@/types'

const payoutMethods: PayoutMethod[] = ['bank', 'paypal', 'wise']

export default function Profile() {
  const insets = useSafeAreaInsets()
  const { filmer, jobs, updateFilmer, signOut } = useStore()
  const f = filmer!
  const done = jobs.filter((j) => j.status === 'completed').length
  const [sheet, setSheet] = useState<'edit' | 'licence' | 'payout' | 'email' | null>(null)
  // Drafts for the payout and email sheets, saved only on "Save"
  const [method, setMethod] = useState<PayoutMethod>(f.payout?.method ?? 'bank')
  const [email, setEmail] = useState(f.email)
  const openPayout = () => {
    setMethod(f.payout?.method ?? 'bank')
    setSheet('payout')
  }
  const openEmail = () => {
    setEmail(f.email)
    setSheet('email')
  }
  // Prototype: switching method just stores it. Production: re-run the
  // provider's connect flow (as in onboarding) before saving.
  const savePayout = () => {
    const option = payoutOptions[method]
    updateFilmer({ payout: { method, provider: option.provider, detail: option.detail(f.email) } })
    setSheet(null)
  }

  // Prototype: the photo stays on the device, in memory. Production: upload to storage.
  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (!result.canceled) updateFilmer({ photo: result.assets[0].uri })
  }

  const licence = f.guideLicence
  const licenceValue = licence?.status === 'verified' ? 'Verified' : licence ? 'In review' : 'Add'

  return (
    <View style={{ backgroundColor: colors.page, flex: 1 }}>
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{ gap: space.xl, padding: 20, paddingBottom: insets.bottom + 96, paddingTop: insets.top + space.sm }}>
        {/* What travelers see */}
        <View
          style={[
            { alignItems: 'center', backgroundColor: colors.canvas, borderRadius: radius.lg, gap: space.md, padding: space.lg },
            raised,
          ]}>
          <View style={{ position: 'absolute', right: space.lg, top: space.lg }}>
            <TextButton onPress={() => setSheet('edit')}>Edit</TextButton>
          </View>
          <Pressable accessibilityLabel="Change profile photo" accessibilityRole="button" onPress={pickPhoto}>
            <Avatar name={f} photo={f.photo} size={112} />
            <View style={{ bottom: 0, position: 'absolute', right: 0 }}>
              <RoundButton icon="camera.fill" label="Change profile photo" onPress={pickPhoto} />
            </View>
          </Pressable>
          <Text variant="display">
            {f.firstName} {f.lastName}
          </Text>
          <FilmerBadges filmer={f} showPending />
          <View style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}>
            {f.ratingCount ? (
              <>
                <Stars value={f.ratingAverage} size={12} />
                <Text variant="bodySmall" color={colors.muted}>
                  {f.ratingAverage.toFixed(1)} · {f.ratingCount} reviews · {done} jobs
                </Text>
              </>
            ) : (
              <Text variant="bodySmall" color={colors.muted}>
                New walker · no reviews yet
              </Text>
            )}
          </View>
          {f.bio ? (
            <Text variant="bodySmall" color={colors.body} style={{ textAlign: 'center' }}>
              {f.bio}
            </Text>
          ) : null}
        </View>

        {/* Settings as plain rows */}
        <View>
          <Row label="Tour guide licence" value={licenceValue} onPress={() => setSheet('licence')} />
          <Divider />
          <Row label="Payouts" value={f.payout ? f.payout.provider : 'Add'} detail={f.payout?.detail} onPress={openPayout} />
          <Divider />
          <Row label="Email" value={f.email} onPress={openEmail} />
        </View>

        <Button variant="secondary" icon="rectangle.portrait.and.arrow.right" onPress={signOut}>
          Sign out
        </Button>
      </ScrollView>

      <Sheet visible={sheet === 'edit'} onClose={() => setSheet(null)}>
        <Text variant="headline">Edit profile</Text>
        <View style={{ flexDirection: 'row', gap: space.md }}>
          <TextField label="First name" value={f.firstName} onChangeText={(firstName) => updateFilmer({ firstName })} style={{ flex: 1 }} />
          <TextField label="Last name" value={f.lastName} onChangeText={(lastName) => updateFilmer({ lastName })} style={{ flex: 1 }} />
        </View>
        <TextField
          label="Bio"
          multiline
          value={f.bio}
          onChangeText={(bio) => updateFilmer({ bio })}
          placeholder="What travelers should know about you"
        />
        <Button onPress={() => setSheet(null)}>Done</Button>
      </Sheet>

      <Sheet visible={sheet === 'licence'} onClose={() => setSheet(null)}>
        <LicenceCard licence={licence} onChange={(guideLicence) => updateFilmer({ guideLicence })} />
        {licence?.status === 'pending' && (
          <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.sm }}>
            <PrototypeTag />
            <TextButton onPress={() => updateFilmer({ guideLicence: { ...licence, status: 'verified' } })}>
              Simulate: licence approved
            </TextButton>
          </View>
        )}
        <Button onPress={() => setSheet(null)}>Done</Button>
      </Sheet>

      <Sheet visible={sheet === 'payout'} onClose={() => setSheet(null)}>
        <Text variant="headline">How you get paid</Text>
        <View accessibilityRole="radiogroup" style={{ gap: space.sm }}>
          {payoutMethods.map((m) => (
            <PayoutOption key={m} method={m} selected={m === method} onPress={() => setMethod(m)} />
          ))}
        </View>
        <Button onPress={savePayout}>Save</Button>
      </Sheet>

      <Sheet visible={sheet === 'email'} onClose={() => setSheet(null)}>
        <Text variant="headline">Email</Text>
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <Button
          disabled={!email.includes('@')}
          onPress={() => {
            updateFilmer({ email: email.trim() })
            setSheet(null)
          }}>
          Save
        </Button>
      </Sheet>
    </View>
  )
}

function Row({
  label,
  value,
  detail,
  onPress,
}: {
  label: string
  value: string
  detail?: string
  onPress?: () => void
}) {
  const content: ReactNode = (
    <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.md, paddingVertical: space.base }}>
      <Text variant="bodySmall" style={{ flex: 1 }}>
        {label}
      </Text>
      <View style={{ alignItems: 'flex-end', flexShrink: 1 }}>
        <Text variant="bodySmall" color={colors.muted} numberOfLines={1}>
          {value}
        </Text>
        {detail && (
          <Text variant="caption" color={colors.mutedSoft} numberOfLines={1}>
            {detail}
          </Text>
        )}
      </View>
      {onPress && <Icon name="chevron.right" size={12} color={colors.mutedSoft} />}
    </View>
  )
  if (!onPress) return content
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
      {content}
    </Pressable>
  )
}
