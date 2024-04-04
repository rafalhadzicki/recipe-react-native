import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

import CustomText from '../atoms/CustomText';
import SkeletonView from '../atoms/SkeletonView';
import { RecipeThumbnailProps } from './HomeRecipeThumbnail';

import { useGetUserById, useGetUserPicture } from '@/api/user';
import fonts from '@/assets/fonts/fonts';
import StarIcon from '@/assets/icons/icon_star.svg';
import TimerIcon from '@/assets/icons/icon_timer.svg';
import { colors } from '@/assets/theme/AppTheme';
import { Routes } from '@/enums/screens';
const NewRecipeThumbnail = ({ selectedCategoryId, ...recipe }: RecipeThumbnailProps) => {
  const { id, name, preparingTime, rating, authorId, imageUri } = recipe;
  const { userPicture } = useGetUserPicture(authorId!);
  const { userById } = useGetUserById(authorId!);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [userPictureLoaded, setUserPictureLoaded] = useState(false);
  const { t } = useTranslation('translation', { keyPrefix: 'homeScreen' });

  return (
    <Link href={`${Routes.RecipeDetails}/${id}`} asChild>
      <Pressable disabled={!isImageLoaded} style={styles.mainContainer}>
        <SkeletonView isLoading={!isImageLoaded} style={[styles.imageSkeletonBackground]}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            onLoadEnd={() => setIsImageLoaded(true)}
            fadeDuration={0}
          />
        </SkeletonView>
        <Shadow startColor={colors.shadow}>
          <SkeletonView isLoading={!isImageLoaded} style={[styles.innerContainer]}>
            {isImageLoaded && (
              <>
                <View>
                  <CustomText numberOfLines={1} style={styles.name}>
                    {name}
                  </CustomText>
                  {!!rating && (
                    <View style={styles.starsContainer}>
                      {Array.from({ length: rating }, (_, index) => (
                        <StarIcon color={colors.rating} key={index} />
                      ))}
                    </View>
                  )}
                </View>
                <View style={styles.bottomContent}>
                  <View style={styles.userContainer}>
                    {userPicture ? (
                      <SkeletonView isLoading={!userPictureLoaded} style={styles.userPicture}>
                        <Image
                          source={{ uri: userPicture }}
                          style={styles.userPicture}
                          onLoadEnd={() => setUserPictureLoaded(true)}
                        />
                      </SkeletonView>
                    ) : (
                      <Ionicons name="person-circle-outline" size={25} color={colors.grey[3]} />
                    )}
                    <CustomText style={[styles.bottomText, { maxWidth: 125 }]} numberOfLines={1}>
                      {userById?.displayName}
                    </CustomText>
                  </View>
                  <View style={styles.preparingContainer}>
                    <TimerIcon color={colors.grey[3]} />
                    <CustomText numberOfLines={1} style={[styles.bottomText, { maxWidth: 50 }]}>
                      {`${preparingTime} ${t('mins')}`}
                    </CustomText>
                  </View>
                </View>
              </>
            )}
          </SkeletonView>
        </Shadow>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: 251,
    height: 127,
    justifyContent: 'flex-end'
  },
  innerContainer: {
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    width: 251,
    height: 95,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 9
  },
  name: {
    fontSize: 14,
    color: colors.grey[1],
    fontFamily: fonts.primary.semiBold,
    maxWidth: 139
  },
  timeText: {
    fontSize: 11,
    color: colors.grey[1],
    fontFamily: fonts.primary.semiBold
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: 'cover'
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  bottomText: {
    fontSize: 11,
    color: colors.grey[3]
  },
  bottomContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  preparingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  userPicture: {
    width: 25,
    height: 25,
    borderRadius: 12.5
  },
  imageSkeletonBackground: {
    backgroundColor: colors.grey[3],
    position: 'absolute',
    top: 0,
    right: 9,
    zIndex: 1,
    borderRadius: 40
  }
});

export default NewRecipeThumbnail;
