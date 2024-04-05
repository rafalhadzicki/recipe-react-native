import { useMutation, useQuery } from '@tanstack/react-query';
import { FirebaseError } from 'firebase/app';
import {
  DocumentSnapshot,
  QueryConstraint,
  addDoc,
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  endAt,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  updateDoc,
  where
} from 'firebase/firestore';
import { deleteObject, ref, uploadBytesResumable } from 'firebase/storage';

import { queryClient } from '@/app/_layout';
import { allCategories } from '@/constants/allCategories';
import { RatingFormFields, RecipeFormFields, SortingDirections } from '@/enums/dbFields';
import { QueryKeys } from '@/enums/queryKeys';
import { StorageRoutes } from '@/enums/storageRoutes';
import {
  firebaseAuth,
  ratingsCollection,
  recipeCategoriesCollection,
  recipesCollection,
  storage,
  usersCollection
} from '@/firebase';
import { Recipe, RecipeCategory, RecipeSortingParams, UserRating } from '@/models/firebase/recipe';
import getImages from '@/utils/getImages';

const CACHE_TIME_IN_MS = 1000 * 60 * 15;
const STALE_TIME_IN_MS = 1000 * 60 * 10;

type AddRecipeMutationProps = {
  recipe: Recipe;
  imageUri: string;
};

type AddRatingMutationProps = {
  recipeId: string;
  userRating: number;
  ratingCount: number;
  recipeRating: number;
};

export const useGetCategory = () => {
  return useQuery<RecipeCategory[], FirebaseError>(
    [QueryKeys.Categories],
    async () => {
      const res = await getDocs(recipeCategoriesCollection);
      const data: RecipeCategory[] = res.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return data;
    },
    { cacheTime: CACHE_TIME_IN_MS, staleTime: STALE_TIME_IN_MS }
  );
};

export const useAddRecipe = () => {
  const { mutate: addRecipe, isLoading: isRecipeBeingAdded } = useMutation<
    void,
    FirebaseError,
    AddRecipeMutationProps
  >({
    mutationFn: async ({ recipe, imageUri }) => {
      const recipeDoc = await addDoc(recipesCollection, recipe);
      const recipeId = recipeDoc.id;
      const photo = await fetch(imageUri);
      const blob = await photo.blob();
      const imageRef = ref(storage, `${StorageRoutes.Images}/${recipeId}`);
      await uploadBytesResumable(imageRef, blob);
      const userRef = doc(usersCollection, firebaseAuth.currentUser?.uid);
      await updateDoc(userRef, {
        recipesCount: increment(1),
        createdRecipesIds: arrayUnion(recipeId)
      });

      queryClient.invalidateQueries([QueryKeys.RecipesByTime]);
      queryClient.invalidateQueries([QueryKeys.RecipesByRating]);
      queryClient.invalidateQueries([QueryKeys.Recipes]);
    }
  });
  return { addRecipe, isRecipeBeingAdded };
};

export const useGetRecipesByCategory = (
  orderByElement: RecipeFormFields,
  sortDirection: SortingDirections,
  categoryId: string,
  queryKey: QueryKeys,
  lastVisibleDocId?: string
) => {
  const {
    data: recipesByCategory,
    isLoading: areRecipesLoading,
    refetch: refetchRecipes
  } = useQuery<Recipe[], FirebaseError>(
    [queryKey, categoryId],
    async () => {
      const queryConstraints = [
        orderBy(orderByElement, sortDirection),
        limit(10)
      ] as QueryConstraint[];
      if (categoryId !== allCategories.id) {
        queryConstraints.push(where(RecipeFormFields.CategoryId, '==', categoryId));
      }
      if (lastVisibleDocId) {
        const lastDoc = await getDoc(doc(recipesCollection, lastVisibleDocId));
        queryConstraints.push(startAfter(lastDoc));
      }
      const recipesQuery = query(recipesCollection, ...queryConstraints);
      const res = await getDocs(recipesQuery);
      const data: Recipe[] = res.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      await getImages(data);
      return data;
    },
    { cacheTime: CACHE_TIME_IN_MS, staleTime: STALE_TIME_IN_MS }
  );
  return { recipesByCategory, areRecipesLoading, refetchRecipes };
};

export const useGetRecipesById = (recipesId: string[]) => {
  const {
    data: recipesById,
    isLoading: areRecipesByIdLoading,
    isFetching: areRecipesByIdFetching,
    refetch: refetchRecipesById
  } = useQuery<Recipe[], FirebaseError>([QueryKeys.Recipes, recipesId], async () => {
    if (recipesId.length === 0) {
      return [];
    }
    const docSnaps: DocumentSnapshot<Recipe>[] = [];

    await Promise.all(
      recipesId.map(async recipeId => {
        const docRef = doc(recipesCollection, recipeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          docSnaps.push(docSnap);
        }
      })
    );

    const recipes = docSnaps.map(docSnap => {
      const recipe = docSnap.data() as Recipe;
      recipe.id = docSnap.id;
      return recipe;
    });

    await getImages(recipes);
    return recipes;
  });
  return { recipesById, areRecipesByIdLoading, areRecipesByIdFetching, refetchRecipesById };
};

