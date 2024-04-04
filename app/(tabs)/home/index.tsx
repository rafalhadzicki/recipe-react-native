import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';

import { useGetCategory } from '@/api/recipe';
import { useGetUserPicture } from '@/api/user';
import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';
import CenteredSpinner from '@/components/atoms/CenteredSpinner';
import CustomText from '@/components/atoms/CustomText';
import SkeletonView from '@/components/atoms/SkeletonView';
import FoodCategoryFilter from '@/components/molecules/FoodCategoryFilter';
import SearchFilterButtons from '@/components/molecules/SearchFilterButtons';
import HomeRecipesSlider from '@/components/organisms/HomeRecipesSlider';
import NewRecipesSlider from '@/components/organisms/NewRecipesSlider';
import { allCategories } from '@/constants/allCategories';
import { firebaseAuth } from '@/firebase';

const RecipesPage = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'homeScreen' });
  const [selectedFoodCategoryId, setSelectedFoodCategoryId] = useState<string>(allCategories.id!);
  const [isPictureLoaded, setIsPictureLoaded] = useState(false);
  const { data } = useGetCategory();

  const userDisplayName = firebaseAuth.currentUser?.displayName || '';
  const { userPicture, isLoadingUserPicture } = useGetUserPicture(firebaseAuth.currentUser?.uid!);

  if (!data || isLoadingUserPicture) return <CenteredSpinner animating />; //TODO: add skeleton, add error handling

  return (
    <View style={styles.mainContainer}>
      <View style={styles.upperContentContainer}>
        <View style={styles.namePictureContainer}>
          <View style={styles.welcomeTextContainer}>
            <CustomText style={styles.welcomeText}>{`${t('hello')} ${
              userDisplayName.split(' ')[0]
            }`}</CustomText>
            <CustomText style={styles.whatAreYouCookingText}>{t('whatAreYouCooking')}</CustomText>
          </View>
          {userPicture && (
            <SkeletonView isLoading={!isPictureLoaded} style={styles.profilePicture}>
              <Image
                source={{ uri: userPicture }}
                style={styles.profilePicture}
                onLoadEnd={() => setIsPictureLoaded(true)}
              />
            </SkeletonView>
          )}
        </View>
        <SearchFilterButtons />
      </View>

      <FoodCategoryFilter
        selectedCategoryId={selectedFoodCategoryId}
        categories={data}
        SetCategoryId={setSelectedFoodCategoryId}
      />
      <HomeRecipesSlider categoryId={selectedFoodCategoryId} />
      <NewRecipesSlider categoryId={selectedFoodCategoryId} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  upperContentContainer: {
    paddingHorizontal: 30,
    marginBottom: 25,
    marginTop: 20
  },
  welcomeText: {
    fontFamily: fonts.primary.semiBold,
    fontSize: 20
  },
  whatAreYouCookingText: {
    fontSize: 11,
    color: colors.grey[3]
  },
  namePictureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 5
  },
  welcomeTextContainer: {
    gap: 5
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 10
  }
});

export default RecipesPage;
