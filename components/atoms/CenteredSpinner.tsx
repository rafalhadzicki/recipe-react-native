import { ActivityIndicator, ActivityIndicatorProps, StyleSheet } from 'react-native';

const INDICATOR_SIZE = 36;

const CenteredSpinner = ({ style, ...props }: ActivityIndicatorProps) => {
  return <ActivityIndicator size="large" style={[styles.indicator, style]} {...props} />;
};

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    zIndex: 100,
    left: '50%',
    top: '50%',
    marginLeft: -INDICATOR_SIZE / 2,
    marginTop: -INDICATOR_SIZE / 2
  }
});

export default CenteredSpinner;
