// How a filmer is presented: trust badges, the traveler-facing preview,
// the tour guide licence card and payout options.
import { useState } from 'react'
import { ActionSheetIOS, Alert, Platform, Pressable, View } from 'react-native'

import { pickLicence, type LicenceSource } from '@/services/verification'
import { colors, fonts, radius, raised, space } from '@/theme'
import type { Filmer, GuideLicence, PayoutMethod } from '@/types'

import { Avatar, Button, Icon, Stars, Text, TextButton, type SymbolName } from './ui'

function Badge({ icon, label, tone }: { icon: SymbolName; label: string; tone: 'success' | 'accent' | 'neutral' }) {
  const bg = { success: colors.successTint, accent: colors.accent, neutral: colors.surfaceStrong }[tone]
  const fg = { success: colors.success, accent: colors.ink, neutral: colors.body }[tone]
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: bg,
        borderRadius: radius.pill,
        flexDirection: 'row',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}>
      <Icon name={icon} size={12} color={fg} />
      <Text variant="captionStrong" color={fg}>
        {label}
      </Text>
    </View>
  )
}

/** The badges travelers see. "Licensed tour guide" only once the licence is verified. */
export function FilmerBadges({ filmer, showPending }: { filmer: Filmer; showPending?: boolean }) {
  const licence = filmer.guideLicence
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {filmer.verified ? (
        <Badge icon="checkmark.seal.fill" label="Verified local" tone="success" />
      ) : (
        showPending && <Badge icon="hourglass" label="Verification pending" tone="neutral" />
      )}
      {licence?.status === 'verified' && <Badge icon="flag.fill" label="Licensed tour guide" tone="accent" />}
      {showPending && licence?.status === 'pending' && (
        <Badge icon="hourglass" label="Guide licence in review" tone="neutral" />
      )}
    </View>
  )
}

/** A preview of the filmer card travelers see when a filmer accepts their booking */
export function TravellerPreview({ filmer }: { filmer: Filmer }) {
  return (
    <View style={[{ backgroundColor: colors.canvas, borderRadius: radius.md, gap: space.md, padding: 20 }, raised]}>
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.md }}>
        <Avatar name={filmer} photo={filmer.photo} size={52} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text variant="title">
            {filmer.firstName} {filmer.lastName[0]}.
          </Text>
          {filmer.ratingCount ? (
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}>
              <Stars value={filmer.ratingAverage} size={12} />
              <Text variant="caption" color={colors.muted}>
                {filmer.ratingAverage.toFixed(1)} · {filmer.ratingCount} reviews
              </Text>
            </View>
          ) : (
            <Text variant="caption" color={colors.muted}>
              New local
            </Text>
          )}
        </View>
      </View>
      <FilmerBadges filmer={filmer} />
      {!!filmer.bio && (
        <Text variant="bodySmall" color={colors.body} numberOfLines={3}>
          {filmer.bio}
        </Text>
      )}
    </View>
  )
}

const licenceStatus = {
  none: { label: 'Not submitted', bg: colors.surfaceStrong, fg: colors.body },
  pending: { label: 'In review', bg: colors.warningTint, fg: colors.warning },
  verified: { label: 'Verified', bg: colors.successTint, fg: colors.success },
}

