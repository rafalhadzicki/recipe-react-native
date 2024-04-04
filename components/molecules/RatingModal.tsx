import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import CustomButton from '../atoms/CustomButton';
import CustomText from '../atoms/CustomText';

import { useRateRecipeById } from '@/api/recipe';
import { queryClient } from '@/app/_layout';
import fonts from '@/assets/fonts/fonts';
import StarIcon from '@/assets/icons/icon_star.svg';
import StarOutlineIcon from '@/assets/icons/icon_star_outline.svg';
import { colors } from '@/assets/theme/AppTheme';
import { ratingButtons } from '@/constants/customButtons';
import { QueryKeys } from '@/enums/queryKeys';

type RatingModalProps = {
  recipeId: string;
  rating: number;
  ratingCount: number;
  setIsRatingModalVisible: (value: boolean) => void;
  userRating?: number;
};

const RatingModal = ({
  recipeId,
  rating,
  ratingCount,
  userRating,
  setIsRatingModalVisible
}: RatingModalProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'recipeDetailsScreen' });
  const [selectedRating, setSelectedRating] = useState(userRating ?? 0);
  const { rateRecipe, isRecipeBeingRated } = useRateRecipeById();

  const handleRecipeRate = () => {
    rateRecipe(
      {
        recipeId,
        recipeRating: rating,
        userRating: selectedRating,
        ratingCount
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([QueryKeys.Recipes, [recipeId]]);
          setIsRatingModalVisible(false);
        }
      }
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Pressable style={styles.backdrop} onPress={() => setIsRatingModalVisible(false)} />
      <Animated.View style={styles.modalContainer}>
        <CustomText>{t('rateRecipe')}</CustomText>
        <View style={styles.starsContainer}>
          {ratingButtons.map(({ id, value }) => (
            <CustomButton
              style={styles.starButton}
              key={id}
              onPress={() => setSelectedRating(value)}
            >
              {selectedRating >= value ? (
                <StarIcon color={colors.rating} width={20} height={20} />
              ) : (
                <StarOutlineIcon color={colors.rating} width={20} height={20} />
              )}
            </CustomButton>
          ))}
        </View>
        <CustomButton
          label={t('send')}
          style={[styles.sendButton, selectedRating !== 0 && { backgroundColor: colors.rating }]}
          labelStyle={styles.sendButtonText}
          disabled={selectedRating === 0 || isRecipeBeingRated}
          pressOpacity={0.3}
          onPress={handleRecipeRate}
          loading={isRecipeBeingRated}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backdrop: {
    backgroundColor: colors.black,
    opacity: 0.5,
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%'
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    width: 164,
    padding: 10,
    position: 'absolute',
    zIndex: 2,
    alignItems: 'center'
  },
  starButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    height: 'auto',
    borderRadius: 0,
    backgroundColor: colors.transparent,
    justifyContent: 'flex-start',
    width: 'auto',
    flex: 1,
    paddingVertical: 7
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  sendButton: {
    width: 61,
    height: 20
  },
  sendButtonText: {
    fontSize: 8,
    fontFamily: fonts.primary.regular
  }
});

export default RatingModal;
