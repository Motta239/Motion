export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  distance?: number;
}

export interface Measurement {
  weight?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
}

export interface NutritionPlan {
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  meals?: Meal[];
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
}

export interface FitnessGoal {
  id: number;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  progress: number;
  status: 'SUCCESS' | 'ERROR' | 'CURRENT' | 'NEXT';
  exercises?: Exercise[];
  measurements?: Measurement;
  nutrition?: NutritionPlan;
  notes?: string;
}

export interface FitnessStats {
  currentWeight: number;
  targetWeight: number;
  daysInProgram: number;
  weightLost: number;
  avgDailySteps: number;
  workoutsCompleted: number;
  streakDays: number;
} 