import { Link } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import CustomText from '../atoms/CustomText';
import SaveButton from '../atoms/SaveButton';
import SkeletonView from '../atoms/SkeletonView';
import RatingChip from './RatingChip';

import { useSaveRecipe, useUnsaveRecipe } from '@/api/recipe';
import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';
import { Routes } from '@/enums/screens';
import { Recipe } from '@/models/firebase/recipe';

export type RecipeThumbnailProps = Recipe & {
  selectedCategoryId: string;
  isSaved?: boolean;
};

const HomeRecipeThumbnail = ({ selectedCategoryId, isSaved, ...recipe }: RecipeThumbnailProps) => {
  const { id, name, preparingTime, rating, imageUri } = recipe;
  const { t } = useTranslation('translation', { keyPrefix: 'homeScreen' });
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const { saveRecipe, isRecipeSaving } = useSaveRecipe();
  const { unsaveRecipe, isRecipeUnsaving } = useUnsaveRecipe();

  const handleSave = () => {
    if (!isSaved) {
      saveRecipe(id!);
      return;
    }
    unsaveRecipe(id!);
  };

  return (
    <Link href={{ pathname: `${Routes.RecipeDetails}/${id}` }} asChild>
      <Pressable disabled={!isImageLoaded} style={styles.mainContainer}>
        {!!rating && isImageLoaded && <RatingChip rating={rating} style={styles.chip} />}
        <SkeletonView isLoading={!isImageLoaded} style={styles.backdrop} />
        <SkeletonView isLoading={!isImageLoaded} style={[styles.image, styles.skeletonBackground]}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            onLoadEnd={() => setIsImageLoaded(true)}
            fadeDuration={0}
          />
        </SkeletonView>
        <View style={styles.textContentContainer}>
          {isImageLoaded && (
            <>
              <CustomText numberOfLines={3} style={[styles.name, { fontSize: 14 }]}>
                {name}
              </CustomText>
              <View style={styles.bottomContainer}>
                <View style={styles.timeContainer}>
                  <CustomText style={styles.timeLabel}>{t('time')}</CustomText>
                  <CustomText style={styles.timeText}>{`${preparingTime} ${t('mins')}`}</CustomText>
                </View>
                <SaveButton
                  disabled={isRecipeSaving || isRecipeUnsaving}
                  onPress={handleSave}
                  saved={isSaved}
                  loadingColor={colors.green[100]}
                  loading={isRecipeSaving || isRecipeUnsaving}
                />
              </View>
            </>
          )}
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: 150,
    height: 231,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  backdrop: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    height: 176,
    borderRadius: 12,
    backgroundColor: colors.grey[4]
  },
  image: { width: 110, height: 110, borderRadius: 75, resizeMode: 'cover' },
  textContentContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 11,
    paddingBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between'
  },
  timeContainer: {
    justifyContent: 'space-between',
    maxHeight: 39
  },
  name: {
    flex: 1,
    fontSize: 14,
    color: colors.grey[1],
    fontFamily: fonts.primary.semiBold,
    textAlign: 'center'
  },
  timeText: {
    fontSize: 11,
    color: colors.grey[1],
    fontFamily: fonts.primary.semiBold
  },
  timeLabel: {
    fontSize: 11,
    color: colors.grey[3]
  },
  bottomContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  chip: {
    position: 'absolute',
    right: 0,
    top: 33,
    zIndex: 1
  },
  skeletonBackground: {
    backgroundColor: colors.grey[3]
  }
});

export default HomeRecipeThumbnail;
