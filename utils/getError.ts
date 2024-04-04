import { FirebaseError } from 'firebase/app';

import { FIREBASE_ERRORS } from '@/constants/firebaseErrors';

export const getError = (error: FirebaseError) => {
  if (FIREBASE_ERRORS.hasOwnProperty(error.code)) {
    return FIREBASE_ERRORS[error.code];
  } else {
    return 'somethingWentWrong';
  }
};
