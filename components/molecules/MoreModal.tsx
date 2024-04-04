import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet } from 'react-native';

import CenteredSpinner from '../atoms/CenteredSpinner';
import CustomButton from '../atoms/CustomButton';
import CustomText from '../atoms/CustomText';
import Modal from '../atoms/Modal';
import RatingModal from './RatingModal';

import {
  useCheckSavedRecipe,
  useDeleteRecipe,
  useGetUserRecipeRating,
  useSaveRecipe,
  useUnsaveRecipe
} from '@/api/recipe';
import DocumentIcon from '@/assets/icons/icon_document.svg';
import SaveIcon from '@/assets/icons/icon_save_filled.svg';
import StarIcon from '@/assets/icons/icon_star.svg';
import { colors } from '@/assets/theme/AppTheme';
import { Routes } from '@/enums/screens';
import { firebaseAuth } from '@/firebase';
import { Recipe } from '@/models/firebase/recipe';

type MoreModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  recipe: Recipe;
};

const BUTTONS_PRESS_OPACITY = 0.3;

const MoreModal = ({ isModalVisible, recipe, setIsModalVisible }: MoreModalProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'recipeDetailsScreen' });
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const { id, rating, ratingCount, authorId } = recipe;
  const { push, back } = useRouter();

  const { userRecipeRating } = useGetUserRecipeRating(id!);
  const { isRecipeSaved } = useCheckSavedRecipe(id!);
  const { saveRecipe } = useSaveRecipe();
  const { unsaveRecipe } = useUnsaveRecipe();
  const { deleteRecipe, isRecipeDeleting } = useDeleteRecipe();

  const handleSave = () => {
    if (!isRecipeSaved) {
      saveRecipe(id!);
      setIsModalVisible(false);
      return;
    }
    unsaveRecipe(id!);
    setIsModalVisible(false);
  };

  const handleOpenRatingModal = () => {
    setIsModalVisible(false);
    setIsRatingModalVisible(true);
  };

  const handleEditPress = () => {
    setIsModalVisible(false);
    push({ pathname: Routes.EditRecipe, params: { recipeId: id } });
  };

  const handleDeletePress = () => {
    setIsModalVisible(false);
    Alert.alert(t('deleteMessage'), undefined, [
      {
        text: t('cancel'),
        style: 'cancel'
      },
      {
        text: t('delete'),
        onPress: () => deleteRecipe(id!, { onSuccess: () => back() })
      }
    ]);
  };

  return (
    <>
      <CenteredSpinner animating={isRecipeDeleting} />
      <Modal setIsModalVisible={setIsModalVisible} isModalVisible={isModalVisible}>
        {
          //TODO: Add share functionality
          /* <CustomButton pressOpacity={BUTTONS_PRESS_OPACITY} style={styles.iconLabelButton}>
          <ShareIcon />
          <CustomText>{t('share')}</CustomText>
  </CustomButton>*/
        }
        <CustomButton
          pressOpacity={BUTTONS_PRESS_OPACITY}
          style={styles.iconLabelButton}
          onPress={handleOpenRatingModal}
        >
          <StarIcon width={20} height={20} color={colors.black} />
          <CustomText>{t('rateRecipe')}</CustomText>
        </CustomButton>
        <CustomButton
          pressOpacity={BUTTONS_PRESS_OPACITY}
          style={styles.iconLabelButton}
          onPress={handleSave}
        >
          <SaveIcon />
          <CustomText>{isRecipeSaved ? t('unsave') : t('save')}</CustomText>
        </CustomButton>
        {authorId === firebaseAuth.currentUser?.uid && (
          <>
            <CustomButton
              pressOpacity={BUTTONS_PRESS_OPACITY}
              style={styles.iconLabelButton}
              onPress={handleEditPress}
            >
              <DocumentIcon color={colors.black} width={20} height={20} />
              <CustomText>{t('edit')}</CustomText>
            </CustomButton>
            <CustomButton
              pressOpacity={BUTTONS_PRESS_OPACITY}
              style={styles.iconLabelButton}
              onPress={handleDeletePress}
            >
              <Ionicons name="trash-bin" color={colors.black} size={20} />
              <CustomText>{t('delete')}</CustomText>
            </CustomButton>
          </>
        )}
      </Modal>

      {isRatingModalVisible && (
        <RatingModal
          recipeId={id!}
          rating={rating!}
          userRating={userRecipeRating}
          ratingCount={ratingCount!}
          setIsRatingModalVisible={setIsRatingModalVisible}
        />
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
  },
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

export default MoreModal;
