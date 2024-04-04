import { Ionicons } from '@expo/vector-icons';
import { ViewPager } from '@ui-kitten/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGetRecipesById } from '@/api/recipe';
import { useGetUserPicture } from '@/api/user';
import fonts from '@/assets/fonts/fonts';
import MoreIcon from '@/assets/icons/icon_more.svg';
import { colors } from '@/assets/theme/AppTheme';
import CenteredSpinner from '@/components/atoms/CenteredSpinner';
import CustomButton from '@/components/atoms/CustomButton';
import CustomHeader from '@/components/atoms/CustomHeader';
import CustomText from '@/components/atoms/CustomText';
import RecipeNameAndRating from '@/components/atoms/RecipeNameAndRating';
import ServingsAndItemsIndicator from '@/components/atoms/ServingsAndItemsIndicator';
import SkeletonView from '@/components/atoms/SkeletonView';
import IngredientProcedurePicker from '@/components/molecules/IngredientProcedurePicker';
import MoreModal from '@/components/molecules/MoreModal';
import RecipeImage from '@/components/molecules/RecipeImage';
import Ingredients from '@/components/organisms/Ingredients';
import PreparingSteps from '@/components/organisms/PreparingSteps';
import { Routes } from '@/enums/screens';

const RecipePreview = () => {
  const { recipeId } = useLocalSearchParams<{
    recipeId: string;
  }>();
  const { push } = useRouter();

  const { recipesById, areRecipesByIdFetching } = useGetRecipesById([recipeId!]);
  const { userPicture } = useGetUserPicture(recipesById?.[0].authorId ?? '');
  const [tabIndex, setTabIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  if (!recipesById) return <CenteredSpinner animating />;
  const {
    rating,
    preparingTime,
    ratingCount,
    name,
    preparingSteps,
    servings,
    ingredients,
    imageUri,
    authorId
  } = recipesById[0];

  return (
    <>
      <SafeAreaView style={styles.flex}>
        <CustomHeader
          back
          rightItem={
            <CustomButton
              pressOpacity={0.3}
              onPress={() => setIsModalVisible(true)}
              style={styles.moreButton}
            >
              <MoreIcon />
            </CustomButton>
          }
        />
        <CenteredSpinner animating={areRecipesByIdFetching} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets
          alwaysBounceVertical={false}
          contentContainerStyle={styles.scrollView}
        >
          <View style={[styles.mainContainer]}>
            <RecipeImage rating={rating} cookingTime={preparingTime} imageUri={imageUri} />
            <RecipeNameAndRating name={name} ratingCount={ratingCount!} />

            <Pressable
              style={styles.authorInfo}
              onPress={() => push({ pathname: Routes.RecipeAuthor, params: { userId: authorId } })}
            >
              {userPicture ? (
                <SkeletonView isLoading={!isImageLoaded} style={styles.authorPicture}>
                  <Image
                    source={{ uri: userPicture }}
                    style={styles.authorPicture}
                    onLoadEnd={() => setIsImageLoaded(true)}
                  />
                </SkeletonView>
              ) : (
                <Ionicons name="person-circle-outline" size={40} color={colors.grey[3]} />
              )}
              <CustomText style={styles.userName}>{recipesById[0].authorName}</CustomText>
            </Pressable>

            <IngredientProcedurePicker setTabIndex={setTabIndex} />
            <ServingsAndItemsIndicator
              ingredientsTabVisible={tabIndex === 0}
              stepsCount={preparingSteps.length}
              servingsCount={servings}
              itemsCount={ingredients.length}
            />
          </View>
          <ViewPager swipeEnabled={false} selectedIndex={tabIndex}>
            <Ingredients ingredientsToDisplay={Object.values(ingredients)} />
            <PreparingSteps stepsToDisplay={Object.values(preparingSteps)} />
          </ViewPager>
        </ScrollView>
      </SafeAreaView>
      <MoreModal
        recipe={recipesById[0]}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      />
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 30,
    backgroundColor: colors.white
  },
  scrollView: {
    paddingBottom: 100
  },
  userName: {
    color: colors.label,
    fontFamily: fonts.primary.semiBold
  },
  flex: {
    flex: 1
  },
  moreButton: {
    width: 47,
    height: 47,
    justifyContent: 'flex-end',
    backgroundColor: colors.transparent
  },
  authorInfo: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8
  },
  authorPicture: {
    width: 40,
    height: 40,
    borderRadius: 20
  }
});

export default RecipePreview;
