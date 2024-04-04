import { RefObject, useState } from 'react';
import { Control, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import AddPreparingTile from '../molecules/AddPreparingTile';
import PreparingTile from '../molecules/PreparingTile';

import CustomButton from '@/components/atoms/CustomButton';
import { generateId } from '@/utils/generateId';

type PreparingStepsToDisplayProps = {
  control?: Control<FieldValues>;
  scrollRef?: RefObject<ScrollView>;
  stepsToDisplay?: string[];
  stepsToEdit?: string[];
};

type PreparingStep = {
  id?: string;
  step: string;
};

const PreparingStepsToDisplay = ({
  stepsToEdit,
  stepsToDisplay,
  control,
  scrollRef
}: PreparingStepsToDisplayProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'addRecipeScreen' });
  const [autoFocus, setAutoFocus] = useState(false);

  const initialStep: PreparingStep = {
    id: generateId(),
    step: ''
  };

  const initialStepsToEdit = stepsToEdit?.map(step => {
    return {
      id: generateId(),
      step
    };
  });
  const [preparingIds, setPreparingIds] = useState<PreparingStep[]>(
    initialStepsToEdit ?? [initialStep]
  );

  const handleAddPreparing = () => {
    setAutoFocus(true);
    const newField: PreparingStep = {
      id: generateId(),
      step: ''
    };
    setPreparingIds(state => [...state, newField]);
  };

  const handleDeletePreparing = (id: string) => {
    if (preparingIds.length === 1) return;
    setPreparingIds(state => state.filter(step => step.id !== id));
  };

  const handleScrollToEnd = () => {
    scrollRef && scrollRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View style={styles.mainContainer}>
      {stepsToDisplay
        ? stepsToDisplay.map((step, index) => (
            <PreparingTile key={index} tileIndex={index} preparingStep={step} />
          ))
        : preparingIds.map(({ id, step }, index) => (
            <AddPreparingTile
              tileId={id!}
              tileIndex={index}
              key={id!}
              control={control!}
              handleDelete={() => handleDeletePreparing(id!)}
              onLayout={() => handleScrollToEnd()}
              defaultValue={step}
              autoFocus={autoFocus}
            />
          ))}
      {!stepsToDisplay && <CustomButton onPress={handleAddPreparing} label={t('addStep')} />}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 30
  }
});

export default PreparingStepsToDisplay;
