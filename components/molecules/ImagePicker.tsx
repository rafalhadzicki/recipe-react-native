import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import CustomText from '../atoms/CustomText';
import SkeletonView from '../atoms/SkeletonView';

import { useSetUserProfilePicture } from '@/api/user';
import { queryClient } from '@/app/_layout';
import { colors } from '@/assets/theme/AppTheme';
import { QueryKeys } from '@/enums/queryKeys';
import { firebaseAuth } from '@/firebase';

type ImagePickerProps = {
  setImage?: (imageUri: string) => void;
  defaultUri?: string;
  style?: StyleProp<ViewStyle>;
  placeholder?: ReactNode;
  userPicture?: boolean;
  disabled?: boolean;
};

const CustomImagePicker = ({
  setImage,
  defaultUri,
  placeholder,
  style,
  userPicture,
  disabled
}: ImagePickerProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'addRecipeScreen' });
  const [imageUri, setImageUri] = useState<string>(defaultUri ?? '');
  const { setUserProfilePicture } = useSetUserProfilePicture();
  const [isLoading, setIsLoading] = useState(true);

  const handlePickImage = async () => {
    if (disabled) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setImage && setImage(result.assets[0].uri);
      userPicture &&
        setUserProfilePicture(
          { imageUri: result.assets[0].uri },
          {
            onSuccess: () => {
              queryClient.invalidateQueries([
                QueryKeys.UserProfilePicture,
                firebaseAuth.currentUser?.uid
              ]);
            }
          }
        );
    }
  };

  return (
    <Pressable style={[styles.image, styles.imageContainer, style]} onPress={handlePickImage}>
      {!placeholder && (
        <LinearGradient
          colors={colors.recipePreviewGradient}
          style={[styles.gradient, { zIndex: imageUri ? 1 : 0 }]}
        />
      )}
      {imageUri ? (
        <SkeletonView isLoading={isLoading} style={[styles.image, styles.skeleton]}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            onLoadEnd={() => setIsLoading(false)}
          />
        </SkeletonView>
      ) : (
        placeholder ?? (
          <>
            <Ionicons name="add-outline" color={colors.white} size={40} />
            <CustomText style={styles.text}>{t('pickImage')}</CustomText>
          </>
        )
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover'
  },
  imageContainer: {
    backgroundColor: colors.grey[4],
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  text: {
    color: colors.white
  },
  gradient: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  skeleton: {
    backgroundColor: colors.white
  }
});

export default CustomImagePicker;
