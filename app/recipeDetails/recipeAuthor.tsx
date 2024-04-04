import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGetUserById } from '@/api/user';
import CustomHeader from '@/components/atoms/CustomHeader';
import UserProfile from '@/components/templates/UserProfile';

const UserProfileScreen = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'userProfileScreen' });
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { userById, isLoadingUserById } = useGetUserById(userId!);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader title={t('screenName')} />
        {!isLoadingUserById && <UserProfile isLoading={isLoadingUserById} user={userById} />}
      </SafeAreaView>
    </>
  );
};

export default UserProfileScreen;
