import { Control, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import CustomInput from '../atoms/CustomInput';
import CustomText from '../atoms/CustomText';

import { colors } from '@/assets/theme/AppTheme';
import { RecipeFormFields } from '@/enums/dbFields';
import { REGEXES } from '@/utils/regexes';

type PreparingTimeInputProps = {
  control: Control<FieldValues>;
  defaultValue?: number;
};

const PreparingTimeInput = ({ control, defaultValue }: PreparingTimeInputProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'addRecipeScreen' });

  return (
    <View style={styles.mainContainer}>
      <CustomText style={styles.text}>{t('preparingTime')}</CustomText>
      <View style={styles.inputContainer}>
        <CustomInput
          name={RecipeFormFields.PreparingTime}
          control={control}
          defaultValue={defaultValue ? String(defaultValue) : '30'}
          style={[styles.input, styles.text]}
          keyboardType="numeric"
          maxLength={3}
          rules={{ required: true, pattern: REGEXES.ONLY_NUMBERS }}
        />
        <CustomText style={styles.text}>{t('mins')}</CustomText>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 114,
    gap: 10
  },
  input: {
    width: 52.7,
    height: 31,
    paddingVertical: 0,
    paddingHorizontal: 10
  },
  text: {
    fontSize: 14,
    color: colors.grey[3]
  }
});

export default PreparingTimeInput;
