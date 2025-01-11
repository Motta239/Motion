import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Colors } from 'react-native-ui-lib';

interface FloatingActionButtonProps {
  onPress: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <BlurView
        intensity={10}
        tint="dark"
        className="absolute bottom-[100px] right-[10px] z-[1000] h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-[30px] bg-black/50 bg-slate-100/20 p-2"></BlurView>
    </Pressable>
  );
};

export default FloatingActionButton;
1;
