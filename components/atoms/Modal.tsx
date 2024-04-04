import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/assets/theme/AppTheme';

type ModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  children?: ReactNode;
};

const Modal = ({ children, isModalVisible, setIsModalVisible }: ModalProps) => {
  const topInset = useSafeAreaInsets().top;

  return (
    <>
      {isModalVisible && (
        <>
          <Pressable style={styles.backdrop} onPress={() => setIsModalVisible(false)} />
          <View style={[styles.mainContainer, { top: topInset + 27 }]}>{children}</View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.black,
    opacity: 0.5,
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%'
  },
  mainContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    width: 164,
    padding: 10,
    position: 'absolute',
    zIndex: 2,
    right: 30
  }
});

export default Modal;
