import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { useGetSavedRecipes, useUnsaveRecipe } from '@/api/recipe';
import CenteredSpinner from '@/components/atoms/CenteredSpinner';
import PlaceholderMessage from '@/components/atoms/PlaceholderMessage';
import RecipeImage from '@/components/molecules/RecipeImage';
import { Routes } from '@/enums/screens';

const RecipesPage = () => {
  const { savedRecipes, areSavedRecipesLoading } = useGetSavedRecipes();
  const { push } = useRouter();
  const { t } = useTranslation('translation', { keyPrefix: 'savedRecipesScreen' });

  const handleNavigateToRecipe = (id: string) => {
    push(`${Routes.RecipeDetails}/${id}`);
  };

  const { unsaveRecipe, isRecipeUnsaving } = useUnsaveRecipe();

  return (
    <>
      <CenteredSpinner animating={areSavedRecipesLoading || isRecipeUnsaving} />
      {savedRecipes?.length ? (
        <View style={styles.mainContainer}>
          <FlatList
            renderItem={({ item: { id, imageUri, preparingTime, name, authorName, rating } }) => (
              <RecipeImage
                title={name}
                imageUri={imageUri}
                cookingTime={preparingTime}
                author={authorName}
                rating={rating}
                onPress={() => handleNavigateToRecipe(id!)}
                onSave={() => {
                  unsaveRecipe(id!);
                }}
                saveButtonDisabled={isRecipeUnsaving}
              />
            )}
            data={savedRecipes}
            keyExtractor={item => item.id!}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatList}
          />
        </View>
      ) : (
        <>{!areSavedRecipesLoading && <PlaceholderMessage message={t('noRecipes')} />}</>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 10
  },
  flatList: {
    paddingBottom: 70
  }
});

export default RecipesPage;
