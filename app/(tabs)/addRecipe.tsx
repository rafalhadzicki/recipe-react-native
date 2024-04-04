import { ViewPager } from '@ui-kitten/components';
import dayjs from 'dayjs';
import { Tabs, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Keyboard, Platform, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { useAddRecipe, useGetCategory } from '@/api/recipe';
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
import { firebaseAuth } from '@/firebase';
import { Recipe } from '@/models/firebase/recipe';

const AddRecipeScreen = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'addRecipeScreen' });
  const [imageUri, setImageUri] = useState<string>('');
  const [tabIndex, setTabIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const [pickedCategoryId, setPickedCategoryId] = useState<string>('');
  const { data: categories } = useGetCategory();

  const router = useRouter();

  const { addRecipe, isRecipeBeingAdded } = useAddRecipe();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (!categories) return;
    setPickedCategoryId(categories[0].id!);
  }, [categories]);

  const onSubmit = (data: FieldValues) => {
    Keyboard.dismiss();
    if (!imageUri) return handleInvalidData();
    const capitalizedName = (data.name.charAt(0).toUpperCase() + data.name.slice(1)) as string;
    const recipe: Recipe = {
      createdAt: dayjs().valueOf(),
      authorId: firebaseAuth.currentUser?.uid!,
      categoryId: pickedCategoryId,
      name: capitalizedName,
      preparingTime: Number(data.preparingTime),
      ingredients: Object.values(data.ingredients),
      preparingSteps: Object.values(data.preparing),
      rating: 0,
      ratingCount: 0,
      servings: Number(data.servings),
      authorName: firebaseAuth.currentUser?.displayName!
    };
    addRecipe({ recipe, imageUri }, { onSuccess: () => handleSuccess() });
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
    router.back();
  };

  if (!categories) return <CenteredSpinner />; //TODO: add skeleton, add error handling

  return (
    <>
      <CenteredSpinner animating={isRecipeBeingAdded} />
      <Tabs.Screen
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader
              back
              rightItem={
                <RecipeButton
                  label={t('screenName')}
                  onPress={handleSubmit(onSubmit, handleInvalidData)}
                />
              }
            />
          )
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        alwaysBounceVertical={false}
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={[styles.mainContainer]}>
          <CustomImagePicker setImage={setImageUri} />
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
          />
          <FoodCategoryFilter
            selectedCategoryId={pickedCategoryId}
            addRecipePage
            SetCategoryId={setPickedCategoryId}
            categories={categories}
            mainContainerStyle={styles.categoriesPicker}
          />
          <PreparingTimeInput control={control} />
          <ServingsPicker control={control} />
          <IngredientProcedurePicker setTabIndex={setTabIndex} />
        </View>
        <ViewPager swipeEnabled={false} selectedIndex={tabIndex}>
          <Ingredients scrollRef={scrollRef} control={control} />
          <PreparingSteps scrollRef={scrollRef} control={control} />
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

export default AddRecipeScreen;
