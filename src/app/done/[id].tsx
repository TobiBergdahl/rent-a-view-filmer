// Blueprint: "Recording delivered" / call ended. Waiting for the traveller.
import { router, useLocalSearchParams } from 'expo-router'
import { ScrollView, View } from 'react-native'
import Animated, { ZoomIn } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ActionBar } from '@/components/layout'
import { Button, Divider, Fact, Icon, Text } from '@/components/ui'
import { euro } from '@/lib/money'
import { duration } from '@/lib/time'
import { useJob, useStore } from '@/state/store'
import { colors, space } from '@/theme'

export default function Done() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  const job = useJob(id)
  const { filmer } = useStore()
  if (!job) return null

  const r = job.request
  const live = r.mode === 'live'
  const name = r.traveller.firstName

  const backToJobs = () => {
    router.dismissAll()
    router.navigate('/jobs')
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ gap: space.lg, padding: 20, paddingTop: insets.top + space.xxl }}>
        <View style={{ alignItems: 'center', gap: space.md }}>
          <Animated.View
            entering={ZoomIn.springify().damping(14)}
            style={{ alignItems: 'center', backgroundColor: colors.successTint, borderRadius: 40, height: 80, justifyContent: 'center', width: 80 }}>
            <Icon name="checkmark" size={34} color={colors.success} weight="bold" />
          </Animated.View>
          <Text variant="display" style={{ textAlign: 'center' }}>
            Nice work, {filmer!.firstName}.{'\n'}Now it’s over to {name}.
          </Text>
        </View>

        {/* One sentence for what happens next, then the facts */}
        <Text variant="body" color={colors.body} style={{ textAlign: 'center', paddingHorizontal: space.base }}>
          {`${name} has 24 hours to review it. Your ${euro(r.payout)} is released when ${name} accepts, or automatically after 24 hours.`}
        </Text>

        <Divider style={{ marginHorizontal: 20 }} />

        <View style={{ gap: space.sm, paddingHorizontal: 20 }}>
          <Fact label="Place" value={r.place.title} />
          <Fact label="Type" value={live ? `Live call · ${duration(job.callSeconds ?? 0)}` : `Recorded · ${duration(job.video?.seconds ?? 0)}`} />
          <Fact label="Payout" value={euro(r.payout)} strong />
          <Fact label="Status" value="Pending" />
        </View>
      </ScrollView>
      <ActionBar>
        <Button onPress={backToJobs}>Back to jobs</Button>
      </ActionBar>
    </View>
  )
}
