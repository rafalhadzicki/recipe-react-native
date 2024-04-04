import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import Chip from '../atoms/Chip';

type IngredientProcedurePickerProps = {
  setTabIndex: (index: number) => void;
};

const IngredientProcedurePicker = ({ setTabIndex }: IngredientProcedurePickerProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'addRecipeScreen' });
  const [ingredientsSelected, setIngredientsSelected] = useState(true);

  const handleSelectedButton = (ingredientsSelected: boolean, index: number) => {
    setIngredientsSelected(ingredientsSelected);
    setTabIndex(index);
  };

  return (
    <View style={styles.mainContainer}>
      <Chip
        label={t('ingredients')}
        labelStyle={styles.label}
        style={styles.button}
        selected={ingredientsSelected}
        onPress={() => handleSelectedButton(true, 0)}
      />
      <Chip
        label={t('procedure')}
        labelStyle={styles.label}
        style={styles.button}
        selected={!ingredientsSelected}
        onPress={() => handleSelectedButton(false, 1)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    width: 150,
    height: 33
  },
  label: {
    fontSize: 11
  }
});

export default IngredientProcedurePicker;
