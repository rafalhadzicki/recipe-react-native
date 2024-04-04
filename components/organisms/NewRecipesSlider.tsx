import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';

import CustomText from '../atoms/CustomText';
import NewRecipeThumbnail from '../molecules/NewRecipeThumbnail';
import { RecipesSliderProps } from './HomeRecipesSlider';

import { useGetRecipesByCategory } from '@/api/recipe';
import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';
import { RecipeFormFields, SortingDirections } from '@/enums/dbFields';
import { QueryKeys } from '@/enums/queryKeys';

const NewRecipesSlider = ({ categoryId }: RecipesSliderProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'homeScreen' });
  const { recipesByCategory, areRecipesLoading } = useGetRecipesByCategory(
    RecipeFormFields.createdAt,
    SortingDirections.Descending,
    categoryId,
    QueryKeys.RecipesByTime
  );

  return (
    <>
      {!!recipesByCategory?.length && (
        <View style={styles.mainContainer}>
          <CustomText style={styles.text}>{t('newRecipes')}</CustomText>
          <FlatList
            ItemSeparatorComponent={() => <View style={styles.separator}></View>}
            showsHorizontalScrollIndicator={false}
            data={recipesByCategory}
            renderItem={({ item, index }) => (
              <NewRecipeThumbnail selectedCategoryId={categoryId} {...item} />
            )}
            keyExtractor={item => item.id!}
            horizontal
            contentContainerStyle={styles.flatListContainer}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 3
  },
  flatListContainer: { paddingHorizontal: 30, paddingBottom: 18 },
  separator: {
    width: 15
  },
  text: {
    paddingHorizontal: 30,
    fontFamily: fonts.primary.semiBold,
    fontSize: 16,
    color: colors.black
  }
});

export default NewRecipesSlider;
