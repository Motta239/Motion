import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, View, Text, Button, Colors, Icon } from 'react-native-ui-lib';
import { FitnessGoal } from './index';
import { Ionicons } from '@expo/vector-icons';

interface StepCardProps {
  goal: FitnessGoal;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit?: () => void;
}

export const StepCard: React.FC<StepCardProps> = ({ goal, isExpanded, onToggleExpand, onEdit }) => {
  const getStatusColor = () => {
    switch (goal.status) {
      case 'SUCCESS':
        return Colors.green30;
      case 'ERROR':
        return Colors.red30;
      case 'CURRENT':
        return Colors.blue30;
      default:
        return Colors.grey30;
    }
  };

  return (
    <Card style={[styles.card, { borderColor: getStatusColor() }]} onPress={onToggleExpand}>
      <View row>
        <View flex>
          <View row centerV>
            <Text text65BO flexG marginR-10>
              {goal.title}
            </Text>
            {goal.completed && (
              <Ionicons name="checkmark-circle" size={20} color={Colors.green30} />
            )}
          </View>
          <Text text80 grey30 marginT-5>
            Target: {new Date(goal.targetDate).toLocaleDateString()}
          </Text>
        </View>
        <View row centerV>
          {/* <Text text70 marginR-10>{`${goal.progress}%`}</Text> */}
          <Button
            link
            size={Button.sizes.small}
            iconSource={isExpanded ? 'chevronUp' : 'chevronDown'}
            onPress={onToggleExpand}
          />
        </View>
      </View>

      {isExpanded && (
        <View padding-15 bg-grey80 br20>
          <Text text70BO marginB-10>
            Details
          </Text>

          {goal.measurements && (
            <View marginB-10>
              <Text text80BO>Measurements</Text>
              <View row spread marginT-5>
                <Text text80>Weight: {goal.measurements.weight}kg</Text>
                {goal.measurements.bodyFat && (
                  <Text text80>Body Fat: {goal.measurements.bodyFat}%</Text>
                )}
              </View>
            </View>
          )}

          {goal.exercises && (
            <View marginB-10>
              <Text text80BO>Exercises</Text>
              {goal.exercises.map((exercise, index) => (
                <View key={index} marginT-5>
                  <Text text80>
                    {exercise.name}:{' '}
                    {exercise.type === 'strength'
                      ? `${exercise.sets}x${exercise.reps} @ ${exercise.weight}kg`
                      : `${exercise.duration} mins`}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {goal.nutrition && (
            <View marginB-10>
              <Text text80BO>Nutrition</Text>
              <View row spread marginT-5>
                <Text text80>Calories: {goal.nutrition.calories}</Text>
                <Text text80>Protein: {goal.nutrition.protein}g</Text>
              </View>
            </View>
          )}

          {goal.notes && (
            <View marginT-10>
              <Text text80BO>Notes</Text>
              <Text text80 marginT-5>
                {goal.notes}
              </Text>
            </View>
          )}

          {onEdit && (
            <Button
              label="Edit Step"
              size={Button.sizes.small}
              backgroundColor={Colors.blue30}
              marginT-15
              onPress={onEdit}
            />
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    borderLeftWidth: 4,
    borderRadius: 10,

    padding: 10,
  },
});

export default StepCard;
