import { StyleSheet, View } from 'react-native';

import CustomText from './CustomText';

import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';

type PlaceholderMessageProps = {
  message: string;
};

const PlaceholderMessage = ({ message }: PlaceholderMessageProps) => {
  return (
    <View style={styles.mainContainer}>
      <CustomText style={styles.message}>{message}</CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    height: 200
  },
  message: {
    fontSize: 20,
    textAlign: 'center',
    color: colors.grey[3],
    fontFamily: fonts.primary.semiBold
  }
});

export default PlaceholderMessage;
