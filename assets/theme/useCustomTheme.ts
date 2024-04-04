import { useTheme } from '@react-navigation/native';

import AppTheme from './AppTheme';

const useCustomTheme = useTheme as () => typeof AppTheme;

export default useCustomTheme;
