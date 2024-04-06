import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGetFilteredRecipes, useGetRecipesById } from '@/api/recipe';
import fonts from '@/assets/fonts/fonts';
import CenteredSpinner from '@/components/atoms/CenteredSpinner';
import CustomHeader from '@/components/atoms/CustomHeader';
import CustomText from '@/components/atoms/CustomText';
import PlaceholderMessage from '@/components/atoms/PlaceholderMessage';
import RecipeImage from '@/components/molecules/RecipeImage';
import SearchFilter from '@/components/molecules/SearchFilter';
import FilterModal from '@/components/organisms/FilterModal';
import { RecipeFormFields, SearchFormFields, SortingDirections } from '@/enums/dbFields';
import { Routes } from '@/enums/screens';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { Recipe, RecipeSortingParams } from '@/models/firebase/recipe';
import { addRecentRecipe, selectRecentRecipesIds } from '@/store/slices/recentRecipesSlice';

const SearchScreen = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'searchScreen' });
  const { control, handleSubmit, watch } = useForm();
  const { push } = useRouter();
  const { filter } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const recentRecipesIds = useAppSelector(selectRecentRecipesIds);

  const { getFilteredRecipes, areFilteredRecipesLoading } = useGetFilteredRecipes();
  const { recipesById, areRecipesByIdLoading } = useGetRecipesById(recentRecipesIds);

  const [isModalVisible, setIsModalVisible] = useState(!!filter);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchParams, setSearchParams] = useState<RecipeSortingParams>();
  const inputWatch = watch(SearchFormFields.Name);

  useEffect(() => {
    if (!inputWatch) {
      setFilteredRecipes([]);
      setSearchParams(undefined);
    }
  }, [inputWatch]);

  const handleSearch = (data: FieldValues) => {
    const name = data.name;
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    const searchParams: RecipeSortingParams = {
      name: capitalizedName,
      sortBy: RecipeFormFields.Name,
      direction: SortingDirections.Ascending
    };
    handleDataFetch(searchParams, true);
  };

  const handleNavigateToRecipe = (id: string) => {
    dispatch(addRecentRecipe(id));
    push(`${Routes.RecipeDetails}/${id}`);
  };

  const handleTouchOutside = () => {
    Keyboard.dismiss();
    setIsModalVisible(false);
  };

  const handleDataFetch = (searchParams: RecipeSortingParams, searchBar: boolean) => {
    getFilteredRecipes(searchParams, {
      onSuccess: data => handleSuccess(data, searchParams, searchBar)
    });
  };

  const handleSuccess = (data: Recipe[], searchParams: RecipeSortingParams, searchBar: boolean) => {
    if (
      !searchBar &&
      data.length &&
      data[data.length - 1]?.id !== filteredRecipes[filteredRecipes.length - 1]?.id
    ) {
      setFilteredRecipes(prev => [...prev, ...data]);
    }
    if (searchBar) {
      if (!data.length) {
        setSearchParams(undefined);
        setFilteredRecipes([]);
        return;
      }
      setFilteredRecipes(data);
    } else return;
    const newSearchParams: RecipeSortingParams = {
      lastVisibleDocId: data[data.length - 1].id,
      ...searchParams
    };
    setSearchParams(newSearchParams);
  };

  return (
    <>
      <SafeAreaView style={styles.flex}>
        <Pressable style={styles.flex} onPress={handleTouchOutside}>
          <CustomHeader title={t('screenName')} back />
          <CenteredSpinner animating={areRecipesByIdLoading || areFilteredRecipesLoading} />
          <View style={[styles.flex, styles.mainContainer]}>
            <SearchFilter
              onSearch={handleSubmit(handleSearch)}
              control={control}
              onFilterButtonPress={() => setIsModalVisible(prev => !prev)}
              onInputFocus={() => setIsModalVisible(false)}
            />
            <CustomText style={styles.searchText}>
              {filteredRecipes.length || inputWatch
                ? t('searchResult')
                : recipesById && t('recentSearch')}
            </CustomText>
            {!filteredRecipes.length && inputWatch && !areFilteredRecipesLoading && (
              <PlaceholderMessage message={t('noRecipes')} />
            )}
            <FlatList
              data={filteredRecipes.length ? filteredRecipes : inputWatch ? [] : recipesById}
              renderItem={({ item, index }) => (
                <RecipeImage
                  small
                  imageUri={item.imageUri}
                  mainContainerStyle={index % 2 === 0 && { marginRight: 15 }}
                  rating={item.rating}
                  title={item.name}
                  onPress={() => handleNavigateToRecipe(item.id!)}
                  author={item.authorName}
                />
              )}
              keyExtractor={item => item.id!}
              numColumns={2}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              showsVerticalScrollIndicator={false}
              onEndReached={() => {
                searchParams && handleDataFetch(searchParams, false);
              }}
              onEndReachedThreshold={0.5}
            />
          </View>
        </Pressable>
      </SafeAreaView>
      <FilterModal
        control={control}
        mutate={getFilteredRecipes}
        isModalVisible={isModalVisible}
        hideModal={() => setIsModalVisible(false)}
        setRecipes={setFilteredRecipes}
        setSearchParams={setSearchParams}
      />
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 30
  },
  flex: {
    flex: 1
  },
  separator: {
    height: 15
  },
  searchText: {
    fontSize: 16,
    fontFamily: fonts.primary.semiBold,
    marginVertical: 20
  }
});

export default SearchScreen;
