import { getDownloadURL, ref } from 'firebase/storage';

import { storage } from '@/firebase';
import { Recipe } from '@/models/firebase/recipe';

const getImages = async (data: Recipe[]) => {
  const imageUrls: string[] = await Promise.all(
    data.map(async recipe => {
      const imageRef = ref(storage, `images/${recipe.id}`);
      const url = await getDownloadURL(imageRef);
      return url;
    })
  );
  data.forEach((recipe, index) => {
    recipe.imageUri = imageUrls[index];
  });
};
export default getImages;
