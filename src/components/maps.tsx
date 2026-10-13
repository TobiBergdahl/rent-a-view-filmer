// Map markers in the web app's style. Apple Maps on iOS via react-native-maps
// (works in Expo Go). The web uses OpenStreetMap tiles; both need a production
// tile/maps plan before launch.
import { View, type StyleProp, type ViewStyle } from 'react-native'
import MapView, { Marker, type Region } from 'react-native-maps'

import { euroShort } from '@/lib/money'
import { colors, radius, shadow, space } from '@/theme'
import type { LatLng } from '@/types'

import { Text } from './ui'

export const croatiaRegion: Region = {
  latitude: 44.35,
  longitude: 16.35,
  latitudeDelta: 4.6,
  longitudeDelta: 4.6,
}

export const regionAround = ([latitude, longitude]: LatLng, delta = 0.012): Region => ({
  latitude,
  longitude,
  latitudeDelta: delta,
  longitudeDelta: delta,
})

export const toCoord = ([latitude, longitude]: LatLng) => ({ latitude, longitude })

/** Ink teardrop with a white dot, anchored at its tip */
export function PinMark({ size = 30 }: { size?: number }) {
  return (
    <View style={{ alignItems: 'center', height: size * 1.25, width: size }}>
      <View
        style={{
          alignItems: 'center',
          backgroundColor: colors.ink,
          borderBottomLeftRadius: size / 2,
          borderTopLeftRadius: size / 2,
          borderTopRightRadius: size / 2,
          height: size,
          justifyContent: 'center',
          transform: [{ rotate: '45deg' }],
          width: size,
        }}>
        <View style={{ backgroundColor: colors.white, borderRadius: size / 6, height: size / 3, width: size / 3 }} />
      </View>
    </View>
  )
}

export function PlacePin({ position }: { position: LatLng }) {
  return (
    <Marker coordinate={toCoord(position)} centerOffset={{ x: 0, y: -18 }} anchor={{ x: 0.5, y: 1 }}>
      <PinMark />
    </Marker>
  )
}

/** The filmer's live position: white dot with a blue ring, as on the web map */
export function FilmerDot({ position }: { position: LatLng }) {
  return (
    <Marker coordinate={toCoord(position)} anchor={{ x: 0.5, y: 0.5 }}>
      <View
        style={{
          alignItems: 'center',
          backgroundColor: 'rgba(37,99,235,0.16)',
          borderRadius: 16,
          height: 32,
          justifyContent: 'center',
          width: 32,
        }}>
        <View
          style={{
            backgroundColor: colors.white,
            borderColor: colors.filmerRing,
            borderRadius: 8,
            borderWidth: 3,
            height: 16,
            width: 16,
          }}
        />
      </View>
    </Marker>
  )
}

/** Payout pill for the requests map. Live requests carry a red dot. */
export function PayoutMarker({
  position,
  payout,
  live,
  selected,
  onPress,
}: {
  position: LatLng
  payout: number
  live?: boolean
  selected?: boolean
  onPress: () => void
}) {
  return (
    <Marker coordinate={toCoord(position)} onPress={onPress} zIndex={selected ? 10 : 1}>
      <View
        style={[
          {
            alignItems: 'center',
            backgroundColor: selected ? colors.ink : colors.canvas,
            borderRadius: radius.pill,
            flexDirection: 'row',
            gap: 5,
            paddingHorizontal: 10,
            paddingVertical: 5,
            transform: [{ scale: selected ? 1.08 : 1 }],
          },
          shadow,
        ]}>
        {live && <View style={{ backgroundColor: colors.live, borderRadius: 4, height: 7, width: 7 }} />}
        <Text variant="captionStrong" color={selected ? colors.white : colors.ink} style={{ fontSize: 14 }}>
          {euroShort(payout)}
        </Text>
      </View>
    </Marker>
  )
}

/** Static map card with the place pin and, optionally, the filmer */
export function PlaceMap({
  position,
  filmer,
  height = 180,
  style,
  delta = 0.006,
}: {
  position: LatLng
  filmer?: LatLng
  height?: number
  style?: StyleProp<ViewStyle>
  delta?: number
}) {
  return (
    <View style={[{ borderRadius: radius.md, height, overflow: 'hidden' }, style]}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={regionAround(position, delta)}
        userInterfaceStyle="light"
        showsPointsOfInterests={false}
        pitchEnabled={false}
        rotateEnabled={false}>
        <PlacePin position={position} />
        {filmer && <FilmerDot position={filmer} />}
      </MapView>
    </View>
  )
}

export function MapLegend({ items }: { items: { label: string; mark: 'pin' | 'filmer' }[] }) {
  return (
    <View style={{ flexDirection: 'row', gap: space.base }}>
      {items.map((item) => (
        <View key={item.label} style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}>
          {item.mark === 'filmer' ? (
            <View
              style={{ borderColor: colors.filmerRing, borderRadius: 5, borderWidth: 2, height: 10, width: 10 }}
            />
          ) : (
            <View style={{ backgroundColor: colors.ink, borderRadius: 5, height: 10, width: 10 }} />
          )}
          <Text variant="caption" color={colors.muted}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  )
}
