import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import CustomButton from './CustomButton';
import CustomText from './CustomText';

import fonts from '@/assets/fonts/fonts';
import BackArrowIcon from '@/assets/icons/icon_back_arrow.svg';
import { colors } from '@/assets/theme/AppTheme';

type CustomHeaderProps = {
  title?: string;
  back?: boolean;
  rightItem?: JSX.Element;
};

const CustomHeader = ({ title, back, rightItem }: CustomHeaderProps) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={[styles.mainContainer, !back && { justifyContent: 'flex-end' }]}>
      {back && (
        <CustomButton pressOpacity={0.3} style={styles.backButton} onPress={handleGoBack}>
          <BackArrowIcon pointerEvents="none" />
        </CustomButton>
      )}
      {title && (
        <CustomText numberOfLines={1} style={styles.title}>
          {title}
        </CustomText>
      )}
      {rightItem && <View style={styles.rightItemContainer}>{rightItem}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 47,
    backgroundColor: colors.white
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.primary.semiBold,
    color: colors.label,
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    left: 0,
    zIndex: -1
  },
  rightItemContainer: {
    marginRight: 30
  },
  backButton: {
    width: 47,
    height: 47,
    justifyContent: 'flex-start',
    backgroundColor: colors.transparent,
    marginLeft: 30
  }
});

export default CustomHeader;
