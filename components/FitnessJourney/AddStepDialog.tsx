import React, { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import {
  Dialog,
  View,
  Text,
  TextField,
  DateTimePicker,
  Button,
  Colors,
  Switch,
} from 'react-native-ui-lib';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FitnessGoal, Exercise, Measurement, NutritionPlan } from './types';
import { WINDOW_HEIGHT } from '@gorhom/bottom-sheet';

const measurementSchema = z.object({
  weight: z
    .number()
    .min(20, 'Weight must be at least 20kg')
    .max(300, 'Weight must be less than 300kg')
    .optional(),
  bodyFat: z
    .number()
    .min(3, 'Body fat must be at least 3%')
    .max(50, 'Body fat must be less than 50%')
    .optional(),
  chest: z.number().optional(),
  waist: z.number().optional(),
  hips: z.number().optional(),
  arms: z.number().optional(),
  thighs: z.number().optional(),
});

const nutritionSchema = z.object({
  calories: z
    .number()
    .min(500, 'Calories must be at least 500')
    .max(10000, 'Calories must be less than 10000')
    .optional(),
  protein: z
    .number()
    .min(0, 'Protein must be positive')
    .max(500, 'Protein must be less than 500g')
    .optional(),
  carbs: z.number().optional(),
  fats: z.number().optional(),
});

const goalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description is too long'),
  targetDate: z.date().min(new Date(), 'Target date must be in the future'),
  includeExercises: z.boolean(),
  includeMeasurements: z.boolean(),
  includeNutrition: z.boolean(),
  notes: z.string().max(1000, 'Notes are too long').optional(),
  measurements: measurementSchema.optional(),
  nutrition: nutritionSchema.optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface AddStepDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (goal: Partial<FitnessGoal>) => void;
  currentStep: number;
}

