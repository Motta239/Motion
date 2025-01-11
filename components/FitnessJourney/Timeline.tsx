import React, { useState, useCallback, useRef, useEffect } from 'react';
import { StyleSheet, ListRenderItem, ViewToken, FlatList, FlatListProps } from 'react-native';
import { View, Timeline, Colors, Slider, ProgressBar, Text } from 'react-native-ui-lib';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  useSharedValue,
  FadeIn,
  FadeOut,
  SlideInRight,
  Layout,
  SlideOutRight,
  ZoomInDown,
  ZoomInEasyUp,
} from 'react-native-reanimated';
import { FitnessGoal, FitnessStats } from './types';
import ProgressHeader from './ProgressHeader';
import StatsCard from './StatsCard';
import StepCard from './StepCard';
import FloatingActionButton from './FloatingActionButton';
import AddStepDialog from './AddStepDialog';
import { ProgressIndicator } from '../nativewindui/ProgressIndicator';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<FitnessGoal>>(FlatList);

interface FitnessTimelineProps {
  goals: FitnessGoal[];
  stats: FitnessStats;
  onAddGoal: (goal: Partial<FitnessGoal>) => void;
  onEditGoal: (goalId: number) => void;
}

interface TimelineItemProps {
  goal: FitnessGoal;
  index: number;
  isVisible: boolean;
  isExpanded: boolean;
  completedGoals: number;
  totalGoals: number;
  onToggleExpand: (goalId: number) => void;
  onEdit: (goalId: number) => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  goal,
  index,
  isVisible,
  isExpanded,
  completedGoals,
  totalGoals,
  onToggleExpand,
  onEdit,
}) => {
  const reversedIndex = totalGoals - 1 - index;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isVisible ? 1 : 0.95, {
            damping: 20,
            mass: 0.6,
            stiffness: 150,
            restDisplacementThreshold: 0.001,
            restSpeedThreshold: 0.001,
          }),
        },
      ],
      opacity: withSpring(isVisible ? 1 : 0.6, {
        damping: 20,
        mass: 0.6,
        stiffness: 150,
        restDisplacementThreshold: 0.001,
        restSpeedThreshold: 0.001,
      }),
    };
  }, [isVisible]);

  return (
    <Animated.View entering={FadeIn.delay(index * 100).springify()} layout={Layout.springify()}>
      <Animated.View style={animatedStyle}>
        <Timeline
          key={goal.id}
          topLine={
            reversedIndex > 0
              ? {
                  type:
                    reversedIndex < completedGoals
                      ? Timeline.lineTypes.SOLID
                      : Timeline.lineTypes.SOLID,
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
            type: reversedIndex < totalGoals - 1 ? Timeline.lineTypes.SOLID : undefined,
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
          <StepCard
            goal={goal}
            isExpanded={isExpanded}
            onToggleExpand={() => onToggleExpand(goal.id)}
            onEdit={() => onEdit(goal.id)}
          />
        </Timeline>
      </Animated.View>
    </Animated.View>
  );
};

export const FitnessTimeline: React.FC<FitnessTimelineProps> = ({
  goals: initialGoals,
  stats,
  onAddGoal,
  onEditGoal,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [showFloatingActionButton, setShowFloatingActionButton] = useState(false);
  const [localGoals, setLocalGoals] = useState<FitnessGoal[]>(initialGoals);
  const flatListRef = useRef<FlatList<FitnessGoal>>(null);
  const scrollY = useSharedValue(0);
  const viewableItems = useSharedValue<ViewToken[]>([]);

  const [isViewable, setIsViewable] = useState<number[]>([]);

  // Update local goals when props change
  useEffect(() => {
    setLocalGoals(initialGoals);
    console.log('mount');
  }, [initialGoals]);

  const handleToggleExpand = useCallback(
    (goalId: number) => {
      setSelectedGoal(selectedGoal === goalId ? null : goalId);
    },
    [selectedGoal]
  );

  const handleAddGoal = useCallback(
    (goal: Partial<FitnessGoal>) => {
      onAddGoal(goal);
      // Optimistically update local state
      const newGoal = {
        ...goal,
        id: localGoals.length + 1,
        status: 'NEXT',
        completed: false,
      } as FitnessGoal;
      setLocalGoals((prev) => [...prev, newGoal]);
      setIsAddDialogVisible(false);

      // Scroll to the new item after a short delay
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: localGoals.length,
          animated: true,
        });
      }, 100);
    },
    [onAddGoal, localGoals]
  );

  const completedGoals = localGoals.filter((goal) => goal.completed).length;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems: vItems }: { viewableItems: ViewToken[] }) => {
      viewableItems.value = vItems;
      // Update to track all visible indices
      const visibleIndices = vItems
        .map((item) => item.index)
        .filter((index): index is number => index !== null);
      setIsViewable(visibleIndices);
    },
    []
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 10,
    minimumViewTime: 100,
  };

  const renderTimelineItem = useCallback<ListRenderItem<FitnessGoal>>(
    ({ item: goal, index }) => (
      <TimelineItem
        goal={goal}
        index={index}
        isVisible={isViewable.includes(index)}
        isExpanded={selectedGoal === goal.id}
        completedGoals={completedGoals}
        totalGoals={localGoals.length}
        onToggleExpand={handleToggleExpand}
        onEdit={onEditGoal}
      />
    ),
    [completedGoals, selectedGoal, handleToggleExpand, onEditGoal, localGoals.length, isViewable]
  );

  const handleScrollToIndexFailed = useCallback(
    (info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
      const wait = new Promise((resolve) => setTimeout(resolve, 500));
      wait.then(() => {
        flatListRef.current?.scrollToIndex({
          index: info.index,
          animated: true,
        });
      });
    },
    []
  );

  const ListHeaderComponent = useCallback(
    () => (
      <Animated.View entering={ZoomInEasyUp.springify().damping(100).mass(1)}>
        <View className="m-4 rounded-xl bg-white shadow">
          <ProgressHeader
            completedSteps={completedGoals}
            totalSteps={localGoals.length}
            currentWeight={stats.currentWeight}
            targetWeight={stats.targetWeight}
            daysInProgram={stats.daysInProgram}
          />
          <StatsCard stats={stats} />
        </View>
      </Animated.View>
    ),
    [completedGoals, localGoals.length, stats]
  );

  const onScroll = useCallback((event: any) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
    setShowFloatingActionButton(scrollY.value > 100);
  }, []);

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(scrollY.value, [-100, 0, 100], [25, 0, -25], 'clamp'),
        },
      ],
    };
  });

  return (
    <>
      <BlurView intensity={100} tint="light" className="">
        <AnimatedFlatList
          ref={flatListRef}
          data={localGoals}
          renderItem={renderTimelineItem}
          keyExtractor={(item: FitnessGoal) => item.id.toString()}
          ListHeaderComponent={ListHeaderComponent}
          onScrollToIndexFailed={handleScrollToIndexFailed}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 100 }}
          style={headerStyle}
        />
        {showFloatingActionButton && (
          <Animated.View
            entering={SlideInRight.springify().damping(10).mass(0.5)}
            exiting={SlideOutRight.springify().damping(10).mass(0.5)}>
            <FloatingActionButton onPress={() => setIsAddDialogVisible(true)} />
          </Animated.View>
        )}
        <AddStepDialog
          visible={isAddDialogVisible}
          onClose={() => setIsAddDialogVisible(false)}
          onSubmit={handleAddGoal}
          currentStep={localGoals.length}
        />
      </BlurView>
    </>
  );
};

export default FitnessTimeline;
