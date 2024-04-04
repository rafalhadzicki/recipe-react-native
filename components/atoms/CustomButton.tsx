import { ForwardedRef, forwardRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';

import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';

export type CustomButtonProps = PressableProps & {
  label?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  pressOpacity?: number;
  loading?: boolean;
  loadingColor?: string;
};

const CustomButton = forwardRef(
  (
    {
      disabled,
      label,
      labelStyle,
      style,
      pressOpacity,
      children,
      loading,
      loadingColor,
      ...props
    }: CustomButtonProps,
    ref: ForwardedRef<View>
  ) => {
    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          {
            opacity: pressed ? pressOpacity || 0.8 : 1,
            backgroundColor: disabled ? colors.grey[4] : colors.green[100]
          },
          style
        ]}
        {...props}
      >
        {loading ? (
          <ActivityIndicator size="small" color={loadingColor ? loadingColor : colors.white} />
        ) : (
          <>
            {label && <Text style={[styles.title, labelStyle]}>{label}</Text>}
            {children}
          </>
        )}
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    width: '100%',
    height: 54,
    backgroundColor: colors.green[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: colors.green[100],
    fontFamily: fonts.primary.semiBold
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.primary.semiBold,
    color: colors.white
  }
});

export default CustomButton;
