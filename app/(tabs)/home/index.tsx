import { Stack } from 'expo-router';
import { FitnessTimeline } from '~/components/FitnessJourney';
import { sampleFitnessJourney, sampleFitnessStats } from '~/components/FitnessJourney/data';
import { ScreenContent } from '~/components/ScreenContent';
import TimelineWrapper from '~/components/Timeline';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      {/* <ScreenContent path="app/(tabs)/home/index.tsx" title="Home" /> */}
      <FitnessTimeline
        goals={sampleFitnessJourney}
        stats={sampleFitnessStats}
        onAddGoal={() => {}}
        onEditGoal={() => {}}
      />
    </>
  );
}
