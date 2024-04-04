import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Control, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  NativeSyntheticEvent,
  StyleSheet,
  TextInputChangeEventData,
  View
} from 'react-native';

import CustomButton from '../atoms/CustomButton';
import CustomInput from '../atoms/CustomInput';

import FilterIcon from '@/assets/icons/icon_filter.svg';
import SearchIcon from '@/assets/icons/icon_search.svg';
import { SearchFormFields } from '@/enums/dbFields';

const KEY_PRESS_DELAY = 200;

type SearchFilterProps = {
  control: Control<FieldValues>;
  onFilterButtonPress?: () => void;
  onSearch?: () => void;
  onInputFocus?: () => void;
};

const SearchFilter = ({
  control,
  onSearch,
  onFilterButtonPress,
  onInputFocus
}: SearchFilterProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'searchScreen' });
  const [timerId, setTimerId] = useState<NodeJS.Timeout>();
  const { search } = useLocalSearchParams();
  const [prevValue, setPrevValue] = useState('');

  const handleChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const value = e.nativeEvent.text;
    if (value.length < prevValue.length) {
      clearTimeout(timerId);
      return setPrevValue(value);
    }
    setPrevValue(value);
    setTimerId(
      setTimeout(() => {
        onSearch && onSearch();
      }, KEY_PRESS_DELAY)
    );
  };

  const handleButtonPress = () => {
    Keyboard.dismiss();
    onFilterButtonPress && onFilterButtonPress();
  };

  return (
    <View style={styles.searchFilterContainer}>
      <CustomInput
        leftItem={<SearchIcon />}
        name={SearchFormFields.Name}
        control={control}
        style={styles.searchInput}
        outerStyle={styles.flex}
        placeholder={t('searchPlaceholder')}
        numberOfLines={1}
        maxLength={40}
        onChange={e => handleChange(e)}
        autoFocus={!!search}
        onFocus={onInputFocus}
        rules={{ required: true }}
      />
      <CustomButton style={styles.filterButton} onPress={handleButtonPress}>
        <FilterIcon />
      </CustomButton>
    </View>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    width: 40,
    height: 40
  },
  searchFilterContainer: {
    flexDirection: 'row',
    gap: 20,
    width: '100%'
  },
  searchInput: {
    height: 40,
    paddingVertical: 0,
    paddingLeft: 38
  },
  flex: {
    flex: 1
  }
});

export default SearchFilter;
