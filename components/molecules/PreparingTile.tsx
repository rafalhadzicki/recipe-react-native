import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import CustomText from '../atoms/CustomText';

import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';

type PreparingTileProps = {
  preparingStep: string;
  tileIndex: number;
};

const PreparingTile = ({ preparingStep, tileIndex }: PreparingTileProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'addRecipeScreen' });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.tileContainer}>
        <CustomText style={styles.stepText}>{`${t('step')} ${tileIndex + 1}`}</CustomText>
        <CustomText style={styles.preparingText}>{preparingStep}</CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  tileContainer: {
    backgroundColor: colors.grey[5],
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 5
  },
  stepText: {
    color: colors.label,
    fontSize: 11,
    fontFamily: fonts.primary.semiBold
  },
  preparingText: {
    height: 'auto',
    color: colors.grey[2],
    fontSize: 11
  }
});

export default PreparingTile;
