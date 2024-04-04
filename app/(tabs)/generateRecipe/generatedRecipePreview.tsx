import { ViewPager } from '@ui-kitten/components';
import { Tabs } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';
import CustomHeader from '@/components/atoms/CustomHeader';
import CustomText from '@/components/atoms/CustomText';
import IngredientProcedurePicker from '@/components/molecules/IngredientProcedurePicker';
import RecipeImage from '@/components/molecules/RecipeImage';
import Ingredients from '@/components/organisms/Ingredients';
import PreparingSteps from '@/components/organisms/PreparingSteps';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectLatestGeneratedRecipe } from '@/store/slices/generatedRecipesSlice';

const GeneratedRecipePreviewScreen = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const {
    name,
    image,
    ingredients,
    description,
    difficulty,
    cookingTime,
    steps,
    missingIngredients
  } = useAppSelector(selectLatestGeneratedRecipe);
  return (
    <>
      <Tabs.Screen
        options={{
          headerShown: true,
          header: () => <CustomHeader back />
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        alwaysBounceVertical={false}
        contentContainerStyle={styles.scrollView}
      >
        <View style={[styles.mainContainer]}>
          <RecipeImage cookingTime={cookingTime} difficulty={difficulty} imageUri={image} />
          <CustomText numberOfLines={2} style={styles.recipeTitle}>
            {name}
          </CustomText>
          <CustomText numberOfLines={4} style={styles.recipeDescription}>
            {description}
          </CustomText>
          <IngredientProcedurePicker setTabIndex={setTabIndex} />
        </View>
        <ViewPager swipeEnabled={false} selectedIndex={tabIndex}>
          <Ingredients missingIngredients={missingIngredients} ingredientsToDisplay={ingredients} />
          <PreparingSteps stepsToDisplay={steps} />
        </ViewPager>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 30,
    backgroundColor: colors.white
  },
  recipeTitle: {
    fontFamily: fonts.primary.semiBold,
    marginBottom: 10
  },
  scrollView: {
    paddingBottom: 100
  },
  recipeDescription: {
    color: colors.label
  }
});

export default GeneratedRecipePreviewScreen;