export const useGetFilteredRecipes = () => {
  const {
    data: recipes,
    mutate: getFilteredRecipes,
    isLoading: areFilteredRecipesLoading
  } = useMutation<Recipe[], FirebaseError, RecipeSortingParams>({
    mutationFn: async ({ categoryId, rating, sortBy, direction, name, lastVisibleDocId }) => {
      let queryConstraints = [] as QueryConstraint[];
      if (categoryId) {
        queryConstraints.unshift(where(RecipeFormFields.CategoryId, '==', categoryId));
      }
      if (rating) {
        queryConstraints.unshift(where(RecipeFormFields.Rating, '==', rating));
      }
      if (name) {
        queryConstraints = [startAt(name), endAt(name + '\uf8ff')];
      }
      if (lastVisibleDocId) {
        const lastDoc = await getDoc(doc(recipesCollection, lastVisibleDocId));
        queryConstraints.push(startAfter(lastDoc));
      }
      const recipesQuery = query(
        recipesCollection,
        orderBy(sortBy, direction),
        ...queryConstraints,
        limit(10)
      );
      const res = await getDocs(recipesQuery);
      const data: Recipe[] = res.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      await getImages(data);
      return data;
    },
    cacheTime: CACHE_TIME_IN_MS
  });
  return { getFilteredRecipes, areFilteredRecipesLoading };
};

export const useRateRecipeById = () => {
  const { mutate: rateRecipe, isLoading: isRecipeBeingRated } = useMutation<
    void,
    FirebaseError,
    AddRatingMutationProps
  >({
    mutationFn: async ({ recipeId, recipeRating, userRating, ratingCount }) => {
      const ratingQuery = query(
        ratingsCollection,
        where(RatingFormFields.UserId, '==', firebaseAuth.currentUser?.uid),
        where(RatingFormFields.RecipeId, '==', recipeId)
      );
      const res = await getDocs(ratingQuery);

      if (res.docs.length > 0) {
        const ratingData: UserRating = {
          id: res.docs[0].id,
          ...res.docs[0].data()
        };
        const ratingRef = doc(ratingsCollection, ratingData.id);
        await updateDoc(ratingRef, {
          rating: userRating
        });
        const newRating =
          (recipeRating * ratingCount - ratingData.rating + userRating) / ratingCount;
        await updateDoc(doc(recipesCollection, recipeId), {
          rating: newRating
        });
        queryClient.invalidateQueries([QueryKeys.RecipeRating]);
        queryClient.invalidateQueries([QueryKeys.RecipesByTime]);
        queryClient.invalidateQueries([QueryKeys.RecipesByRating]);

        return;
      }
      const docRef = doc(recipesCollection, recipeId);
      const newRating = (recipeRating * ratingCount + userRating) / (ratingCount + 1);
      await updateDoc(docRef, {
        rating: newRating,
        ratingCount: ratingCount + 1
      });
      await addDoc(ratingsCollection, {
        recipeId,
        userId: firebaseAuth.currentUser?.uid!,
        rating: userRating
      });

      queryClient.invalidateQueries([QueryKeys.RecipeRating, recipeId, QueryKeys.RecipesByTime]);
    }
  });
  return { rateRecipe, isRecipeBeingRated };
};

export const useGetUserRecipeRating = (recipeId: string) => {
  const { data: userRecipeRating, isLoading: isRatingLoading } = useQuery<number, FirebaseError>(
    [QueryKeys.RecipeRating, recipeId],
    async () => {
      const ratingQuery = query(
        ratingsCollection,
        where(RatingFormFields.UserId, '==', firebaseAuth.currentUser?.uid),
        where(RatingFormFields.RecipeId, '==', recipeId)
      );
      const res = await getDocs(ratingQuery);
      if (res.docs.length === 0) {
        return 0;
      }
      return res.docs[0].data().rating;
    },
    { cacheTime: CACHE_TIME_IN_MS, staleTime: STALE_TIME_IN_MS }
  );
  return { userRecipeRating, isRatingLoading };
};

export const useSaveRecipe = () => {
  const { mutate: saveRecipe, isLoading: isRecipeSaving } = useMutation<
    void,
    FirebaseError,
    string
  >({
    mutationFn: async recipeId => {
      const userRef = doc(usersCollection, firebaseAuth.currentUser?.uid);
      await updateDoc(userRef, {
        savedRecipesIds: arrayUnion(recipeId)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.SavedRecipesIds]);
      queryClient.invalidateQueries([QueryKeys.SavedRecipes]);
    }
  });
  return { saveRecipe, isRecipeSaving };
};

