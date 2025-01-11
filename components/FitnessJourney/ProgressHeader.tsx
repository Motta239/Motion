import React from 'react';
import { View, Text, ProgressBar, } from 'react-native-ui-lib';

interface ProgressHeaderProps {
  completedSteps: number;
  totalSteps: number;
  currentWeight: number;
  targetWeight: number;
  daysInProgram: number;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  completedSteps,
  totalSteps,
  currentWeight,
  targetWeight,
  daysInProgram,
}) => {
  const progress = (completedSteps / totalSteps) * 100;
  const weightProgress = Math.abs(((currentWeight - targetWeight) / targetWeight) * 100);

  return (
    <View bg-screenBG padding-20>
      <View row spread marginB-15>
        <Text text60BO>Your Fitness Journey</Text>
        <Text text60BO>{`${Math.round(progress)}%`}</Text>
      </View>

      <ProgressBar
        progress={progress}
        progressColor={progress >= 80 ? '#2ecc71' : progress >= 40 ? '#f1c40f' : '#e74c3c'}
        style={{ height: 8, marginBottom: 20 }}
      />

      <View row spread>
        <View center>
          <Text text70BO>{completedSteps}</Text>
          <Text text80>Completed</Text>
        </View>
        <View center>
          <Text text70BO>{totalSteps - completedSteps}</Text>
          <Text text80>Remaining</Text>
        </View>
        <View center>
          <Text text70BO>{daysInProgram}</Text>
          <Text text80>Days Active</Text>
        </View>
      </View>

      <View row spread marginT-20>
        <View>
          <Text text80>Current Weight</Text>
          <Text text70BO>{currentWeight} kg</Text>
        </View>
        <View right>
          <Text text80>Target Weight</Text>
          <Text text70BO>{targetWeight} kg</Text>
        </View>
      </View>
    </View>
  );
};

export default ProgressHeader;
