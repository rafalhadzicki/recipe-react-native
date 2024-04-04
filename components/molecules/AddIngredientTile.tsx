import { Ionicons } from '@expo/vector-icons';
import { Control, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ViewProps } from 'react-native';

import CustomInput from '../atoms/CustomInput';

import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';
import { REGEXES } from '@/utils/regexes';

type AddIngredientTileProps = ViewProps & {
  handleDelete: () => void;
  control: Control<FieldValues>;
  tileId: string;
  generateScreen?: boolean;
  autoFocus?: boolean;
  nameDefaultValue?: string;
  amountDefaultValue?: string;
};

const AddIngredientTile = ({
  generateScreen,
  tileId,
  control,
  autoFocus,
  nameDefaultValue,
  amountDefaultValue,
  handleDelete,
  ...props
}: AddIngredientTileProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'addRecipeScreen' });
  const inputName = generateScreen ? `ingredients.${tileId}` : `ingredients.${tileId}.name`;

  return (
    <View style={styles.mainContainer} {...props}>
      <View style={styles.tileContainer}>
        <View style={styles.icon}>
          <Ionicons name="pizza-outline" size={40} color={colors.grey[3]} />
        </View>
        <View style={styles.textContainer}>
          <CustomInput
            placeholder={t('ingredient')}
            name={inputName}
            control={control}
            style={styles.nameInput}
            rules={{ required: true, pattern: REGEXES.INGREDIENT_NAME }}
            maxLength={50}
            outerStyle={styles.outer}
            autoFocus={autoFocus}
            defaultValue={nameDefaultValue}
          />
          {!generateScreen && (
            <CustomInput
              placeholder={t('amount')}
              name={`ingredients.${tileId}.amount`}
              control={control}
              style={styles.amountInput}
              rules={{ required: true }}
              maxLength={20}
              defaultValue={amountDefaultValue}
            />
          )}
        </View>
      </View>
      <Ionicons
        name="close-circle-outline"
        size={20}
        color={colors.warningDark}
        style={styles.deleteButton}
        onPress={handleDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  tileContainer: {
    backgroundColor: colors.grey[5],
    width: '100%',
    height: 76,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 10
  },
  icon: {
    width: 52,
    height: 52,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  deleteButton: {
    marginLeft: 5
  },
  nameInput: {
    fontSize: 16,
    fontFamily: fonts.primary.semiBold,
    paddingHorizontal: 5
  },
  amountInput: {
    width: 73,
    fontSize: 14,
    paddingHorizontal: 5
  },
  outer: {
    flex: 1
  }
});

export default AddIngredientTile;
