import { useState } from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput, View } from 'react-native';

import Chip from '../atoms/Chip';
import CustomText from '../atoms/CustomText';

import ServingsIcon from '@/assets/icons/icon_servings.svg';
import { colors } from '@/assets/theme/AppTheme';
import { RecipeFormFields } from '@/enums/dbFields';

type ServingsPickerProps = {
  control: Control<FieldValues>;
  defaultValue?: number;
};

const MAX_SERVINGS = 99;
const MIN_SERVINGS = 1;

const ServingsPicker = ({ control, defaultValue }: ServingsPickerProps) => {
  const [servingsCount, setServingsCount] = useState<number>(defaultValue ?? 1);
  const { field } = useController({
    control,
    defaultValue: servingsCount.toString(),
    name: RecipeFormFields.Servings,
    rules: { required: true }
  });
  const { t } = useTranslation('translation', { keyPrefix: 'addRecipeScreen' });

  const handleServings = (add?: boolean) => {
    setServingsCount(state => {
      const newState = add ? state + 1 : state - 1;
      field.onChange(newState.toString());
      return newState;
    });
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.inputContainer}>
        <ServingsIcon />
        <TextInput
          editable={false}
          value={field.value}
          maxLength={2}
          style={[styles.servingsInput, styles.servingsText]}
        />
        <CustomText style={styles.servingsText}>
          {servingsCount > 1 ? t('servings') : t('serving')}
        </CustomText>
      </View>
      <View style={styles.chipsContainer}>
        <Chip
          outlined
          label="+"
          labelStyle={styles.plusAndMinus}
          pressBackgroundChange
          disabled={servingsCount === MAX_SERVINGS}
          onPress={() => handleServings(true)}
          style={styles.chip}
        />
        <Chip
          outlined
          label="-"
          labelStyle={styles.plusAndMinus}
          pressBackgroundChange
          disabled={servingsCount === MIN_SERVINGS}
          onPress={() => handleServings()}
          style={styles.chip}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  chipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  plusAndMinus: {
    fontSize: 14,
    color: colors.grey[3]
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },
  servingsInput: {
    width: 50,
    height: 24,
    paddingVertical: 0,
    paddingHorizontal: 0,
    maxWidth: 15
  },
  servingsText: {
    color: colors.grey[3],
    fontSize: 11
  },
  servingsCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5
  },
  chip: { borderColor: colors.grey[4], borderWidth: 1.5 }
});

export default ServingsPicker;
