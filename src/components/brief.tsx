// The brief, shown the same way on the request, the job and the done screens
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { clock, day, hourLabel, WORK_FROM, WORK_TO } from '@/lib/time'
import { colors, fonts, radius, raised, space } from '@/theme'
import type { Request } from '@/types'

import { Avatar, Icon, IconTile, Text } from './ui'

/** `onToggle` makes each item tappable, to tick it off while filming */
export function ShotList({
  request,
  captured,
  onToggle,
}: {
  request: Request
  captured?: Set<string>
  onToggle?: (shotId: string) => void
}) {
  return (
    <View style={{ gap: space.sm }}>
      {request.shots.map((shot, i) => {
        const done = captured?.has(shot.id)
        return (
          <Pressable
            key={shot.id}
            disabled={!onToggle}
            accessibilityRole={onToggle ? 'checkbox' : undefined}
            accessibilityState={onToggle ? { checked: !!done } : undefined}
            onPress={() => onToggle?.(shot.id)}
            style={{ alignItems: 'flex-start', flexDirection: 'row', gap: space.md }}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: done ? colors.ink : colors.canvas,
                borderColor: done ? colors.ink : colors.hairline,
                borderRadius: 6,
                borderWidth: 1,
                height: 20,
                justifyContent: 'center',
                width: 20,
              }}>
              {done ? (
                <Icon name="checkmark" size={12} color={colors.white} weight="bold" />
              ) : (
                <Text variant="captionStrong" color={colors.muted}>
                  {i + 1}
                </Text>
              )}
            </View>
            <Text
              variant="bodySmall"
              color={done ? colors.muted : colors.ink}
              style={{ flex: 1, textDecorationLine: done ? 'line-through' : 'none' }}>
              {shot.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

/** Everything the traveler asked for, in one white card: their doubt, the brief and the shots */
/**
 * `firstTime`: show the "honest answer" note, only until the filmer has finished a job.
 * `collapsible`: start closed, showing only the question, with a toggle for the rest.
 */
export function BriefBlocks({
  request,
  captured,
  firstTime,
  collapsible,
}: {
  request: Request
  captured?: Set<string>
  firstTime?: boolean
  collapsible?: boolean
}) {
  const t = request.traveller
  const [open, setOpen] = useState(!collapsible)
  return (
    <View style={[{ backgroundColor: colors.canvas, borderRadius: radius.md, gap: space.lg, padding: 20 }, raised]}>
      <View style={{ gap: space.md }}>
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: space.md }}>
          <Avatar name={t} photo={t.photo} size={36} />
          <Text variant="label" style={{ flex: 1 }}>
            {t.firstName} {t.lastName[0]}. wants to know
          </Text>
        </View>
        <Text variant="headline" style={{ fontFamily: fonts.serifItalic, fontSize: 24, lineHeight: 30 }}>
          “{request.doubt}”
        </Text>
      </View>
      {collapsible && (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          hitSlop={8}
          onPress={() => setOpen(!open)}
          style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}>
          <Text variant="label" color={colors.muted}>
            {open ? 'Hide the brief' : 'Show the brief'}
          </Text>
          <Icon name={open ? 'chevron.up' : 'chevron.down'} size={12} color={colors.muted} />
        </Pressable>
      )}
      {open && (
      <>
      <View style={{ backgroundColor: colors.hairlineSoft, height: 1 }} />
      <View style={{ gap: space.sm }}>
        <Text variant="section">The brief</Text>
        <Text variant="bodySmall" color={colors.body}>
          {request.brief}
        </Text>
      </View>
      <View style={{ gap: space.md }}>
        <Text variant="section">{request.mode === 'live' ? 'Show during the call' : 'What to capture'}</Text>
        <ShotList request={request} captured={captured} />
      </View>
      <View style={{ alignItems: 'flex-start', flexDirection: 'row', gap: space.sm }}>
        <Icon name="eye" size={14} color={colors.muted} style={{ marginTop: 3 }} />
        <Text variant="caption" color={colors.muted} style={{ flex: 1 }}>
          You check everything visible from public space. You can’t enter the property.
        </Text>
      </View>
      </>
      )}
      {firstTime && (
        <Text variant="caption" color={colors.muted}>
          Your job is an honest answer. If it’s a “don’t book”, that’s a success too.
        </Text>
      )}
    </View>
  )
}

/** Live time slot or recorded deadline */
/** `raised` makes it white: the thing to act on next on a job's screen */
export function WhenCard({ request, raised: isRaised }: { request: Request; raised?: boolean }) {
  const live = request.mode === 'live'
  const at = live ? request.start! : request.deadline!
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: isRaised ? colors.canvas : colors.card,
        ...(isRaised ? raised : {}),
        borderRadius: radius.md,
        flexDirection: 'row',
        gap: space.base,
        padding: 20,
      }}>
      <IconTile name={live ? 'video.fill' : 'calendar'} size={48} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="caption" color={colors.muted}>
          {live ? 'Live call starts' : 'Deliver the video by'}
        </Text>
        <Text variant="titleLarge">
          {day(at)}, {clock(at)}
        </Text>
        <Text variant="caption" color={colors.muted}>
          {live
            ? `${request.minutes} min · ${request.talk ? `${request.traveller.firstName} talks and guides you` : 'Watch only, no talking'}`
            : `Film within working hours, ${hourLabel(WORK_FROM)}–${hourLabel(WORK_TO)} Croatian time`}
        </Text>
      </View>
    </View>
  )
}
