import { StyleSheet, Text, TextProps } from 'react-native';

import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';

type CustomTextProps = TextProps & {
  white?: boolean;
};

const CustomText = ({ style, white, ...props }: CustomTextProps) => {
  return (
    <Text style={[{ color: white ? colors.white : colors.black }, styles.text, style]} {...props} />
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.primary.regular,
    fontSize: 14
  }
});

export default CustomText;
