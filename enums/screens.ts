export enum Screens {
  Index = 'index',
  Login = 'login',
  Register = 'register',
  Home = 'home',
  AddRecipe = 'addRecipe',
  TabGroup = '(tabs)',
  UserAccount = 'userAccount',
  SavedRecipes = 'savedRecipes',
  GenerateRecipe = 'generateRecipe',
  Search = 'search',
  GeneratedRecipePreview = 'generatedRecipePreview',
  RecipeDetails = 'recipeDetails',
  RecipeId = '[recipeId]',
  EditRecipe = 'edit',
  RecipeAuthor = 'recipeAuthor'
}

export enum Routes {
  Login = '/login',
  Register = '/register',
  Home = '/home',
  Search = '/search',
  AddRecipe = '/addRecipe',
  TabGroup = '/(tabs)',
  UserAccount = '/userAccount',
  SavedRecipes = '/savedRecipes',
  Notifications = '/notifications',
  GeneratedRecipePreview = 'generateRecipe/generatedRecipePreview',
  RecipeDetails = '/recipeDetails',
  EditRecipe = '/recipeDetails/edit',
  RecipeAuthor = 'recipeDetails/recipeAuthor'
}
