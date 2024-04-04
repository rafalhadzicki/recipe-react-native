import { useMutation, useQuery } from '@tanstack/react-query';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import { QueryKeys } from '@/enums/queryKeys';
import { StorageRoutes } from '@/enums/storageRoutes';
import { db, firebaseAuth, storage, usersCollection } from '@/firebase';
import {
  FirebaseUserAuthData,
  FirebaseUserProfile,
  FirebaseUserRegisterData
} from '@/models/firebase/userData';

const CACHE_TIME_IN_MS = 1000 * 60 * 15;
const STALE_TIME_IN_MS = 1000 * 60 * 10;

export const useRegisterUser = () => {
  const {
    mutate: registerUser,
    isLoading: isUserRegistering,
    error: registerError
  } = useMutation<void, FirebaseError, FirebaseUserRegisterData>({
    mutationFn: async ({ email, password, displayName }) => {
      const loginResult = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await updateProfile(loginResult.user, { displayName });
      const userProfile: FirebaseUserProfile = {
        displayName,
        recipesCount: 0,
        followersIds: [],
        followingIds: [],
        savedRecipesIds: [],
        createdRecipesIds: []
      };
      await setDoc(doc(db, 'users', loginResult.user.uid), userProfile);
    }
  });
  return { registerUser, isUserRegistering, registerError };
};

export const useSignIn = () => {
  const {
    mutate: signIn,
    isLoading: isSigningIn,
    isError: isSignInError,
    error: signInError
  } = useMutation<void, FirebaseError, FirebaseUserAuthData>({
    mutationFn: async ({ email, password }) => {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    }
  });
  return { signIn, isSigningIn, isSignInError, signInError };
};

export const useLogOut = () => {
  const { mutate: logout, isLoading: isLoggingOut } = useMutation<void, FirebaseError, void>({
    mutationFn: async () => {
      await signOut(firebaseAuth);
    }
  });
  return { logout, isLoggingOut };
};

export const useGetUserById = (userId: string) => {
  const { data: userById, isLoading: isLoadingUserById } = useQuery<
    FirebaseUserProfile,
    FirebaseError
  >(
    [userId],
    async () => {
      const res = await getDoc(doc(usersCollection, userId));
      if (res.exists()) {
        const data: FirebaseUserProfile = {
          id: res.id,
          ...res.data()
        };
        return data;
      }
      throw new Error('User not found');
    },
    { cacheTime: CACHE_TIME_IN_MS, staleTime: STALE_TIME_IN_MS }
  );
  return { userById, isLoadingUserById };
};

export const useSetUserProfilePicture = () => {
  const { mutate: setUserProfilePicture, isLoading: isUserPictureUploading } = useMutation<
    void,
    FirebaseError,
    { imageUri: string }
  >({
    mutationFn: async ({ imageUri }) => {
      const photo = await fetch(imageUri);
      const blob = await photo.blob();
      const imageRef = ref(storage, `${StorageRoutes.Users}/${firebaseAuth.currentUser?.uid}`);
      await uploadBytesResumable(imageRef, blob);
    }
  });
  return { setUserProfilePicture, isUserPictureUploading };
};

export const useGetUserPicture = (userId: string) => {
  const { data: userPicture, isLoading: isLoadingUserPicture } = useQuery<string, FirebaseError>(
    [QueryKeys.UserProfilePicture, userId],
    async () => {
      const imageRef = ref(storage, `${StorageRoutes.Users}/${userId}`);
      try {
        const url = await getDownloadURL(imageRef);
        return url;
      } catch (e) {
        return '';
      }
    },
    { cacheTime: CACHE_TIME_IN_MS, staleTime: STALE_TIME_IN_MS }
  );
  return { userPicture, isLoadingUserPicture };
};
