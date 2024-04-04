import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';
import CustomText from '@/components/atoms/CustomText';
import LoginRegisterLink from '@/components/molecules/LoginRegisterLink';
import RegisterForm from '@/components/molecules/RegisterForm';
import { Routes } from '@/enums/screens';

const RegisterPage = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'registerScreen' });

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView style={[styles.flex, styles.mainContainer]} alwaysBounceVertical={false}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={-80}
          behavior={Platform.OS === 'ios' ? 'position' : undefined}
        >
          <View style={styles.headerContainer}>
            <CustomText style={styles.createAccountText}>{t('createAccount')}</CustomText>
            <CustomText style={styles.descriptionText}>{t('description')}</CustomText>
          </View>
          <RegisterForm />
          <LoginRegisterLink
            text={t('alreadyAMember')}
            linkText={t('signIn')}
            linkPath={Routes.Login}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 30
  },
  flex: {
    flex: 1
  },
  headerContainer: {
    marginBottom: 20,
    marginTop: 10
  },
  createAccountText: {
    fontSize: 20,
    fontFamily: fonts.primary.semiBold,
    marginBottom: 5
  },
  descriptionText: {
    fontSize: 11,
    color: colors.label
  }
});

export default RegisterPage;
