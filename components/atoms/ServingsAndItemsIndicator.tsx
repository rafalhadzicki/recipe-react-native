import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import CustomText from './CustomText';

import fonts from '@/assets/fonts/fonts';
import ServingsIcon from '@/assets/icons/icon_servings.svg';
import { colors } from '@/assets/theme/AppTheme';

type ServingsAndItemsIndicatorProps = {
  servingsCount: number;
  itemsCount: number;
  stepsCount: number;
  ingredientsTabVisible: boolean;
};

const ServingsAndItemsIndicator = ({
  itemsCount,
  servingsCount,
  stepsCount,
  ingredientsTabVisible
}: ServingsAndItemsIndicatorProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'recipeDetailsScreen' });
  return (
    <View style={styles.mainContainer}>
      <View style={styles.iconLabel}>
        <ServingsIcon />

        <CustomText numberOfLines={1} style={styles.servingsCount}>
          {`${servingsCount} ${servingsCount > 1 ? t('servings') : t('serving')}`}
        </CustomText>
      </View>
      <CustomText style={styles.servingsCount}>
        {ingredientsTabVisible
          ? `${itemsCount} ${itemsCount > 1 ? t('items') : t('item')}`
          : `${stepsCount} ${stepsCount > 1 ? t('steps') : t('step')} `}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  servingsCount: {
    fontFamily: fonts.primary.semiBold,
    fontSize: 11,
    color: colors.grey[3]
  },
  mainContainer: {
    marginBottom: 20,
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemsCount: {
    color: colors.grey[3]
  },
  iconLabel: { maxWidth: '50%', flexDirection: 'row', alignItems: 'center', gap: 5 }
});

export default ServingsAndItemsIndicator;
