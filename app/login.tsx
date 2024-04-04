import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';
import CustomText from '@/components/atoms/CustomText';
import LoginForm from '@/components/molecules/LoginForm';
import LoginRegisterLink from '@/components/molecules/LoginRegisterLink';
import { Routes } from '@/enums/screens';

const LoginPage = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginScreen' });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.mainContainer} alwaysBounceVertical={false}>
        <View style={styles.welcomeContainer}>
          <CustomText style={styles.helloText}>{t('hello')}</CustomText>
          <CustomText style={styles.welcomeText}>{t('welcomeBack')}</CustomText>
        </View>
        <LoginForm />
        <LoginRegisterLink
          text={t('dontHaveAccount')}
          linkText={t('signUp')}
          linkPath={Routes.Register}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 30
  },
  welcomeContainer: {
    marginTop: 50,
    marginBottom: 54
  },
  helloText: {
    fontSize: 30,
    fontFamily: fonts.primary.semiBold
  },
  welcomeText: {
    fontSize: 20,
    color: colors.label
  }
});

export default LoginPage;
