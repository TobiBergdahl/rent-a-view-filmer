import { router } from 'expo-router'
import { useMemo, useRef, useState } from 'react'
import { Pressable, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native'
import MapView from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { RequestCard } from '@/components/cards'
import { croatiaRegion, FilmerDot, PayoutMarker, regionAround } from '@/components/maps'
import { Icon, IconTile, RoundButton, Text } from '@/components/ui'
import { areas } from '@/data/seed'
import { metresBetween } from '@/lib/geo'
import { clock, now } from '@/lib/time'
import { useStore } from '@/state/store'
import { colors, radius, shadow, space } from '@/theme'

type View_ = 'list' | 'map'

// A small local touch: good morning / good afternoon / good evening
const greeting = () => {
  const hour = Number(clock(now()).slice(0, 2))
  return hour < 12 ? 'Dobro jutro' : hour < 18 ? 'Dobar dan' : 'Dobra večer'
}

export default function Requests() {
  const insets = useSafeAreaInsets()
  const { filmer, requests } = useStore()
  const [mode, setMode] = useState<View_>('list')
  const map = useRef<MapView>(null)

  // The filmer's area stands in for their GPS position in the prototype
  const here = areas[filmer!.area].centre
  const sorted = useMemo(
    () =>
      requests
        .map((request) => ({ request, distance: metresBetween(here, request.place.position) }))
        .sort((a, b) => a.distance - b.distance),
    [requests, here],
  )
  const open = (id: string) => router.push(`/request/${id}`)

  // Airbnb-style floating pill, 24pt above the tab bar, switches between list and map
  const toggle = (
    <ViewToggle
      mode={mode}
      onPress={() => setMode(mode === 'list' ? 'map' : 'list')}
      style={{ bottom: insets.bottom + 23 }}
    />
  )

  if (mode === 'map') {
    return (
      <View style={{ backgroundColor: colors.page, flex: 1 }}>
        <View style={{ flex: 1 }}>
          <MapView
            ref={map}
            style={{ flex: 1 }}
            initialRegion={croatiaRegion}
            userInterfaceStyle="light"
            showsPointsOfInterests={false}
            rotateEnabled={false}
            pitchEnabled={false}
            // Frame all open requests and the filmer, clear of the floating controls
            onMapReady={() =>
              map.current?.fitToCoordinates(
                [here, ...sorted.map((item) => item.request.place.position)].map(([latitude, longitude]) => ({
                  latitude,
                  longitude,
                })),
                { animated: false, edgePadding: { top: insets.top + 80, right: 48, bottom: insets.bottom + 160, left: 48 } },
              )
            }>
            <FilmerDot position={here} />
            {sorted.map(({ request }) => (
              <PayoutMarker
                key={request.id}
                position={request.place.position}
                payout={request.payout}
                live={request.mode === 'live'}
                // Straight to the request and its brief
                onPress={() => open(request.id)}
              />
            ))}
          </MapView>
          <RoundButton
            icon="location.fill"
            label="Show my area"
            onPress={() => map.current?.animateToRegion(regionAround(here, 0.12), 400)}
            style={{ position: 'absolute', right: 16, top: insets.top + space.sm }}
          />
        </View>
        {toggle}
      </View>
    )
  }

  return (
    <View style={{ backgroundColor: colors.page, flex: 1 }}>
    <ScrollView contentInsetAdjustmentBehavior="never" contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}>
      <View style={{ gap: 2, paddingHorizontal: 20, paddingTop: insets.top + space.sm }}>
        <Text variant="lead" style={{ fontSize: 16, lineHeight: 20 }}>
          {greeting()}, {filmer!.firstName}
        </Text>
        <Text variant="display">Nearby requests</Text>
      </View>
      <View style={{ gap: space.xl, paddingHorizontal: 20, paddingTop: space.lg }}>
        {sorted.map(({ request, distance }) => (
          <RequestCard key={request.id} request={request} distance={distance} onPress={() => open(request.id)} />
        ))}
        {sorted.length === 0 && (
          <View style={{ alignItems: 'center', gap: space.md, paddingVertical: space.xxl }}>
            <IconTile name="sun.max" size={56} />
            <Text variant="headline">All caught up</Text>
            <Text variant="body" color={colors.muted} style={{ textAlign: 'center' }}>
              New requests near you show up here.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
    {toggle}
    </View>
  )
}

function ViewToggle({ mode, onPress, style }: { mode: View_; onPress: () => void; style?: StyleProp<ViewStyle> }) {
  const toMap = mode === 'list'
  return (
    <View pointerEvents="box-none" style={[{ alignItems: 'center', left: 0, position: 'absolute', right: 0 }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={toMap ? 'Show map' : 'Show list'}
        onPress={onPress}
        style={({ pressed }) => [
          {
            alignItems: 'center',
            backgroundColor: colors.ink,
            borderRadius: radius.pill,
            flexDirection: 'row',
            gap: 8,
            paddingHorizontal: 18,
            paddingVertical: 12,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
          shadow,
        ]}>
        <Text variant="label" color={colors.white}>
          {toMap ? 'Map' : 'List'}
        </Text>
        <Icon name={toMap ? 'map.fill' : 'list.bullet'} size={14} color={colors.white} />
      </Pressable>
    </View>
  )
}
