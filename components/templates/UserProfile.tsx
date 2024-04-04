import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import CenteredSpinner from '../atoms/CenteredSpinner';
import CustomText from '../atoms/CustomText';
import PlaceholderMessage from '../atoms/PlaceholderMessage';
import RecipeImage from '../molecules/RecipeImage';

import { useGetRecipesById } from '@/api/recipe';
import { useGetUserPicture } from '@/api/user';
import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';
import CustomImagePicker from '@/components/molecules/ImagePicker';
import { Routes } from '@/enums/screens';
import { firebaseAuth } from '@/firebase';
import { FirebaseUserProfile } from '@/models/firebase/userData';

type UserProfileProps = {
  user?: FirebaseUserProfile;
  isLoading: boolean;
};

const UserProfile = ({ user, isLoading }: UserProfileProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'userProfileScreen' });
  const { recipesById, areRecipesByIdLoading } = useGetRecipesById(user?.createdRecipesIds ?? []);
  const { userPicture, isLoadingUserPicture } = useGetUserPicture(user?.id!);
  const { push } = useRouter();

  const handleNavigateToRecipe = (id: string) => {
    push(`${Routes.RecipeDetails}/${id}`);
  };

  return (
    <>
      <CenteredSpinner animating={isLoading || isLoadingUserPicture || areRecipesByIdLoading} />
      {user && !isLoadingUserPicture && (
        <View style={styles.mainContainer}>
          <View style={styles.imagePickerContainer}>
            <CustomImagePicker
              disabled={user.id !== firebaseAuth.currentUser?.uid}
              defaultUri={userPicture}
              userPicture
              style={{ height: 100, width: 100, borderRadius: 50 }}
              placeholder={
                <Ionicons name="person-circle-outline" size={80} color={colors.grey[3]} />
              }
            />
            <CustomText style={styles.userName}>{user.displayName}</CustomText>
          </View>
          <View style={styles.labelContainer}>
            <CustomText style={styles.recipesLabelText}>{t('recipes')}</CustomText>
          </View>
          {!areRecipesByIdLoading && (
            <>
              {recipesById?.length ? (
                <FlatList
                  renderItem={({
                    item: { id, imageUri, preparingTime, name, authorName, rating }
                  }) => (
                    <RecipeImage
                      title={name}
                      imageUri={imageUri}
                      cookingTime={preparingTime}
                      author={authorName}
                      rating={rating}
                      onPress={() => handleNavigateToRecipe(id!)}
                    />
                  )}
                  data={recipesById}
                  keyExtractor={item => item.id!}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.flatList}
                  style={{ marginTop: 20 }}
                />
              ) : (
                <PlaceholderMessage message={t('noRecipes')} />
              )}
            </>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 30
  },
  moreButton: {
    width: 47,
    height: 47,
    justifyContent: 'flex-end',
    backgroundColor: colors.transparent
  },
  userName: {
    fontSize: 16,
    fontFamily: fonts.primary.semiBold,
    color: colors.label,
    marginBottom: 30
  },
  flatList: {
    paddingBottom: 70
  },
  imagePickerContainer: {
    width: '100%',
    alignItems: 'center'
  },

  recipesLabelText: {
    fontSize: 11,
    fontFamily: fonts.primary.semiBold,
    color: colors.green[100],
    textAlign: 'center',
    paddingVertical: 8
  },
  labelContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.grey[3]
  }
});

export default UserProfile;
