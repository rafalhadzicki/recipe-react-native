import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';

import CenteredSpinner from '../atoms/CenteredSpinner';
import PlaceholderMessage from '../atoms/PlaceholderMessage';
import HomeRecipeThumbnail from '../molecules/HomeRecipeThumbnail';

import { useGetRecipesByCategory, useGetSavedRecipesIds } from '@/api/recipe';
import { RecipeFormFields, SortingDirections } from '@/enums/dbFields';
import { QueryKeys } from '@/enums/queryKeys';

export type RecipesSliderProps = {
  categoryId: string;
};

const HomeRecipesSlider = ({ categoryId }: RecipesSliderProps) => {
  const { recipesByCategory, areRecipesLoading } = useGetRecipesByCategory(
    RecipeFormFields.Rating,
    SortingDirections.Descending,
    categoryId,
    QueryKeys.RecipesByRating
  );
  const { savedRecipesIds, areSavedRecipesIdsLoading } = useGetSavedRecipesIds();
  const { t } = useTranslation('translation', { keyPrefix: 'homeScreen' });

  return (
    <View style={styles.mainContainer}>
      <CenteredSpinner animating={areRecipesLoading || areSavedRecipesIdsLoading} />
      {!areRecipesLoading && !areSavedRecipesIdsLoading && (
        <>
          {recipesByCategory?.length ? (
            <FlatList
              ItemSeparatorComponent={() => <View style={styles.separator}></View>}
              showsHorizontalScrollIndicator={false}
              data={recipesByCategory}
              renderItem={({ item }) => (
                <HomeRecipeThumbnail
                  isSaved={savedRecipesIds?.includes(item.id!)}
                  selectedCategoryId={categoryId}
                  {...item}
                />
              )}
              keyExtractor={item => item.id!}
              horizontal
              contentContainerStyle={styles.flatListContainer}
            />
          ) : (
            <PlaceholderMessage message={t('noRecipes')} />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: 231,
    marginTop: 23,
    marginBottom: 20
  },
  flatListContainer: { paddingHorizontal: 30 },
  separator: {
    width: 15
  }
});

export default HomeRecipesSlider;
