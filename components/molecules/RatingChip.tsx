import { StyleSheet } from 'react-native';

import Chip, { ChipProps } from '../atoms/Chip';

import fonts from '@/assets/fonts/fonts';
import StarIcon from '@/assets/icons/icon_star.svg';
import { colors } from '@/assets/theme/AppTheme';

type RatingChipProps = ChipProps & {
  rating: number;
};

const RatingChip = ({ rating, style, labelStyle, ...props }: RatingChipProps) => {
  return (
    <Chip
      label={rating.toFixed(1).toString()}
      labelStyle={[styles.label, labelStyle]}
      style={[styles.ratingChip, style]}
      {...props}
    >
      <StarIcon color={colors.rating} />
    </Chip>
  );
};

const styles = StyleSheet.create({
  ratingChip: {
    backgroundColor: colors.yellow[20],
    paddingHorizontal: 7,
    height: 23,
    gap: 4,
    alignItems: 'center'
  },
  label: {
    fontFamily: fonts.primary.regular,
    color: colors.black
  }
});

export default RatingChip;
