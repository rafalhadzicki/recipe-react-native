export type FirebaseUserRegisterData = FirebaseUserAuthData & {
  displayName: string;
};

export type FirebaseUserAuthData = {
  email: string;
  password: string;
};

export type FirebaseUserProfile = {
  id?: string;
  displayName: string;
  recipesCount: number;
  followersIds: string[];
  followingIds: string[];
  savedRecipesIds: string[];
  createdRecipesIds: string[];
  image?: string;
};
