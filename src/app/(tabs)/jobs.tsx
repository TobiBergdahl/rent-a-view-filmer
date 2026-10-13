import { router } from 'expo-router'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { JobCard } from '@/components/cards'
import { ScreenTitle, Section } from '@/components/layout'
import { Button, IconTile, Text } from '@/components/ui'
import { useStore } from '@/state/store'
import { colors, space } from '@/theme'
import type { Job } from '@/types'

const when = (job: Job) => job.request.start ?? job.request.deadline ?? 0

export default function Jobs() {
  const insets = useSafeAreaInsets()
  const { jobs } = useStore()
  const upcoming = jobs.filter((j) => j.status === 'scheduled' || j.status === 'live').sort((a, b) => when(a) - when(b))
  const awaiting = jobs.filter((j) => j.status === 'awaiting')
  const completed = jobs
    .filter((j) => j.status === 'completed')
    .sort((a, b) => (b.releasedAt ?? 0) - (a.releasedAt ?? 0))
  const open = (job: Job) => router.push(`/job/${job.id}`)

  return (
    // Wrapped in a View so iOS doesn't add the top safe area to the scroll view a second time
    <View style={{ backgroundColor: colors.page, flex: 1 }}>
    <ScrollView contentInsetAdjustmentBehavior="never" contentContainerStyle={{ gap: space.xl, padding: 20, paddingBottom: insets.bottom + 96, paddingTop: insets.top + space.sm }}>
      <ScreenTitle title="Your jobs" lead="Go there, film it straight, get paid." />

      <Section title="Upcoming">
        {upcoming.length ? (
          upcoming.map((job) => <JobCard key={job.id} job={job} onPress={() => open(job)} inSection />)
        ) : (
          <View style={{ alignItems: 'center', backgroundColor: colors.card, borderRadius: 20, gap: space.md, padding: space.lg }}>
            <IconTile name="map" size={48} />
            <Text variant="body" color={colors.muted} style={{ textAlign: 'center' }}>
              Nothing scheduled. Pick up a request nearby.
            </Text>
            <Button compact variant="secondary" onPress={() => router.navigate('/')}>
              See requests
            </Button>
          </View>
        )}
      </Section>

      {awaiting.length > 0 && (
        <Section title="Awaiting acceptance">
          {awaiting.map((job) => (
            <JobCard key={job.id} job={job} onPress={() => open(job)} inSection />
          ))}
        </Section>
      )}

      {completed.length > 0 && (
        <Section title="Completed">
          {completed.map((job) => (
            <JobCard key={job.id} job={job} onPress={() => open(job)} inSection />
          ))}
        </Section>
      )}
    </ScrollView>
    </View>
  )
}
