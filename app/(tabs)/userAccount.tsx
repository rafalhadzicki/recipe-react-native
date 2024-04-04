import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { useGetUserById } from '@/api/user';
import MoreIcon from '@/assets/icons/icon_more.svg';
import { colors } from '@/assets/theme/AppTheme';
import CustomButton from '@/components/atoms/CustomButton';
import CustomHeader from '@/components/atoms/CustomHeader';
import UserProfile from '@/components/templates/UserProfile';
import { firebaseAuth } from '@/firebase';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setModalOpen } from '@/store/slices/modalSlice';

const UserAccountPage = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'userProfileScreen' });
  const { userById, isLoadingUserById } = useGetUserById(firebaseAuth.currentUser?.uid!);
  const dispatch = useAppDispatch();
  return (
    <>
      <Tabs.Screen
        options={{
          header: () => (
            <CustomHeader
              title={t('screenName')}
              rightItem={
                <CustomButton
                  pressOpacity={0.3}
                  style={styles.moreButton}
                  onPress={() => dispatch(setModalOpen(true))}
                >
                  <MoreIcon />
                </CustomButton>
              }
            />
          ),
          headerShown: true
        }}
      />
      {!isLoadingUserById && <UserProfile isLoading={isLoadingUserById} user={userById} />}
    </>
  );
};

const styles = StyleSheet.create({
  moreButton: {
    width: 47,
    height: 47,
    justifyContent: 'flex-end',
    backgroundColor: colors.transparent
  }
});

export default UserAccountPage;
