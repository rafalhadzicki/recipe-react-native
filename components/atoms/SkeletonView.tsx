import { useEffect } from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

import { colors } from '@/assets/theme/AppTheme';

type SkeletonViewProps = ViewProps & {
  isLoading: boolean;
};

const SkeletonView = ({ style, isLoading, ...props }: SkeletonViewProps) => {
  const opacity = useSharedValue(1);
  const animationStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value
    };
  });

  useEffect(() => {
    if (isLoading) {
      opacity.value = withRepeat(withTiming(0, { duration: 800 }), -1, true);
      return;
    }
    opacity.value = withTiming(1);
  }, [isLoading]);

  return <Animated.View style={[styles.mainContainer, animationStyle, style]} {...props} />;
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.grey[4]
  }
});

export default SkeletonView;