export const useUnsaveRecipe = () => {
  const { mutate: unsaveRecipe, isLoading: isRecipeUnsaving } = useMutation<
    void,
    FirebaseError,
    string
  >({
    mutationFn: async recipeId => {
      const userRef = doc(usersCollection, firebaseAuth.currentUser?.uid);
      await updateDoc(userRef, {
        savedRecipesIds: arrayRemove(recipeId)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.SavedRecipesIds]);
      queryClient.invalidateQueries([QueryKeys.SavedRecipes]);
    }
  });
  return { unsaveRecipe, isRecipeUnsaving };
};

export const useGetSavedRecipesIds = () => {
  const { data: savedRecipesIds, isLoading: areSavedRecipesIdsLoading } = useQuery<
    string[],
    FirebaseError
  >([QueryKeys.SavedRecipesIds], async () => {
    const userRef = doc(usersCollection, firebaseAuth.currentUser?.uid);
    const res = await getDoc(userRef);
    if (res.exists()) {
      return res.data().savedRecipesIds;
    } else {
      return [];
    }
  });
  return { savedRecipesIds, areSavedRecipesIdsLoading };
};

export const useCheckSavedRecipe = (recipeId: string) => {
  const { data: isRecipeSaved } = useQuery<boolean, FirebaseError>(
    [QueryKeys.SavedRecipesIds, recipeId],
    async () => {
      const userRef = doc(usersCollection, firebaseAuth.currentUser?.uid);
      const res = await getDoc(userRef);
      if (res.exists()) {
        const savedRecipesIds = res.data().savedRecipesIds;
        return savedRecipesIds.includes(recipeId);
      }
      throw new Error('User not found');
    }
  );
  return { isRecipeSaved };
};

export const useGetSavedRecipes = () => {
  const { data: savedRecipes, isLoading: areSavedRecipesLoading } = useQuery<
    Recipe[],
    FirebaseError
  >([QueryKeys.SavedRecipes], async () => {
    const userRef = doc(usersCollection, firebaseAuth.currentUser?.uid);
    const res = await getDoc(userRef);
    if (res.exists()) {
      const savedRecipesIds = res.data().savedRecipesIds;
      const savedRecipes: Recipe[] = [];
      await Promise.all(
        savedRecipesIds.map(async (recipeId: string) => {
          const docRef = doc(recipesCollection, recipeId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const recipe = docSnap.data() as Recipe;
            recipe.id = docSnap.id;
            savedRecipes.push(recipe);
          } else {
            await updateDoc(userRef, {
              savedRecipesIds: arrayRemove(recipeId)
            });
          }
        })
      );

      await getImages(savedRecipes);
      return savedRecipes;
    }
    return [];
  });
  return { savedRecipes, areSavedRecipesLoading };
};

export const useUpdateRecipe = () => {
  const { mutate: updateRecipe, isLoading: isRecipeUpdating } = useMutation<
    void,
    FirebaseError,
    { recipeId: string; recipe: Recipe; newUri?: string }
  >({
    mutationFn: async ({ recipeId, recipe, newUri }) => {
      const recipeRef = doc(recipesCollection, recipeId);
      await updateDoc(recipeRef, recipe);
      if (newUri) {
        const photo = await fetch(newUri);
        const blob = await photo.blob();
        const imageRef = ref(storage, `${StorageRoutes.Images}/${recipeId}`);
        await uploadBytesResumable(imageRef, blob);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.RecipesByTime]);
      queryClient.invalidateQueries([QueryKeys.RecipesByRating]);
    }
  });
  return { updateRecipe, isRecipeUpdating };
};

export const useDeleteRecipe = () => {
  const { mutate: deleteRecipe, isLoading: isRecipeDeleting } = useMutation<
    void,
    FirebaseError,
    string
  >({
    mutationFn: async recipeId => {
      const imageRef = ref(storage, `${StorageRoutes.Images}/${recipeId}`);
      await deleteObject(imageRef);
      const recipeRef = doc(recipesCollection, recipeId);
      await deleteDoc(recipeRef);
      const userRef = doc(usersCollection, firebaseAuth.currentUser?.uid);
      await updateDoc(userRef, {
        recipesCount: increment(-1),
        createdRecipesIds: arrayRemove(recipeId)
      });

      queryClient.invalidateQueries([QueryKeys.RecipesByTime]);
      queryClient.invalidateQueries([QueryKeys.RecipesByRating]);
      queryClient.invalidateQueries([QueryKeys.Recipes]);
      queryClient.invalidateQueries([QueryKeys.SavedRecipes]);
    }
  });
  return { deleteRecipe, isRecipeDeleting };
};
