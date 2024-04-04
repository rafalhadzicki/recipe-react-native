import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import CustomText from '../atoms/CustomText';
import SaveButton from '../atoms/SaveButton';
import SkeletonView from '../atoms/SkeletonView';
import RatingChip from './RatingChip';

import fonts from '@/assets/fonts/fonts';
import TimerIcon from '@/assets/icons/icon_timer.svg';
import { colors } from '@/assets/theme/AppTheme';

type RecipeImageProps = {
  imageUri?: string;
  difficulty?: string;
  cookingTime?: number;
  rating?: number;
  title?: string;
  author?: string;
  small?: boolean;
  mainContainerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onSave?: () => void;
  saveButtonDisabled?: boolean;
};

const RecipeImage = ({
  imageUri,
  difficulty,
  cookingTime,
  rating,
  small,
  mainContainerStyle,
  title,
  author,
  saveButtonDisabled,
  onPress,
  onSave
}: RecipeImageProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'recipeDetailsScreen' });
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SkeletonView
      isLoading={isLoading}
      style={[styles.skeleton, small && styles.smallContainer, mainContainerStyle]}
    >
      <Pressable
        style={[
          styles.image,
          styles.imageContainer,
          small && styles.smallContainer,
          mainContainerStyle
        ]}
        onPress={onPress}
      >
        {!!title && (
          <CustomText numberOfLines={2} style={styles.recipeTitle}>
            {title}
          </CustomText>
        )}
        {!!author && (
          <CustomText numberOfLines={1} style={styles.authorName}>
            {`${t('by')} ${author}`}
          </CustomText>
        )}
        <LinearGradient colors={colors.recipePreviewGradient} style={styles.gradient} />
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          onLoadEnd={() => setIsLoading(false)}
          fadeDuration={0}
        />
        {!!rating && <RatingChip rating={rating} style={styles.ratingChip} />}
        <View style={[styles.cornerContainer, onSave && styles.saveButtonContainer]}>
          <View style={styles.labelIconContainer}>
            {!!cookingTime && (
              <>
                <TimerIcon color={colors.grey[4]} />
                <CustomText style={styles.text}>{`${cookingTime} ${
                  cookingTime > 1 ? t('mins') : t('min')
                }`}</CustomText>
              </>
            )}
          </View>
          {difficulty && (
            <View style={styles.labelIconContainer}>
              <Ionicons name="barbell" size={20} color={colors.grey[4]} />
              <CustomText style={styles.text}>{difficulty}</CustomText>
            </View>
          )}
          {onSave && <SaveButton saved onPress={onSave} disabled={saveButtonDisabled} />}
        </View>
      </Pressable>
    </SkeletonView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover'
  },
  imageContainer: {
    backgroundColor: colors.grey[4],
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: colors.grey[4]
  },
  gradient: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1
  },
  cornerContainer: {
    position: 'absolute',
    bottom: 10,
    right: 7,
    zIndex: 2,
    height: 40,
    justifyContent: 'flex-end'
  },
  labelIconContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },
  ratingChip: {
    position: 'absolute',
    top: 10,
    right: 10
  },
  smallContainer: {
    flex: 1 / 2,
    marginBottom: 0
  },
  recipeTitle: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    color: colors.white,
    fontSize: 11,
    fontFamily: fonts.primary.semiBold,
    zIndex: 2,
    paddingHorizontal: 10
  },
  authorName: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    color: colors.grey[3],
    fontSize: 8,
    zIndex: 2,
    paddingHorizontal: 10
  },
  saveButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    right: 10,
    bottom: 10
  },
  skeleton: {
    borderRadius: 10,
    marginBottom: 10
  }
});

export default RecipeImage;
