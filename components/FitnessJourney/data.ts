import { FitnessGoal, FitnessStats } from './types';

export const sampleFitnessJourney: FitnessGoal[] = [
  {
    id: 1,
    title: 'Initial Assessment & Goal Setting',
    description: 'Complete fitness assessment and establish baseline measurements',
    targetDate: '2024-03-15',
    completed: true,
    completedDate: '2024-03-15',
    measurements: {
      weight: 85,
      bodyFat: 25,
      chest: 42,
      waist: 36,
      arms: 14,
      legs: 22
    },
    progress: 100,
    notes: 'Successfully completed initial assessment. Set target weight to 75kg with 15% body fat.',
    status: 'SUCCESS'
  },
  {
    id: 2,
    title: 'Foundation Strength Training',
    description: 'Establish proper form for fundamental exercises',
    targetDate: '2024-03-22',
    completed: true,
    completedDate: '2024-03-20',
    exercises: [
      { name: 'Squats', type: 'strength', sets: 3, reps: 10, weight: 20 },
      { name: 'Bench Press', type: 'strength', sets: 3, reps: 8, weight: 15 },
      { name: 'Deadlift', type: 'strength', sets: 3, reps: 8, weight: 25 }
    ],
    progress: 100,
    notes: 'Mastered proper form for all fundamental exercises.',
    status: 'SUCCESS'
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
      meals: 5
    },
    progress: 100,
    notes: 'Successfully adapted to new meal plan. Feeling more energetic.',
    status: 'SUCCESS'
  },
  {
    id: 4,
    title: 'Cardio Integration',
    description: 'Implement structured cardio sessions',
    targetDate: '2024-04-05',
    completed: true,
    exercises: [
      { name: 'HIIT', type: 'cardio', sets: 1, reps: null, duration: 20, restPeriod: 30 },
      { name: 'Steady State Cardio', type: 'cardio', sets: 1, reps: null, duration: 30 }
    ],
    progress: 60,
    notes: 'Working on building cardio endurance',
    status: 'SUCCESS'
  },
  {
    id: 5,
    title: 'First Progress Check',
    description: 'Evaluate progress and adjust goals',
    targetDate: '2024-04-12',
    completed: true,
    progress: 0,
    status: "SUCCESS"
  },
  {
    id: 6,
    title: 'Intermediate Strength Training',
    description: 'Increase weights and introduce complex movements',
    targetDate: '2024-04-19',
    completed: false,
    exercises: [
      { name: 'Front Squats', type: 'strength', sets: 4, reps: 8, weight: 30 },
      { name: 'Romanian Deadlift', type: 'strength', sets: 4, reps: 8, weight: 35 }
    ],
    progress: 0,
    status: "SUCCESS"
  },
  {
    id: 7,
    title: 'Flexibility & Mobility Focus',
    description: 'Implement dedicated mobility work',
    targetDate: '2024-04-26',
    completed: false,
    progress: 0,
    status: 'NEXT'
  },
  {
    id: 8,
    title: 'Nutrition Plan Refinement',
    description: 'Adjust macros based on progress',
    targetDate: '2024-05-03',
    completed: false,
    progress: 0,
    status: 'NEXT'
  },
  {
    id: 9,
    title: 'High-Volume Training Week',
    description: 'Increase workout volume for muscle growth',
    targetDate: '2024-05-10',
    completed: false,
    progress: 0,
    status: 'NEXT'
  },
  {
    id: 10,
    title: 'Second Progress Assessment',
    description: 'Comprehensive progress check',
    targetDate: '2024-05-17',
    completed: false,
    progress: 0,
    status: 'NEXT'
  },
  {
    id: 11,
    title: 'Advanced Compound Movements',
    description: 'Master Olympic lifts basics',
    targetDate: '2024-05-24',
    completed: false,
    progress: 0,
    status: 'NEXT'
  },
  {
    id: 12,
    title: 'Endurance Building Phase',
    description: 'Focus on cardiovascular endurance',
    targetDate: '2024-05-31',
    completed: false,
    progress: 0,
    status: 'NEXT'
  },
  {
    id: 13,
    title: 'Core Strength Focus',
    description: 'Dedicated core training program',
    targetDate: '2024-06-07',
    completed: false,
    progress: 0,
    status: 'NEXT'
  },
  {
    id: 14,
    title: 'Power Development',
    description: 'Explosive movement training',
    targetDate: '2024-06-14',
    completed: false,
    progress: 0,
    status: 'NEXT'
  },
  {
    id: 15,
    title: 'Third Progress Check',
    description: 'Evaluate overall progress',
    targetDate: '2024-06-21',
    completed: false,
    progress: 0,
    status: 'NEXT'
  },
  {
    id: 16,
    title: 'Deload Week',
    description: 'Recovery and light training',
    targetDate: '2024-06-28',
    completed: false,
    progress: 0,
    status: 'NEXT'
  },
  {
    id: 17,
    title: 'Strength-Endurance Phase',
    description: 'Combine strength and endurance training',
    targetDate: '2024-07-05',
    completed: false,
    progress: 0,
    status: 'NEXT'
  },
  {
    id: 18,
    title: 'Nutrition Fine-Tuning',
    description: 'Final adjustments to nutrition plan',
    targetDate: '2024-07-12',
    completed: false,
    progress: 0,
    status: 'NEXT'
  },
  {
    id: 19,
    title: 'Peak Week Preparation',
    description: 'Prepare for final assessment',
    targetDate: '2024-07-19',
    completed: false,
    progress: 0,
    status: 'NEXT'
  },
  {
    id: 20,
    title: 'Final Assessment',
    description: 'Complete program evaluation',
    targetDate: '2024-07-26',
    completed: false,
    progress: 0,
    status: 'NEXT'
  }
];

export const sampleFitnessStats: FitnessStats = {
  totalGoals: 20,
  completedGoals: 3,
  currentWeight: 83,
  targetWeight: 75,
  daysInProgram: 15,
  streakDays: 15,
  totalWorkouts: 12,
  averageWorkoutsPerWeek: 4.0
}; 