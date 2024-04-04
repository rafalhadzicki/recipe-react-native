import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET
} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import Collections from './enums/dbCollections';
import { Recipe, RecipeCategory, UserRating } from './models/firebase/recipe';
import { FirebaseUserProfile } from './models/firebase/userData';
import createCollection from './utils/createCollection';

const firebaseAppConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID
};

const firebaseApp = initializeApp(firebaseAppConfig);

export const firebaseAuth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = initializeFirestore(firebaseApp, {
  experimentalForceLongPolling: true
});

export const recipesCollection = createCollection<Recipe>(Collections.Recipes);
export const recipeCategoriesCollection = createCollection<RecipeCategory>(
  Collections.RecipeCategories
);
export const usersCollection = createCollection<FirebaseUserProfile>(Collections.Users);
export const ratingsCollection = createCollection<UserRating>(Collections.RecipeRatings);

export const googleProvider = new GoogleAuthProvider();

export const storage = getStorage(firebaseApp);
export default firebaseApp;
