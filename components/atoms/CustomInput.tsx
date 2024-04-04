import { useRef } from 'react';
import { Control, FieldValues, RegisterOptions, useController } from 'react-hook-form';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';

import CustomText from './CustomText';

import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';

type CustomInputProps = TextInputProps & {
  caption?: string;
  control: Control<FieldValues>;
  name: string;
  rules?:
    | Omit<
        RegisterOptions<FieldValues, string>,
        'setValueAs' | 'disabled' | 'valueAsNumber' | 'valueAsDate'
      >
    | undefined;
  error?: boolean;
  errorMessage?: string | null; //In order to display error correctly component must have error prop set to true
  errorMessageStyle?: StyleProp<TextStyle>;
  outerStyle?: StyleProp<ViewStyle>;
  leftItem?: React.ReactNode;
};

const CustomInput = ({
  defaultValue,
  rules,
  caption,
  control,
  name,
  errorMessage,
  error,
  style,
  outerStyle,
  keyboardType,
  leftItem,
  onFocus,
  onBlur,
  ...props
}: CustomInputProps) => {
  const textRef = useRef<TextInput>(null);
  const { field } = useController({
    control,
    defaultValue: defaultValue ? defaultValue : '',
    name,
    rules,
    shouldUnregister: true
  });

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    textRef.current?.setNativeProps({
      style: {
        borderColor: !error && colors.green[100]
      }
    });
    onFocus && onFocus(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    textRef.current?.setNativeProps({
      style: {
        borderColor: !error && colors.grey[4]
      }
    });
    onBlur && onBlur(e);
  };
  return (
    <View style={outerStyle}>
      {caption && <CustomText style={styles.caption}>{caption}</CustomText>}
      {leftItem && <View style={styles.leftItem}>{leftItem}</View>}
      <TextInput
        value={field.value}
        keyboardType={keyboardType ? keyboardType : 'default'}
        onChangeText={field.onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[styles.input, styles.inputFont, error && styles.inputError, style]}
        {...props}
        ref={textRef}
      ></TextInput>
      {errorMessage && <CustomText style={styles.errorMessage}>{errorMessage}</CustomText>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 27,
    paddingVertical: 16,
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.grey[4],
    fontFamily: fonts.primary.regular,
    fontSize: 11,
    color: colors.black
  },
  inputFont: {
    fontSize: 11,
    fontFamily: fonts.primary.regular
  },
  caption: {
    fontSize: 14,
    color: colors.label,
    marginBottom: 5
  },
  errorMessage: {
    fontSize: 9,
    color: colors.warningDark,
    position: 'absolute',
    bottom: 5,
    left: 0
  },
  inputError: {
    borderColor: colors.warningDark
  },
  leftItem: {
    position: 'absolute',
    left: 10,
    top: 11,
    zIndex: 1
  }
});

export default CustomInput;
