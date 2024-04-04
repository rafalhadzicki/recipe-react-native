import { RefObject, useState } from 'react';
import { Control, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import IngredientTile from '../molecules/IngredientTile';

import CustomButton from '@/components/atoms/CustomButton';
import AddIngredientTile from '@/components/molecules/AddIngredientTile';
import { AIMissingIngredient } from '@/models/AIApi/AIRecipe';
import { Ingredient } from '@/models/firebase/recipe';
import { generateId } from '@/utils/generateId';

type IngredientsProps = {
  control?: Control<FieldValues>;
  scrollRef?: RefObject<ScrollView>;
  generateScreen?: boolean;
  ingredientsToDisplay?: Ingredient[];
  missingIngredients?: AIMissingIngredient[];
  isLoading?: boolean;
  ingredientsToEdit?: Ingredient[];
};

const Ingredients = ({
  ingredientsToDisplay,
  generateScreen,
  control,
  scrollRef,
  missingIngredients,
  isLoading,
  ingredientsToEdit
}: IngredientsProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'addRecipeScreen' });
  const initialIngredientsToEdit = ingredientsToEdit?.map(ingredient => {
    return {
      ...ingredient,
      id: generateId()
    };
  });
  const initialIngredient: Ingredient = {
    id: generateId(),
    name: '',
    amount: ''
  };
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialIngredientsToEdit ?? [initialIngredient]
  );
  const [isAutoFocusActive, setIsAutoFocusActive] = useState(false);

  const handleAddPreparing = () => {
    const newField: Ingredient = {
      id: generateId(),
      name: '',
      amount: ''
    };
    setIsAutoFocusActive(true);
    setIngredients(state => [...state, newField]);
  };

  const handleDeletePreparing = (id: string) => {
    if (ingredients.length === 1) return;
    setIngredients(state => state.filter(ingredient => ingredient.id !== id));
  };

  const handleScrollToEnd = () => {
    scrollRef && scrollRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View style={styles.mainContainer}>
      {ingredientsToDisplay
        ? ingredientsToDisplay.map((ingredient, index) => (
            <IngredientTile
              key={index}
              name={ingredient.name}
              amount={ingredient.amount}
              unit={ingredient.unit ? ingredient.unit : ''}
              isMissing={missingIngredients?.some(
                missingIngredient => missingIngredient.name === ingredient.name
              )}
            />
          ))
        : ingredients.map(({ id, amount, name }) => (
            <AddIngredientTile
              tileId={id!}
              key={id!}
              control={control!}
              handleDelete={() => handleDeletePreparing(id!)}
              onLayout={handleScrollToEnd}
              generateScreen={generateScreen}
              autoFocus={isAutoFocusActive}
              nameDefaultValue={name}
              amountDefaultValue={amount}
            />
          ))}
      {!ingredientsToDisplay && (
        <CustomButton
          disabled={isLoading}
          onPress={handleAddPreparing}
          label={t('addIngredient')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 30
  }
});

export default Ingredients;
