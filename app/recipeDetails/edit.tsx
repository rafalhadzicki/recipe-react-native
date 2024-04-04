import { ViewPager } from '@ui-kitten/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Keyboard, Platform, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { queryClient } from '../_layout';

import { useGetCategory, useGetRecipesById, useUpdateRecipe } from '@/api/recipe';
import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';
import CenteredSpinner from '@/components/atoms/CenteredSpinner';
import CustomHeader from '@/components/atoms/CustomHeader';
import CustomInput from '@/components/atoms/CustomInput';
import FoodCategoryFilter from '@/components/molecules/FoodCategoryFilter';
import CustomImagePicker from '@/components/molecules/ImagePicker';
import IngredientProcedurePicker from '@/components/molecules/IngredientProcedurePicker';
import PreparingTimeInput from '@/components/molecules/PreparingTimeInput';
import RecipeButton from '@/components/molecules/RecipeButton';
import ServingsPicker from '@/components/molecules/ServingsPicker';
import Ingredients from '@/components/organisms/Ingredients';
import PreparingSteps from '@/components/organisms/PreparingSteps';
import { RecipeFormFields } from '@/enums/dbFields';
import { HookFormErrors } from '@/enums/hookFormErrors';
import { QueryKeys } from '@/enums/queryKeys';
import { Recipe } from '@/models/firebase/recipe';
import { validateRecipeDifference } from '@/utils/validateRecipeDifference';

const EditRecipeScreen = () => {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'addRecipeScreen' });
  const [imageUri, setImageUri] = useState<string>('');
  const [pickedCategoryId, setPickedCategoryId] = useState<string>('');
  const [tabIndex, setTabIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  const { recipesById, areRecipesByIdLoading } = useGetRecipesById([recipeId!]);
  const { data: categories } = useGetCategory();
  const { updateRecipe, isRecipeUpdating } = useUpdateRecipe();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  useEffect(() => {
    if (!recipesById || !categories) return;
    const { imageUri: recipeUri } = recipesById[0];
    setImageUri(recipeUri!);
    setPickedCategoryId(recipesById[0].categoryId!);
  }, [recipesById, categories, setValue]);

  const onSubmit = (data: FieldValues) => {
    Keyboard.dismiss();
    const capitalizedName = (data.name.charAt(0).toUpperCase() + data.name.slice(1)) as string;
    const updatedRecipe: Recipe = {
      categoryId: pickedCategoryId,
      name: capitalizedName,
      preparingTime: Number(data.preparingTime),
      ingredients: Object.values(data.ingredients),
      preparingSteps: Object.values(data.preparing),
      servings: Number(data.servings)
    };

    if (validateRecipeDifference(updatedRecipe, imageUri, recipesById![0])) {
      Alert.alert(t('invalidForm'), t('invalidFormMessageEdit'));
      return;
    }
    updateRecipe(
      {
        recipeId: recipeId!,
        recipe: updatedRecipe,
        newUri: imageUri !== recipeUri ? imageUri : undefined
      },
      { onSuccess: handleSuccess }
    );
  };

  const handleFocus = (adjustKeyboard: boolean) => {
    scrollRef.current?.setNativeProps({ automaticallyAdjustKeyboardInsets: adjustKeyboard });
  };

  const handleInvalidData = () => {
    if (errors.preparingTime?.type === HookFormErrors.Pattern)
      return Alert.alert(t('invalidForm'), t('invalidPreparingTime'));
    else {
      Alert.alert(t('invalidForm'), t('invalidFormMessage'));
    }
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries([QueryKeys.Recipes, [recipeId]]);
    router.back();
  };

  if (!categories || !recipesById) return <CenteredSpinner />; //TODO: add skeleton, add error handling
  const {
    name,
    imageUri: recipeUri,
    servings,
    ingredients,
    preparingSteps,
    preparingTime
  } = recipesById[0];

  return (
    <SafeAreaView>
      <CustomHeader
        back
        rightItem={
          <RecipeButton
            label={t('editRecipe')}
            onPress={handleSubmit(onSubmit, handleInvalidData)}
          />
        }
      />
      <CenteredSpinner animating={areRecipesByIdLoading || isRecipeUpdating} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        alwaysBounceVertical={false}
        ref={scrollRef}
      >
        <View style={[styles.mainContainer]}>
          <CustomImagePicker defaultUri={recipeUri} setImage={setImageUri} />
          <CustomInput
            maxLength={52}
            placeholder={t('recipeName')}
            name={RecipeFormFields.Name}
            control={control}
            rules={{ required: true }}
            style={styles.nameInput}
            textBreakStrategy="highQuality"
            multiline
            onFocus={() => handleFocus(false)}
            onBlur={() => handleFocus(true)}
            defaultValue={name}
          />
          <FoodCategoryFilter
            selectedCategoryId={pickedCategoryId}
            addRecipePage
            SetCategoryId={setPickedCategoryId}
            categories={categories}
            mainContainerStyle={styles.categoriesPicker}
          />
          <PreparingTimeInput defaultValue={preparingTime} control={control} />
          <ServingsPicker defaultValue={servings} control={control} />
          <IngredientProcedurePicker setTabIndex={setTabIndex} />
        </View>
        <ViewPager swipeEnabled={false} selectedIndex={tabIndex}>
          <Ingredients ingredientsToEdit={ingredients} scrollRef={scrollRef} control={control} />
          <PreparingSteps stepsToEdit={preparingSteps} scrollRef={scrollRef} control={control} />
        </ViewPager>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 30,
    backgroundColor: colors.white
  },
  nameInput: {
    fontSize: 14,
    fontFamily: fonts.primary.semiBold,
    color: colors.black,
    height: 'auto',
    textAlignVertical: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
    marginBottom: 10
  },
  flex: {
    flex: 1
  },
  categoriesPicker: {
    paddingLeft: 0,
    marginBottom: 10
  }
});

export default EditRecipeScreen;
