import { Tabs, useRouter } from 'expo-router';
import { useRef } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Keyboard, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { useGenerateRecipe, useValidateRecipe } from '@/api/generateRecipe';
import CenteredSpinner from '@/components/atoms/CenteredSpinner';
import CustomButton from '@/components/atoms/CustomButton';
import CustomHeader from '@/components/atoms/CustomHeader';
import AddIngredient from '@/components/organisms/Ingredients';
import { MeasurementSystems } from '@/enums/measurmentSystems';
import { Routes } from '@/enums/screens';
import { useAppDispatch } from '@/hooks/reduxHooks';
import {
  AIRecipe,
  AIRecipeEdibilityCheck,
  AIRecipeEdibilityCheckRequest,
  AIRecipeRequest
} from '@/models/AIApi/AIRecipe';
import { addRecipe } from '@/store/slices/generatedRecipesSlice';

const GenerateRecipeScreen = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'generateRecipeScreen' });
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { generateRecipe, isRecipeGenerating } = useGenerateRecipe();
  const { validateRecipe, isValidating } = useValidateRecipe();
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: FieldValues) => {
    Keyboard.dismiss();
    const ingredients: AIRecipeEdibilityCheckRequest = {
      ingredients: Object.values(data.ingredients) as string[]
    };
    validateRecipe(ingredients, {
      onSuccess: data => handleValidate(data, ingredients),
      onError: handleApiError
    });
  };

  const handleInvalidData = () => {
    Alert.alert(t('invalidForm'), t('invalidFormMessage'));
  };

  const handleApiError = () => {
    Alert.alert(t('error'), t('apiError'));
  };

  const handleSuccess = (data: AIRecipe) => {
    dispatch(addRecipe(data));
    router.push(Routes.GeneratedRecipePreview);
  };

  //Temporary, will be done at backend
  const handleValidate = (
    edibilityCheckData: AIRecipeEdibilityCheck[],
    edibilityCheckRequest: AIRecipeEdibilityCheckRequest
  ) => {
    const inedibleIngredients = edibilityCheckData
      .filter(item => !item.edible)
      .map(item => item.ingredient);

    if (inedibleIngredients.length) {
      Alert.alert(
        t('invalidIngredients'),
        `${t('inedibleIngredients')} ${inedibleIngredients.join(', ')}`
      );
    } else {
      const request: AIRecipeRequest = {
        ingredients: edibilityCheckRequest.ingredients,
        generateImage: true,
        measurementSystem: MeasurementSystems.Metric
      };
      generateRecipe(request, {
        onSuccess: handleSuccess,
        onError: handleApiError
      });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <CenteredSpinner animating={isRecipeGenerating || isValidating} />
      <Tabs.Screen
        options={{
          headerShown: true,
          header: () => <CustomHeader title={t('screenName')} />
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
        <AddIngredient
          isLoading={isRecipeGenerating || isValidating}
          generateScreen
          scrollRef={scrollRef}
          control={control}
        />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <CustomButton
          disabled={isRecipeGenerating || isValidating}
          label={t('screenName')}
          onPress={handleSubmit(onSubmit, handleInvalidData)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingBottom: 85,
    justifyContent: 'space-between',
    flex: 1
  },
  buttonContainer: {
    paddingHorizontal: 30,
    marginTop: 20
  }
});

export default GenerateRecipeScreen;
