import { Ionicons } from '@expo/vector-icons';
import { Control, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ViewProps } from 'react-native';

import CustomInput from '../atoms/CustomInput';
import CustomText from '../atoms/CustomText';

import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';

type AddPreparingTileProps = ViewProps & {
  handleDelete: () => void;
  control: Control<FieldValues>;
  tileIndex: number;
  tileId: string;
  defaultValue?: string;
  autoFocus?: boolean;
};

const AddPreparingTile = ({
  tileIndex,
  tileId,
  control,
  defaultValue,
  handleDelete,
  autoFocus,
  ...props
}: AddPreparingTileProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'addRecipeScreen' });

  return (
    <View style={styles.mainContainer} {...props}>
      <View style={styles.tileContainer}>
        <CustomText style={styles.stepText}>{`${t('step')} ${tileIndex + 1}`}</CustomText>
        <CustomInput
          maxLength={300}
          placeholder={t('step')}
          name={`preparing.${tileId}`}
          control={control}
          rules={{ required: true }}
          style={styles.preparingInput}
          multiline
          defaultValue={defaultValue}
          autoFocus={autoFocus}
        />
      </View>
      <Ionicons
        name="close-circle-outline"
        size={20}
        color={colors.warningDark}
        style={{ marginLeft: 5 }}
        onPress={handleDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  tileContainer: {
    backgroundColor: colors.grey[4],
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
  preparingInput: {
    height: 'auto',
    paddingTop: 10,
    paddingBottom: 10
  }
});

export default AddPreparingTile;
