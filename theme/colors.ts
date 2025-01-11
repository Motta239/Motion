import { Platform } from 'react-native';

const IOS_SYSTEM_COLORS = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(12, 12, 14)',
  light: {
    grey6: 'rgb(248, 248, 248)',
    grey5: 'rgb(238, 238, 238)',
    grey4: 'rgb(228, 228, 228)',
    grey3: 'rgb(218, 218, 218)',
    grey2: 'rgb(198, 198, 198)',
    grey: 'rgb(178, 178, 178)',
    background: 'rgb(242, 242, 242)',
    foreground: 'rgb(22, 22, 24)',
    root: 'rgb(242, 242, 242)',
    card: 'rgb(252, 252, 252)',
    destructive: 'rgb(220, 38, 38)',
    primary: 'rgb(82, 82, 91)',
  },
  dark: {
    grey6: 'rgb(12, 12, 14)',
    grey5: 'rgb(22, 22, 24)',
    grey4: 'rgb(32, 32, 34)',
    grey3: 'rgb(42, 42, 44)',
    grey2: 'rgb(62, 62, 64)',
    grey: 'rgb(128, 128, 130)',
    background: 'rgb(12, 12, 14)',
    foreground: 'rgb(238, 238, 238)',
    root: 'rgb(12, 12, 14)',
    card: 'rgb(22, 22, 24)',
    destructive: 'rgb(220, 38, 38)',
    primary: 'rgb(82, 82, 91)',
  },
} as const;

const ANDROID_COLORS = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(12, 12, 14)',
  light: {
    grey6: 'rgb(248, 248, 248)',
    grey5: 'rgb(238, 238, 238)',
    grey4: 'rgb(228, 228, 228)',
    grey3: 'rgb(218, 218, 218)',
    grey2: 'rgb(198, 198, 198)',
    grey: 'rgb(178, 178, 178)',
    background: 'rgb(242, 242, 242)',
    foreground: 'rgb(22, 22, 24)',
    root: 'rgb(242, 242, 242)',
    card: 'rgb(252, 252, 252)',
    destructive: 'rgb(220, 38, 38)',
    primary: 'rgb(82, 82, 91)',
  },
  dark: {
    grey6: 'rgb(12, 12, 14)',
    grey5: 'rgb(22, 22, 24)',
    grey4: 'rgb(32, 32, 34)',
    grey3: 'rgb(42, 42, 44)',
    grey2: 'rgb(62, 62, 64)',
    grey: 'rgb(128, 128, 130)',
    background: 'rgb(12, 12, 14)',
    foreground: 'rgb(238, 238, 238)',
    root: 'rgb(12, 12, 14)',
    card: 'rgb(22, 22, 24)',
    destructive: 'rgb(220, 38, 38)',
    primary: 'rgb(82, 82, 91)',
  },
} as const;

const COLORS = Platform.OS === 'ios' ? IOS_SYSTEM_COLORS : ANDROID_COLORS;

export { COLORS };
