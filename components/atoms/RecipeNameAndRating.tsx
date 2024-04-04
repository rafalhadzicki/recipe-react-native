import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import CustomText from './CustomText';

import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';
import { getReviewsCount } from '@/utils/getReviewsCount';

type RecipeNameAndRatingProps = {
  name: string;
  ratingCount: number;
};

const RecipeNameAndRating = ({ name, ratingCount }: RecipeNameAndRatingProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'recipeDetailsScreen' });
  return (
    <View style={styles.nameAndReviews}>
      <CustomText numberOfLines={2} style={styles.recipeTitle}>
        {name}
      </CustomText>
      <CustomText style={styles.reviewsText}>{`(${getReviewsCount(ratingCount)} ${
        ratingCount === 1 ? t('review') : t('reviews')
      })`}</CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  recipeTitle: {
    fontFamily: fonts.primary.semiBold,
    marginBottom: 10,
    maxWidth: '65%'
  },
  nameAndReviews: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  reviewsText: {
    color: colors.grey[3]
  }
});

export default RecipeNameAndRating;
