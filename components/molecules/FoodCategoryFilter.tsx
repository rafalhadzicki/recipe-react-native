import { useRef } from 'react';
import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import Chip from '../atoms/Chip';

import { allCategories } from '@/constants/allCategories';
import { RecipeCategory } from '@/models/firebase/recipe';

type RecipeCategoryFilterProps = {
  categories: RecipeCategory[];
  SetCategoryId: (id: string) => void;
  mainContainerStyle?: StyleProp<ViewStyle>;
  addRecipePage?: boolean;
  selectedCategoryId: string;
};

const RecipeCategoryFilter = ({
  categories,
  mainContainerStyle,
  addRecipePage,
  selectedCategoryId,
  SetCategoryId
}: RecipeCategoryFilterProps) => {
  const FlatListRef = useRef<FlatList>(null);

  const handleCategoryPress = (id: string, index: number) => {
    SetCategoryId(id);
    FlatListRef.current?.scrollToIndex({ index, animated: true });
  };
  return (
    <View style={[styles.mainContainer, mainContainerStyle]}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={addRecipePage ? categories : [allCategories, ...categories]}
        renderItem={({ item, index }) => (
          <Chip
            label={item.name}
            selected={selectedCategoryId === item.id}
            onPress={() => handleCategoryPress(item.id, index)}
          />
        )}
        keyExtractor={item => item.id}
        horizontal
        ref={FlatListRef}
        contentContainerStyle={styles.flatListContainer}
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingLeft: 30,
    height: 31
  },
  flatListContainer: { paddingRight: 30 }
});

export default RecipeCategoryFilter;
