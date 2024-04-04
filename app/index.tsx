import ArrowIcon from 'assets/icons/icon_arrow_right.svg';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import fonts from '@/assets/fonts/fonts';
import AppLogo from '@/assets/icons/icon_logo.svg';
import Background from '@/assets/images/background.svg';
import CustomButton from '@/components/atoms/CustomButton';
import CustomText from '@/components/atoms/CustomText';
import { Routes } from '@/enums/screens';
import { firebaseAuth } from '@/firebase';

SplashScreen.preventAutoHideAsync();

const DEFAULT_FADE_IN_DURATION = 1000;

const LoginPage = () => {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('@/assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins-SemiBold.ttf')
  });

  const { t } = useTranslation('translation', { keyPrefix: 'splashScreen' });
  const router = useRouter();

  const handleRedirect = () => {
    if (firebaseAuth.currentUser) {
      router.replace(Routes.Home);
    } else {
      router.replace(Routes.Login);
    }
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <Background
        preserveAspectRatio="xMidYMid slice"
        width={'100%'}
        height={'100%'}
        style={styles.background}
      />
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Background
        preserveAspectRatio="xMidYMid slice"
        width={'100%'}
        height={'100%'}
        style={styles.background}
      />
      {fontsLoaded && (
        <Animated.View
          entering={FadeIn.duration(DEFAULT_FADE_IN_DURATION)}
          style={styles.mainContainer}
        >
          <View style={styles.logoContainer}>
            <AppLogo />
            <CustomText white style={styles.appNameText}>
              {t('appName')}
            </CustomText>
          </View>
          <View style={styles.contentContainer}>
            <CustomText white style={styles.getCookingText}>
              {t('getCooking')}
            </CustomText>
            <CustomText white style={styles.appDescriptionText}>
              {t('appDescription')}
            </CustomText>

            <CustomButton onPress={handleRedirect} label={t('startCooking')}>
              <ArrowIcon style={styles.arrow} />
            </CustomButton>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 95,
    paddingHorizontal: 50
  },
  logoContainer: {
    marginTop: 126,
    alignItems: 'center',
    gap: 14
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center'
  },
  appNameText: {
    fontFamily: fonts.primary.semiBold,
    fontSize: 18
  },
  getCookingText: {
    fontFamily: fonts.primary.semiBold,
    fontSize: 50,
    textAlign: 'center',
    marginBottom: 20
  },
  appDescriptionText: {
    fontSize: 16,
    marginBottom: 64
  },
  button: {
    marginHorizontal: 16
  },
  background: {
    flex: 1,
    position: 'absolute',
    zIndex: -1
  },
  arrow: {
    marginLeft: 9
  }
});

export default LoginPage;
