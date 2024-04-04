import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import CustomText from '../atoms/CustomText';

import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';
import { Ingredient } from '@/models/firebase/recipe';

type IngredientTileProps = Ingredient & {
  isMissing?: boolean;
};

const IngredientTile = ({ name, amount, unit, isMissing }: IngredientTileProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'generatedRecipeScreen' });
  return (
    <View style={styles.mainContainer}>
      <View
        style={[
          styles.tileContainer,
          isMissing && { borderColor: colors.warningDark, borderWidth: 1 }
        ]}
      >
        <View style={styles.icon}>
          <Ionicons name="pizza-outline" size={40} color={colors.grey[3]} />
        </View>
        <View style={styles.textContainer}>
          <CustomText numberOfLines={1} style={styles.nameText}>
            {name}
          </CustomText>
          <CustomText numberOfLines={1} style={styles.amountText}>
            {`${amount} ${unit}`}
          </CustomText>
        </View>
      </View>
      {isMissing && (
        <View style={styles.missingIngredientLabel}>
          <CustomText style={styles.missingIngredientText}>{t('missingIngredient')}</CustomText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { marginBottom: 10 },
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
  nameText: {
    fontSize: 16,
    fontFamily: fonts.primary.semiBold,
    paddingHorizontal: 5,
    minWidth: '30%'
  },
  amountText: {
    fontSize: 14,
    paddingHorizontal: 5,
    textAlign: 'right',
    color: colors.grey[3],
    flex: 1
  },
  missingIngredientLabel: {
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    right: 27,
    backgroundColor: colors.grey[5],
    paddingHorizontal: 5
  },
  missingIngredientText: {
    color: colors.warningDark,
    fontSize: 11,
    marginTop: 10,
    bottom: -7
  }
});

export default IngredientTile;
