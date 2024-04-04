import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import CustomButton from '../atoms/CustomButton';
import CustomText from '../atoms/CustomText';

import FilterIcon from '@/assets/icons/icon_filter.svg';
import SearchIcon from '@/assets/icons/icon_search.svg';
import { colors } from '@/assets/theme/AppTheme';
import { Routes } from '@/enums/screens';

const SearchFilterButtons = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'homeScreen' });
  return (
    <View style={styles.mainContainer}>
      <Link href={{ pathname: Routes.Search, params: { search: 'search' } }} asChild>
        <Pressable style={styles.SearchContainer}>
          <SearchIcon />
          <CustomText style={styles.text}>{t('search')}</CustomText>
        </Pressable>
      </Link>
      <Link href={{ pathname: Routes.Search, params: { filter: 'filter' } }} asChild>
        <CustomButton style={styles.filterButton}>
          <FilterIcon />
        </CustomButton>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 20
  },
  SearchContainer: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1.3,
    borderColor: colors.grey[4],
    alignItems: 'center',
    gap: 10,
    flexDirection: 'row'
  },
  text: {
    fontSize: 11,
    color: colors.grey[4]
  },
  filterButton: {
    width: 40,
    height: 40
  }
});

export default SearchFilterButtons;
