import { Pressable, StyleProp, StyleSheet, TextStyle } from 'react-native';

import { CustomButtonProps } from './CustomButton';
import CustomText from './CustomText';

import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';

export type ChipProps = CustomButtonProps & {
  outlined?: boolean;
  selected?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  pressBackgroundChange?: boolean;
  childrenOnRight?: boolean;
};

const Chip = ({
  outlined,
  children,
  selected,
  pressBackgroundChange,
  label,
  labelStyle,
  style,
  childrenOnRight,
  onPress,
  ...props
}: ChipProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        pressed && pressBackgroundChange ? styles.selectedChip : styles.chip,
        outlined && styles.outlinedChip,
        selected && styles.selectedChip,
        styles.chip,
        style
      ]}
      {...props}
    >
      <>
        {!childrenOnRight && children}

        <CustomText style={[styles.chipText, selected && styles.selectedChip, labelStyle]}>
          {label}
        </CustomText>

        {childrenOnRight && children}
      </>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 20,
    height: 31,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  chipText: {
    fontSize: 11,
    fontFamily: fonts.primary.semiBold,
    color: colors.green[80]
  },
  outlinedChip: {
    borderWidth: 1,
    borderColor: colors.green[80]
  },
  selectedChip: {
    backgroundColor: colors.green[100],
    color: colors.white
  }
});

export default Chip;
