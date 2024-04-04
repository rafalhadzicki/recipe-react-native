import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import CustomButton, { CustomButtonProps } from '../atoms/CustomButton';

import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';

const RecipeButton = ({ label, disabled, ...props }: CustomButtonProps) => {
  return (
    <CustomButton
      disabled={disabled}
      pressOpacity={0.3}
      style={[styles.button, disabled && { opacity: 0.2 }]}
      labelStyle={styles.label}
      label={label}
      {...props}
    >
      <Ionicons name="create-outline" size={24} color={colors.label} />
    </CustomButton>
  );
};

const styles = StyleSheet.create({
  button: { width: 'auto', height: 47, gap: 5, backgroundColor: colors.transparent },
  label: {
    fontSize: 14,
    fontFamily: fonts.primary.regular,
    color: colors.label
  }
});

export default RecipeButton;
