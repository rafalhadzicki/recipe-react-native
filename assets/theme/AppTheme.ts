import { DefaultTheme } from '@react-navigation/native';

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    white: '#ffffff',
    black: '#000000',
    grey: {
      1: '#484848',
      2: '#797979',
      3: '#A9A9A9',
      4: '#D9D9D9',
      5: '#F0F0F0'
    },
    green: {
      100: '#129575',
      80: '#71B1A1',
      60: '#AFD3CA',
      40: '#DBEBE7',
      20: '#F6FAF9'
    },
    yellow: {
      100: '#FF9C00',
      80: '#FFA61A',
      60: '#FFBA4D',
      40: '#FFCE80',
      20: '#FFE1B3'
    },
    rating: '#FFAD30',
    warningLight: '#FFE1E7',
    warningDark: '#FD3654',
    success: '#31B057',
    label: '#121212',
    background: '#ffffff',
    transparent: 'transparent',
    shadow: 'rgba(0, 0, 0, 0.05)',
    recipePreviewGradient: ['rgba(0, 0, 0, 0.00)', 'rgba(0, 0, 0, 0.90)']
  }
};

export const colors = AppTheme.colors;

export default AppTheme;
