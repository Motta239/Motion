import React, { useCallback, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { Timeline, Card, View, Text, Button, Colors, Assets } from 'react-native-ui-lib';

// Types for our fitness tracking
interface Exercise {
  name: string;
  sets: number;
  reps: number | null;
  weight?: number;
  duration?: number; // in minutes
  restPeriod?: number; // in seconds
  type: 'strength' | 'cardio';
}

interface Measurement {
  weight: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  arms?: number;
  legs?: number;
}

interface NutritionPlan {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meals: number;
}

interface FitnessGoal {
  id: number;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  completedDate?: string;
  exercises?: Exercise[];
  measurements?: Measurement;
  nutrition?: NutritionPlan;
  progress?: number; // percentage
  notes?: string;
  status: 'CURRENT' | 'SUCCESS' | 'ERROR' | 'NEXT';
}

// Sample fitness journey data
const fitnessJourney: FitnessGoal[] = [
  {
    id: 1,
    title: 'Initial Assessment & Goal Setting',
    description: 'Complete initial fitness assessment and set SMART goals',
    targetDate: '2024-03-15',
    completed: true,
    completedDate: '2024-03-15',
    measurements: {
      weight: 85,
      bodyFat: 25,
      chest: 42,
      waist: 36,
      arms: 14,
      legs: 22,
    },
    progress: 100,
    notes:
      'Successfully completed initial assessment. Set target weight to 75kg with 15% body fat.',
    status: 'SUCCESS',
  },
  {
    id: 2,
    title: 'Establish Base Workout Routine',
    description: 'Start with fundamental exercises and establish proper form',
    targetDate: '2024-03-22',
    completed: true,
    completedDate: '2024-03-20',
    exercises: [
      { name: 'Squats', type: 'strength', sets: 3, reps: 10, weight: 20 },
      { name: 'Bench Press', type: 'strength', sets: 3, reps: 8, weight: 15 },
      { name: 'Deadlift', type: 'strength', sets: 3, reps: 8, weight: 25 },
    ],
    progress: 100,
    notes: 'Mastered proper form for all fundamental exercises.',
    status: 'SUCCESS',
  },
  {
    id: 3,
    title: 'Nutrition Plan Implementation',
    description: 'Start following customized meal plan',
    targetDate: '2024-03-29',
    completed: true,
    completedDate: '2024-03-28',
    nutrition: {
      calories: 2200,
      protein: 180,
      carbs: 220,
      fats: 60,
      meals: 5,
    },
    progress: 100,
    notes: 'Successfully adapted to new meal plan. Feeling more energetic.',
    status: 'SUCCESS',
  },
  {
    id: 4,
    title: 'First Progress Check',
    description: 'Measure progress and adjust goals if needed',
    targetDate: '2024-04-05',
    completed: true,
    completedDate: '2024-04-05',
    measurements: {
      weight: 83,
      bodyFat: 24,
      chest: 42,
      waist: 35,
      arms: 14.5,
      legs: 22.5,
    },
    progress: 100,
    notes: 'Lost 2kg and 1% body fat. On track with goals.',
    status: 'SUCCESS',
  },
  {
    id: 5,
    title: 'Increase Workout Intensity',
    description: 'Progressive overload implementation',
    targetDate: '2024-04-12',
    completed: true,
    completedDate: '2024-04-11',
    exercises: [
      { name: 'Squats', type: 'strength', sets: 4, reps: 8, weight: 30 },
      { name: 'Bench Press', type: 'strength', sets: 4, reps: 6, weight: 25 },
      { name: 'Deadlift', type: 'strength', sets: 4, reps: 6, weight: 35 },
    ],
    progress: 100,
    notes: 'Successfully increased weights while maintaining form.',
    status: 'SUCCESS',
  },
  {
    id: 6,
    title: 'Cardio Integration',
    description: 'Add structured cardio sessions',
    targetDate: '2024-04-19',
    completed: false,
    exercises: [
      { name: 'HIIT', type: 'cardio', sets: 1, reps: null, duration: 20, restPeriod: 30 },
      { name: 'Steady State Cardio', type: 'cardio', sets: 1, reps: null, duration: 30 },
    ],
    progress: 50,
    notes: 'Working on building cardio endurance',
    status: 'CURRENT',
  },
];

// Continue with remaining goals...
const remainingGoals: FitnessGoal[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 7,
  title: `Phase ${i + 1} Goals`,
  description: 'Upcoming fitness milestones',
  targetDate: new Date(2024, 3 + Math.floor(i / 2), 15 + (i % 2) * 14).toISOString().split('T')[0],
  completed: false,
  progress: 0,
  status: 'NEXT',
}));

