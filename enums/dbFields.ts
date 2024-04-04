export enum RegisterFormFields {
  Name = 'name',
  Email = 'email',
  Password = 'password',
  ConfirmPassword = 'confirmPassword'
}

export enum LoginFormFields {
  Email = 'email',
  Password = 'password'
}

export enum RecipeFormFields {
  Name = 'name',
  Servings = 'servings',
  PreparingTime = 'preparingTime',
  createdAt = 'createdAt',
  CategoryId = 'categoryId',
  Rating = 'rating',
  RatingCount = 'ratingCount'
}

export enum RatingFormFields {
  RecipeId = 'recipeId',
  Rating = 'rating',
  UserId = 'userId'
}

export enum SortingDirections {
  Ascending = 'asc',
  Descending = 'desc'
}

export enum UserProfileFields {
  DisplayName = 'displayName',
  RecipesCount = 'recipesCount',
  FollowersIds = 'followersIds',
  FollowingIds = 'followingIds',
  Id = 'id'
}

export enum SearchFormFields {
  Name = 'name'
}
