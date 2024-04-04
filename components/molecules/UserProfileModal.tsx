import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import CustomButton from '../atoms/CustomButton';
import CustomText from '../atoms/CustomText';
import Modal from '../atoms/Modal';

import { colors } from '@/assets/theme/AppTheme';
import { Routes } from '@/enums/screens';
import { firebaseAuth } from '@/firebase';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { selectModalState, setModalOpen } from '@/store/slices/modalSlice';

const UserProfileModal = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'userProfileScreen' });
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector(selectModalState);
  const handleModal = (value: boolean) => {
    dispatch(setModalOpen(value));
  };
  const { replace } = useRouter();

  const handleLogout = () => {
    dispatch(setModalOpen(false));
    firebaseAuth.signOut();
    replace(Routes.Login);
  };
  return (
    <Modal isModalVisible={isModalOpen} setIsModalVisible={handleModal}>
      <CustomButton pressOpacity={0.3} style={styles.iconLabelButton} onPress={handleLogout}>
        <Ionicons size={20} name="log-out-outline" />
        <CustomText>{t('logout')}</CustomText>
      </CustomButton>
    </Modal>
  );
};

const styles = StyleSheet.create({
  iconLabelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 8,
    paddingVertical: 10,
    height: 'auto',
    borderRadius: 0,
    backgroundColor: colors.transparent,
    justifyContent: 'flex-start'
  }
});

export default UserProfileModal;
