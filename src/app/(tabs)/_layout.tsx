import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { View } from 'react-native'

import { JobReminder } from '@/components/reminder'

import { useStore } from '@/state/store'
import { colors, fonts } from '@/theme'

const ICON = 28

/**
 * Tab bar image for the profile photo. Unsplash photos are cut into a circle
 * by imgix (`mask=ellipse`); photos picked on the device are square-cropped
 * already and shown as they are. Production: serve a round thumbnail from storage.
 */
function tabAvatar(photo: string | undefined) {
  if (!photo) return null
  const uri = photo.includes('images.unsplash.com')
    ? `${photo.split('?')[0]}?auto=format&fit=crop&crop=faces&w=${ICON}&h=${ICON}&dpr=3&mask=ellipse&fm=png`
    : photo
  return { uri, width: ICON, height: ICON, scale: 3 }
}

export default function TabsLayout() {
  const { jobs, filmer } = useStore()
  const avatar = tabAvatar(filmer?.photo)
  const active = jobs.filter((job) => job.status === 'scheduled' || job.status === 'live').length
  return (
    <View style={{ flex: 1 }}>
    <NativeTabs
      tintColor={colors.ink}
      labelStyle={{ fontFamily: fonts.sansMedium, fontSize: 12 }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Requests</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' }} md="map" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="jobs">
        <NativeTabs.Trigger.Label>Jobs</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'video', selected: 'video.fill' }} md="videocam" />
        {active > 0 && <NativeTabs.Trigger.Badge>{String(active)}</NativeTabs.Trigger.Badge>}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="earnings">
        <NativeTabs.Trigger.Label>Earnings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'eurosign.circle', selected: 'eurosign.circle.fill' }} md="euro" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        {avatar ? (
          // The filmer's own photo, kept in colour (not tinted like the other icons)
          <NativeTabs.Trigger.Icon src={avatar} renderingMode="original" />
        ) : (
          <NativeTabs.Trigger.Icon sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }} md="person" />
        )}
      </NativeTabs.Trigger>
    </NativeTabs>
    {/* Floats above every tab when a job is about to start */}
    <JobReminder />
    </View>
  )
}
