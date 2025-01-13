import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from 'react-native-paper';
import merge from 'deepmerge';

const {LightTheme, DarkTheme} = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

export const CombinedDefaultTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    // background: 'transparent',
  },
};
export const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

export const themes = {
  colors: {
    primaryMain: '#1F2A37',
    SecondaryMain: '#374151',
    foundationSecondary: '#4253F0',
    headerColor: '',
    neutralN500: '#9CA3AF',
    white: '#FFFFFF',
    chineseWhite: '#6B7280',
    silverSand: '#4B5563',
    lavender: '#E1EFFE',
    alabaster: '#D1D5DB',
    profilePageImageBackground: '#6186FC',
    egyptianBlue: '#1E429F',
    fireOpal: '#F05252',
    MaximumRed: '#E02424',
    UnitedNationsBlue: '#5B7CE2',
    successgreen: '#31C48D',
    backish: '#1F2024',
    toastGreen: '#046C4E',
    blueBtn: '#1C64F2',
    brightGrey: '#E5E7EB',
    successGreenPill: '#0E9F6E',
    blue400: '#76A9FA',
    whitish: '#DDE3F6',
    blueCTA: '#5B7CE2',
    blue500: '#3F83F8',
    green100: '#DEF7EC',
    green800: '#03543F',
    green500: '#0E9F6E',
    yellow400: '#F4B400',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2A37',
    gray900: '#111928',
    green400: '#31C48D',
    red400: '#F05252',
    portfolioStatusMessage: '#A4CAFE',
    purple500: '#9061F9',
    primary700: '#1A56DB',
  },
  fonts: {
    fontFamily: 'Inter 18pt',
  },
};