export const AddStepDialog: React.FC<AddStepDialogProps> = ({
  visible,
  onClose,
  onSubmit,
  currentStep,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty, dirtyFields },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: '',
      description: '',
      targetDate: new Date(),
      includeExercises: false,
      includeMeasurements: false,
      includeNutrition: false,
      notes: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible, reset]);

  const includeExercises = watch('includeExercises');
  const includeMeasurements = watch('includeMeasurements');
  const includeNutrition = watch('includeNutrition');

  const onFormSubmit = handleSubmit(async (data) => {
    try {
      const newGoal: Partial<FitnessGoal> = {
        id: currentStep + 1,
        title: data.title,
        description: data.description,
        targetDate: data.targetDate.toISOString().split('T')[0],
        completed: false,
        progress: 0,
        status: 'NEXT',
        notes: data.notes,
      };

      if (data.includeMeasurements && data.measurements) {
        newGoal.measurements = {
          weight: data.measurements.weight || undefined,
          bodyFat: data.measurements.bodyFat || undefined,
          chest: data.measurements.chest || undefined,
          waist: data.measurements.waist || undefined,
          hips: data.measurements.hips || undefined,
          arms: data.measurements.arms || undefined,
          thighs: data.measurements.thighs || undefined,
        };
      }

      if (data.includeNutrition && data.nutrition) {
        newGoal.nutrition = {
          calories: data.nutrition.calories || undefined,
          protein: data.nutrition.protein || undefined,
          carbs: data.nutrition.carbs || undefined,
          fats: data.nutrition.fats || undefined,
          meals: [],
        };
      }

      await onSubmit(newGoal);
      reset();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });

  const renderMeasurementsForm = () => (
    <Animated.View entering={FadeIn} exiting={FadeOut} layout={Layout.springify()}>
      <View marginT-15>
        <Text text70BO marginB-10>
          Target Measurements
        </Text>
        <Controller
          name="measurements.weight"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              placeholder="Weight (kg)"
              keyboardType="numeric"
              value={value?.toString()}
              onChangeText={(val) => onChange(Number(val))}
              error={!!errors.measurements?.weight?.message}
              validationMessage={errors.measurements?.weight?.message}
              enableError={true}
              validateOnBlur
              floatingPlaceholder
              marginB-10
            />
          )}
        />
        <Controller
          name="measurements.bodyFat"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              placeholder="Body Fat %"
              keyboardType="numeric"
              value={value?.toString()}
              onChangeText={(val) => onChange(Number(val))}
              error={!!errors.measurements?.bodyFat?.message}
              validationMessage={errors.measurements?.bodyFat?.message}
              enableError={true}
              validateOnBlur
              floatingPlaceholder
            />
          )}
        />
      </View>
    </Animated.View>
  );

  const renderNutritionForm = () => (
    <Animated.View entering={FadeIn} exiting={FadeOut} layout={Layout.springify()}>
      <View marginT-15>
        <Text text70BO marginB-10>
          Nutrition Plan
        </Text>
        <Controller
          name="nutrition.calories"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              placeholder="Daily Calories"
              keyboardType="numeric"
              value={value?.toString()}
              onChangeText={(val) => onChange(Number(val))}
              error={!!errors.nutrition?.calories?.message}
              validationMessage={errors.nutrition?.calories?.message}
              enableError={true}
              validateOnBlur
              floatingPlaceholder
              marginB-10
            />
          )}
        />
        <Controller
          name="nutrition.protein"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              placeholder="Protein (g)"
              keyboardType="numeric"
              value={value?.toString()}
              onChangeText={(val) => onChange(Number(val))}
              error={!!errors.nutrition?.protein?.message}
              validationMessage={errors.nutrition?.protein?.message}
              enableError={true}
              validateOnBlur
              floatingPlaceholder
            />
          )}
        />
      </View>
    </Animated.View>
  );

  return (
    <Dialog
      visible={visible}
      onDismiss={onClose}
      overlayBackgroundColor={'rgba(0,0,0,0.4)'}
      width="90%"
      ignoreBackgroundPress={false}
      useSafeArea
      modalProps={{
        animationType: 'fade',
        transparent: true,
        hardwareAccelerated: true,
      }}>
      <BlurView intensity={20} tint="dark" className="overflow-hidden rounded-xl">
        <View className="bg-white/70">
          <ScrollView
            bounces={false}
            automaticallyAdjustKeyboardInsets
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View padding-20>
              <Text text60BO marginB-20>
                Add New Goal
              </Text>

              <Controller
                name="title"
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextField
                    placeholder="Goal Title"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={!!errors.title?.message}
                    validationMessage={errors.title?.message}
                    enableError={true}
                    validateOnBlur
                    validateOnChange
                    floatingPlaceholder
                    marginB-10
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextField
                    placeholder="Description"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={!!errors.description?.message}
                    validationMessage={errors.description?.message}
                    enableError={true}
                    validateOnBlur
                    validateOnChange
                    multiline
                    marginB-10
                  />
                )}
              />

              <View marginB-10>
                <Text text70>Target Date</Text>
                <Controller
                  name="targetDate"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DateTimePicker value={value} onChange={onChange} minimumDate={new Date()} />
                  )}
                />
                {errors.targetDate && (
                  <Text text80 red30>
                    {errors.targetDate.message}
                  </Text>
                )}
              </View>

              <View row centerV marginB-10>
                <Text text70 flexG marginR-10>
                  Include Exercises
                </Text>
                <Controller
                  name="includeExercises"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Switch value={value} onValueChange={onChange} />
                  )}
                />
              </View>

              <View row centerV marginB-10>
                <Text text70 flexG marginR-10>
                  Include Measurements
                </Text>
                <Controller
                  name="includeMeasurements"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Switch value={value} onValueChange={onChange} />
                  )}
                />
              </View>

              <View row centerV marginB-10>
                <Text text70 flexG marginR-10>
                  Include Nutrition Plan
                </Text>
                <Controller
                  name="includeNutrition"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Switch value={value} onValueChange={onChange} />
                  )}
                />
              </View>

              {includeMeasurements && renderMeasurementsForm()}
              {includeNutrition && renderNutritionForm()}

              <Controller
                name="notes"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    placeholder="Notes"
                    value={value}
                    onChangeText={onChange}
                    error={!!errors.notes?.message}
                    validationMessage={errors.notes?.message}
                    enableError={true}
                    validateOnBlur
                    multiline
                    numberOfLines={4}
                    style={{ maxHeight: 200 }}
                    marginT-10
                  />
                )}
              />

              <View row spread marginT-20>
                <Button
                  label="Cancel"
                  outline
                  outlineColor={Colors.red30}
                  onPress={() => {
                    reset();
                    onClose();
                  }}
                />
                <Button
                  label="Add Goal"
                  backgroundColor={Colors.green30}
                  onPress={onFormSubmit}
                  disabled={isSubmitting || !isDirty || Object.keys(errors).length > 0}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </BlurView>
    </Dialog>
  );
};

export default AddStepDialog;
