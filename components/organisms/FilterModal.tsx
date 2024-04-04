import { UseMutateFunction } from '@tanstack/react-query';
import { FirebaseError } from 'firebase/app';
import { useEffect, useState } from 'react';
import { Control, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import Chip from '../atoms/Chip';
import CustomButton from '../atoms/CustomButton';
import CustomText from '../atoms/CustomText';

import { useGetCategory } from '@/api/recipe';
import fonts from '@/assets/fonts/fonts';
import StarIcon from '@/assets/icons/icon_star.svg';
import { colors } from '@/assets/theme/AppTheme';
import { allCategories } from '@/constants/allCategories';
import { rateFilterButtons, timeFilterButtons } from '@/constants/customButtons';
import { RecipeFormFields, SortingDirections } from '@/enums/dbFields';
import { Recipe, RecipeSortingParams } from '@/models/firebase/recipe';

const ALL_RATINGS_VALUE = 6;

type FilterModalProps = {
  isModalVisible: boolean;
  control: Control<FieldValues>;
  mutate: UseMutateFunction<Recipe[], FirebaseError, RecipeSortingParams, unknown>;
  hideModal: () => void;
  setRecipes: (recipes: Recipe[]) => void;
  setSearchParams?: (params: RecipeSortingParams) => void;
};

const FilterModal = ({
  isModalVisible,
  control,
  mutate,
  hideModal,
  setRecipes,
  setSearchParams
}: FilterModalProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'searchScreen' });

  const [selectedRating, setSelectedRating] = useState<number>(ALL_RATINGS_VALUE);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(allCategories.id!);
  const [sortingDirection, setSortingDirection] = useState<SortingDirections>(
    SortingDirections.Descending
  );

  const { data } = useGetCategory();

  const modalBottomPosition = useSharedValue(-450);
  const animationStyle = useAnimatedStyle(() => {
    return {
      bottom: modalBottomPosition.value
    };
  });

  const handleButtonPress = () => {
    control._reset();
    hideModal();
    const params: RecipeSortingParams = {
      sortBy: RecipeFormFields.createdAt,
      direction: sortingDirection,
      rating: selectedRating === ALL_RATINGS_VALUE ? undefined : selectedRating,
      categoryId: selectedCategoryId === allCategories.id ? undefined : selectedCategoryId
    };
    mutate(params, { onSuccess: data => handleSuccess(data, params) });
  };

  const handleSuccess = (data: Recipe[], params: RecipeSortingParams) => {
    const lastVisibleDocId = data[data.length - 1].id!;
    setRecipes(data);
    const newParams: RecipeSortingParams = { ...params, lastVisibleDocId };
    setSearchParams && setSearchParams(newParams);
  };

  useEffect(() => {
    if (isModalVisible) {
      modalBottomPosition.value = withTiming(0, { duration: 300 });
    } else {
      modalBottomPosition.value = withTiming(-450, { duration: 300 });
    }
  }, [isModalVisible, modalBottomPosition]);

  return (
    <Animated.View style={[styles.mainContainer, animationStyle]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CustomText style={[styles.text, styles.headerText]}>{t('filterSearch')}</CustomText>
        <CustomText style={styles.text}>{t('time')}</CustomText>
        <View style={styles.chipContainer}>
          {timeFilterButtons.map(({ id, name, value }) => (
            <Chip
              outlined
              key={id}
              label={t(name)}
              selected={sortingDirection === value}
              onPress={() => setSortingDirection(value)}
            />
          ))}
        </View>
        <CustomText style={styles.text}>{t('rate')}</CustomText>
        <View style={styles.chipContainer}>
          {rateFilterButtons.map(({ id, name, value }) => (
            <Chip
              outlined
              key={id}
              label={name}
              selected={selectedRating === value}
              onPress={() => setSelectedRating(value)}
              childrenOnRight
              style={styles.chipStyle}
              labelStyle={{ height: 18 }}
            >
              <StarIcon
                height={18}
                width={18}
                color={selectedRating === value ? colors.white : colors.green[100]}
                style={[styles.iconStyle]}
              />
            </Chip>
          ))}
        </View>
        <CustomText style={styles.text}>{t('category')}</CustomText>
        <View style={styles.chipContainer}>
          {data &&
            [allCategories, ...data].map(({ id, name }) => (
              <Chip
                outlined
                key={id}
                label={name}
                selected={selectedCategoryId === id}
                onPress={() => setSelectedCategoryId(id!)}
              />
            ))}
        </View>
        <CustomButton label={t('filter')} style={styles.button} onPress={handleButtonPress} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: 450,
    position: 'absolute',
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
    backgroundColor: colors.white,
    paddingHorizontal: 30
  },
  text: {
    fontFamily: fonts.primary.semiBold,
    marginVertical: 10
  },
  headerText: {
    paddingTop: 31,
    textAlign: 'center'
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  iconStyle: {
    marginLeft: 5
  },

  chipStyle: {
    paddingHorizontal: 10,
    height: 28
  },
  button: {
    marginTop: 30,
    marginBottom: 22,
    width: 'auto',
    marginHorizontal: 60
  }
});

export default FilterModal;
