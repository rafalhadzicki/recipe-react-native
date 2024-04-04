import { StyleSheet } from 'react-native';

import CustomButton, { CustomButtonProps } from './CustomButton';

import SaveIconActive from '@/assets/icons/icon_saved_active.svg';
import SaveIconInactive from '@/assets/icons/icon_saved_inactive.svg';
import { colors } from '@/assets/theme/AppTheme';

export type SaveButtonProps = CustomButtonProps & {
  saved?: boolean;
};

const ICON_SIZE = 16;

const SaveButton = ({ saved, ...props }: SaveButtonProps) => {
  return (
    <CustomButton style={styles.mainContainer} {...props}>
      {saved ? <SaveIconActive width={ICON_SIZE} /> : <SaveIconInactive width={ICON_SIZE} />}
    </CustomButton>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default SaveButton;