const allGoals = [...fitnessJourney, ...remainingGoals];

const TimelineWrapper = () => {
  const [expand, setExpand] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const anchor = useRef();

  const onPressExpand = useCallback(
    (goalId: number) => {
      setSelectedGoal(selectedGoal === goalId ? null : goalId);
    },
    [selectedGoal]
  );

  const renderExtraContent = (goal: FitnessGoal) => {
    return (
      <View style={{ flex: 1, marginTop: 10, padding: 10, backgroundColor: Colors.grey70 }}>
        {goal.measurements && (
          <View marginB-10>
            <Text text70BO>Measurements:</Text>
            <Text>Weight: {goal.measurements.weight}kg</Text>
            {goal.measurements.bodyFat && <Text>Body Fat: {goal.measurements.bodyFat}%</Text>}
          </View>
        )}
        {goal.exercises && (
          <View marginB-10>
            <Text text70BO>Exercises:</Text>
            {goal.exercises.map((exercise, index) => (
              <Text key={index}>
                {exercise.name}: {exercise.sets}x{exercise.reps}
                {exercise.weight ? ` @ ${exercise.weight}kg` : ''}
                {exercise.duration ? ` for ${exercise.duration} mins` : ''}
              </Text>
            ))}
          </View>
        )}
        {goal.nutrition && (
          <View marginB-10>
            <Text text70BO>Nutrition Plan:</Text>
            <Text>Calories: {goal.nutrition.calories}</Text>
            <Text>Protein: {goal.nutrition.protein}g</Text>
            <Text>Carbs: {goal.nutrition.carbs}g</Text>
            <Text>Fats: {goal.nutrition.fats}g</Text>
          </View>
        )}
        {goal.notes && (
          <View>
            <Text text70BO>Notes:</Text>
            <Text>{goal.notes}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderContent = (goal: FitnessGoal) => {
    const isExpanded = selectedGoal === goal.id;
    return (
      <Card style={{ padding: 10 }}>
        <Text text70BO>{goal.title}</Text>
        <View marginT-5 padding-8 bg-grey70 br30>
          <Text>{goal.description}</Text>
          <Text marginT-5>Target Date: {goal.targetDate}</Text>
          <Text marginT-5>Progress: {goal.progress}%</Text>
          <View right>
            <Button
              marginT-10
              link
              size={'small'}
              label={!isExpanded ? 'More info' : 'Close'}
              onPress={() => onPressExpand(goal.id)}
            />
          </View>
          {isExpanded && renderExtraContent(goal)}
        </View>
      </Card>
    );
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="scrollableAxes">
      {allGoals.map((goal, index) => (
        <Timeline
          key={goal.id}
          topLine={
            index > 0
              ? {
                  type: index < 5 ? Timeline.lineTypes.SOLID : Timeline.lineTypes.DASHED,
                  state:
                    goal.status === 'SUCCESS'
                      ? Timeline.states.SUCCESS
                      : goal.status === 'ERROR'
                        ? Timeline.states.ERROR
                        : Timeline.states.NEXT,
                }
              : undefined
          }
          bottomLine={{
            type: index < allGoals.length - 1 ? Timeline.lineTypes.DASHED : undefined,
            state:
              goal.status === 'SUCCESS'
                ? Timeline.states.SUCCESS
                : goal.status === 'ERROR'
                  ? Timeline.states.ERROR
                  : Timeline.states.NEXT,
          }}
          point={{
            state:
              goal.status === 'SUCCESS'
                ? Timeline.states.SUCCESS
                : goal.status === 'ERROR'
                  ? Timeline.states.ERROR
                  : goal.status === 'CURRENT'
                    ? Timeline.states.CURRENT
                    : Timeline.states.NEXT,
            label: goal.id,
          }}>
          {renderContent(goal)}
        </Timeline>
      ))}
    </ScrollView>
  );
};

export default TimelineWrapper;