/** Optional tour guide licence upload (Blueprint: "Add your profile details") */
export function LicenceCard({
  licence,
  onChange,
}: {
  licence?: GuideLicence
  onChange: (licence: GuideLicence | undefined) => void
}) {
  const [busy, setBusy] = useState(false)
  const status = licenceStatus[licence?.status ?? 'none']
  const pick = async (source: LicenceSource) => {
    setBusy(true)
    const picked = await pickLicence(source)
    setBusy(false)
    if (picked) onChange(picked)
  }
  // A photo of the licence or a scanned PDF
  const upload = () => {
    const options = ['Choose a photo', 'Choose a file', 'Cancel']
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 2, title: 'Upload your tour guide licence' },
        (i) => i < 2 && pick(i === 0 ? 'photo' : 'file'),
      )
    } else {
      Alert.alert('Upload your tour guide licence', undefined, [
        { text: options[0], onPress: () => pick('photo') },
        { text: options[1], onPress: () => pick('file') },
        { text: options[2], style: 'cancel' },
      ])
    }
  }
  return (
    <View style={{ gap: space.base }}>
      <View style={{ flexDirection: 'row', gap: space.md }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.accent,
            borderRadius: radius.sm,
            height: 40,
            justifyContent: 'center',
            width: 40,
          }}>
          <Icon name="flag.fill" size={18} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="title">
            {licence?.status === 'verified' ? 'Licensed tour guide' : 'Are you a licensed tour guide?'}
          </Text>
          <Text variant="bodySmall" color={colors.muted}>
            {licence?.status === 'verified'
              ? 'Your licence is verified. Travelers see the badge on your profile.'
              : 'Upload your licence and travelers will see a “Licensed tour guide” badge on your profile. Optional.'}
          </Text>
        </View>
      </View>

      <View
        style={{
          alignItems: 'center',
          backgroundColor: colors.canvas,
          borderRadius: radius.sm,
          flexDirection: 'row',
          gap: space.md,
          padding: space.md,
        }}>
        <Icon name={licence ? 'doc.fill' : 'doc.badge.plus'} size={22} color={colors.body} />
        <View style={{ flex: 1 }}>
          <Text variant="label" numberOfLines={1}>
            {licence ? licence.fileName : 'Tour guide licence'}
          </Text>
          <Text variant="caption" color={colors.muted}>
            {licence ? 'Uploaded' : 'PDF, JPG or PNG, up to 10 MB'}
          </Text>
        </View>
        {licence ? (
          // Replace with a renewed licence (it goes back into review), or remove it
          <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.md }}>
            <TextButton color={colors.muted} onPress={() => onChange(undefined)}>
              Remove
            </TextButton>
            <Button compact variant="secondary" loading={busy} onPress={upload}>
              Replace
            </Button>
          </View>
        ) : (
          <Button compact loading={busy} onPress={upload}>
            Upload
          </Button>
        )}
      </View>

      <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.sm }}>
        <View style={{ backgroundColor: status.bg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 }}>
          <Text variant="captionStrong" color={status.fg}>
            {status.label}
          </Text>
        </View>
        <Text variant="caption" color={colors.muted} style={{ flex: 1 }}>
          {licence?.status === 'verified'
            ? 'Travelers see the badge. Replace it when you renew your licence.'
            : licence
              ? 'We check it within 2 working days.'
              : 'You can add it later from your profile.'}
        </Text>
      </View>
    </View>
  )
}

// --- Payouts (visual only, no provider connected) ---

export const payoutOptions: Record<
  PayoutMethod,
  { title: string; text: string; provider: string; detail: (email: string) => string; cta: string }
> = {
  bank: {
    title: 'Bank account',
    text: 'Paid in euros to your Croatian or EU bank account.',
    provider: 'Zagrebačka banka',
    detail: () => 'Current account ending in 4821',
    cta: 'Connect bank account',
  },
  paypal: {
    title: 'PayPal',
    text: 'Paid to your PayPal balance.',
    provider: 'PayPal',
    detail: (email) => email,
    cta: 'Connect PayPal',
  },
  wise: {
    title: 'Wise',
    text: 'Low fees, handy if you hold more than one currency.',
    provider: 'Wise',
    detail: () => 'EUR account',
    cta: 'Connect Wise',
  },
}

// Distinct marks per provider in their own colours. Placeholders for the
// providers' official logos, which need their brand assets and permission.
const payoutMarks: Record<PayoutMethod, { bg: string; fg: string; icon?: SymbolName; text?: string }> = {
  bank: { bg: colors.ink, fg: colors.white, icon: 'building.columns.fill' },
  paypal: { bg: '#003087', fg: '#ffffff', text: 'P' },
  wise: { bg: '#9fe870', fg: '#163300', text: 'W' },
}

export function PayoutTile({ method, size = 40 }: { method: PayoutMethod; size?: number }) {
  const mark = payoutMarks[method]
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: mark.bg,
        borderRadius: radius.sm,
        height: size,
        justifyContent: 'center',
        width: size,
      }}>
      {mark.icon ? (
        <Icon name={mark.icon} size={size * 0.45} color={mark.fg} />
      ) : (
        <Text variant="title" color={mark.fg} style={{ fontFamily: fonts.sansBold, fontSize: size * 0.45, lineHeight: size * 0.55 }}>
          {mark.text}
        </Text>
      )}
    </View>
  )
}

/** Selectable option card: white with a 2px ink outline when selected (DESIGN.md) */
export function PayoutOption({
  method,
  selected,
  onPress,
}: {
  method: PayoutMethod
  selected: boolean
  onPress: () => void
}) {
  const option = payoutOptions[method]
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        alignItems: 'center',
        backgroundColor: selected ? colors.canvas : 'transparent',
        borderColor: selected ? colors.ink : colors.hairline,
        borderRadius: radius.md,
        borderWidth: 2,
        flexDirection: 'row',
        gap: space.md,
        padding: space.base,
        transform: [{ scale: pressed ? 0.985 : 1 }],
      })}>
      <PayoutTile method={method} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="title">{option.title}</Text>
        <Text variant="bodySmall" color={colors.muted}>
          {option.text}
        </Text>
      </View>
      <View
        style={{
          borderColor: selected ? colors.ink : colors.hairline,
          borderRadius: 11,
          borderWidth: selected ? 7 : 2,
          height: 22,
          width: 22,
        }}
      />
    </Pressable>
  )
}
