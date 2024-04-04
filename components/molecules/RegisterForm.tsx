import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import CustomButton from '../atoms/CustomButton';
import CustomCheckBox from '../atoms/CustomCheckBox';
import CustomInput from '../atoms/CustomInput';
import CustomText from '../atoms/CustomText';

import { useRegisterUser } from '@/api/user';
import ArrowIcon from '@/assets/icons/icon_arrow_right.svg';
import { colors } from '@/assets/theme/AppTheme';
import { RegisterFormFields } from '@/enums/dbFields';
import { Routes } from '@/enums/screens';
import { FirebaseUserRegisterData } from '@/models/firebase/userData';
import { getError } from '@/utils/getError';
import { REGEXES } from '@/utils/regexes';

const RegisterForm = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'registerScreen' });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();
  const { registerUser, isUserRegistering, registerError } = useRegisterUser();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data: FieldValues) => {
    const userData: FirebaseUserRegisterData = {
      email: data.email,
      password: data.password,
      displayName: data.name
    };
    registerUser(userData, {
      onSuccess: () => handleRegisterSuccess()
    });
  };

  const handleTermsAccepted = () => {
    setTermsAccepted(termsAccepted => !termsAccepted);
  };

  const handleRegisterSuccess = () => {
    router.back();
    router.replace(Routes.Home);
  };

  return (
    <>
      <CustomInput
        name={RegisterFormFields.Name}
        caption={t('name')}
        placeholder={t('enterName')}
        style={styles.input}
        control={control}
        maxLength={20}
        autoCorrect={false}
        error={!!errors.name}
        rules={{ required: t('emptyField'), minLength: 2 }}
        errorMessage={errors.name?.message?.toString()}
      />
      <CustomInput
        name={RegisterFormFields.Email}
        caption={t('email')}
        placeholder={t('enterEmail')}
        style={styles.input}
        control={control}
        maxLength={30}
        autoCorrect={false}
        keyboardType="email-address"
        error={!!errors.email}
        rules={{
          required: t('emptyField'),
          pattern: { value: REGEXES.EMAIL, message: t('invalidEmail') }
        }}
        errorMessage={errors.email?.message?.toString()}
        autoCapitalize="none"
      />

      <CustomInput
        name={RegisterFormFields.Password}
        caption={t('password')}
        placeholder={t('enterPassword')}
        style={styles.input}
        control={control}
        maxLength={30}
        autoCorrect={false}
        secureTextEntry
        error={!!errors.password}
        rules={{
          required: t('emptyField'),
          minLength: {
            value: 6,
            message: t('passwordLength')
          }
        }}
        errorMessage={errors.password?.message?.toString()}
      />
      <CustomInput
        name={RegisterFormFields.ConfirmPassword}
        caption={t('confirmPassword')}
        placeholder={t('retypePassword')}
        style={styles.input}
        control={control}
        maxLength={30}
        autoCorrect={false}
        secureTextEntry
        error={!!errors.confirmPassword}
        rules={{
          required: t('emptyField'),
          validate: (value, formValues) => value === formValues.password || t('passwordsNotMatch')
        }}
        errorMessage={errors.confirmPassword?.message?.toString()}
      />

      <View style={styles.checkBoxContainer}>
        <CustomCheckBox checked={termsAccepted} onChange={handleTermsAccepted} />
        <CustomText style={styles.termsText}>{t('terms')}</CustomText>
      </View>

      <CustomButton
        disabled={Object.keys(errors).length !== 0 || !termsAccepted || isUserRegistering}
        label={t('signUp')}
        onPress={handleSubmit(onSubmit)}
        loading={isUserRegistering}
      >
        <ArrowIcon style={styles.ArrowIcon} />
      </CustomButton>
      <CustomText style={styles.errorMessage}>
        {registerError && t(getError(registerError))}
      </CustomText>
    </>
  );
};

const styles = StyleSheet.create({
  termsText: {
    fontSize: 11,
    color: colors.yellow[100]
  },
  checkBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
    paddingLeft: 10,
    marginBottom: 25
  },
  input: {
    marginBottom: 20
  },
  ArrowIcon: {
    marginLeft: 9
  },
  errorMessage: {
    color: colors.warningDark,
    fontSize: 12,
    marginLeft: 5,
    marginVertical: 10,
    height: 15
  }
});

export default RegisterForm;
