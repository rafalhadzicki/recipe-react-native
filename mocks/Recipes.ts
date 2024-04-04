import { Ingredient, Recipe } from '@/models/firebase/recipe';

const mockedIngredient: Ingredient = {
  name: 'Spaghetti',
  amount: '100g'
};

export const mockedRecipeImage =
  'https://food-guide.canada.ca/sites/default/files/styles/square_400_x_400/public/2020-12/CFGPlate-crop400x400.jpg';

export const recipesMock: Recipe[] = [
  {
    categoryId: '1',
    id: '0',
    name: 'Spaghetti Bolonese',
    preparingTime: 45,
    authorId: '0',
    rating: 4.5,
    ingredients: [mockedIngredient],
    preparingSteps: ['step1'],
    ratingCount: 1
  },
  {
    categoryId: '1',
    id: '1',
    name: 'Spaghetti Carbonara',
    preparingTime: 30,
    authorId: '0',
    rating: 5,
    ingredients: [mockedIngredient],
    preparingSteps: ['step1'],
    ratingCount: 1
  },
  {
    categoryId: '2',
    id: '3',
    name: 'Greek Salad',
    preparingTime: 15,
    authorId: '0',
    rating: 1.5,
    ingredients: [mockedIngredient],
    preparingSteps: ['step1'],
    ratingCount: 1
  },
  {
    categoryId: '2',
    id: '4',
    name: 'Crunchy Nut Coleslaw',
    preparingTime: 20,
    authorId: '0',
    rating: 2,
    ingredients: [mockedIngredient],
    preparingSteps: ['step1'],
    ratingCount: 1
  },
  {
    categoryId: '3',
    id: '5',
    name: 'Panna Cotta',
    preparingTime: 120,
    authorId: '0',
    rating: 4,
    ingredients: [mockedIngredient],
    preparingSteps: ['step1'],
    ratingCount: 1
  },
  {
    categoryId: '3',
    id: '6',
    name: 'Cheesecake',
    preparingTime: 180,
    authorId: '0',
    rating: 3.5,
    ingredients: [mockedIngredient],
    preparingSteps: ['step1'],
    ratingCount: 1
  }
];
