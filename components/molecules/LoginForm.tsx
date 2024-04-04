import { useRouter } from 'expo-router';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import CustomButton from '../atoms/CustomButton';
import CustomInput from '../atoms/CustomInput';
import CustomText from '../atoms/CustomText';

import { useSignIn } from '@/api/user';
import ArrowIcon from '@/assets/icons/icon_arrow_right.svg';
import { colors } from '@/assets/theme/AppTheme';
import { LoginFormFields } from '@/enums/dbFields';
import { Routes } from '@/enums/screens';
import { FirebaseUserAuthData } from '@/models/firebase/userData';
import { getError } from '@/utils/getError';
import { REGEXES } from '@/utils/regexes';

const LoginForm = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginScreen' });
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const { signIn, isSigningIn, isSignInError, signInError } = useSignIn();

  const onSubmit = (data: FieldValues) => {
    const loginData: FirebaseUserAuthData = {
      email: data.email,
      password: data.password
    };
    signIn(loginData, {
      onSuccess: () => handleLoginSuccess()
    });
  };

  const handleLoginSuccess = () => {
    router.replace(Routes.Home);
  };

  return (
    <>
      <CustomInput
        name={LoginFormFields.Email}
        caption={t('email')}
        placeholder={t('enterEmail')}
        style={styles.loginInput}
        control={control}
        maxLength={30}
        autoCorrect={false}
        error={isSignInError}
        rules={{
          required: t('emptyField'),
          pattern: {
            value: REGEXES.EMAIL,
            message: t('invalidEmail')
          }
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        errorMessage={errors.email?.message?.toString()}
      />
      <CustomInput
        name={LoginFormFields.Password}
        caption={t('password')}
        placeholder={t('enterPassword')}
        control={control}
        maxLength={30}
        autoCorrect={false}
        secureTextEntry
        keyboardType="default"
        style={styles.passwordInput}
        rules={{ required: t('emptyField') }}
        error={isSignInError}
        errorMessage={
          errors.password?.message?.toString() || (signInError && t(getError(signInError)))
        }
      />
      <CustomText style={styles.forgotPasswordText}>{t('forgotPassword')}</CustomText>
      <CustomButton
        disabled={Object.keys(errors).length !== 0 || isSigningIn}
        label={t('signIn')}
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
        loading={isSigningIn}
      >
        <ArrowIcon style={styles.arrowIcon} />
      </CustomButton>
    </>
  );
};

const styles = StyleSheet.create({
  forgotPasswordText: {
    fontSize: 11,
    color: colors.yellow[100],
    marginTop: 20,
    marginBottom: 25,
    paddingLeft: 10
  },
  arrowIcon: {
    marginLeft: 9
  },
  button: {
    marginBottom: 20
  },
  errorMessage: {
    color: colors.warningDark,
    fontSize: 12,
    marginLeft: 5,
    marginBottom: 10,
    height: 15
  },
  loginInput: {
    marginBottom: 30
  },
  passwordInput: {
    marginBottom: 20
  }
});

export default LoginForm;
