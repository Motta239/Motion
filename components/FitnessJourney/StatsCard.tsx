import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Card, Colors } from 'react-native-ui-lib';
import { FitnessStats } from './types';

interface StatsCardProps {
  stats: FitnessStats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  return (
    <Card style={styles.card}>
      <View padding-15>
        <Text text60BO marginB-15>
          Fitness Statistics
        </Text>

        <View row spread marginB-15>
          <StatItem label="Streak" value={`${stats.streakDays} days`} icon="🔥" />
          <StatItem label="Total Workouts" value={stats.totalWorkouts.toString()} icon="💪" />
          <StatItem label="Weekly Avg" value={stats.averageWorkoutsPerWeek.toFixed(1)} icon="📊" />
        </View>

        <View style={styles.divider} marginB-15 />

        <View row spread>
          <View center>
            <Text text80 grey30>
              Progress
            </Text>
            <Text text60BO>{((stats.completedGoals / stats.totalGoals) * 100).toFixed(0)}%</Text>
          </View>
          <View center>
            <Text text80 grey30>
              Weight Loss
            </Text>
            <Text text60BO>
              {stats.currentWeight - stats.targetWeight > 0
                ? `${(stats.currentWeight - stats.targetWeight).toFixed(1)}kg to go`
                : 'Goal Reached! 🎉'}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

interface StatItemProps {
  label: string;
  value: string;
  icon: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon }) => (
  <View center>
    <Text text70 grey30>
      {label}
    </Text>
    <View row centerV marginT-5>
      <Text marginR-5>{icon}</Text>
      <Text text65BO>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grey60,
  },
});

export default StatsCard;
