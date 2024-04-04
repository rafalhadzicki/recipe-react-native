import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import CustomHeader from '@/components/atoms/CustomHeader';
import { Screens } from '@/enums/screens';

const RecipesLayout = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'savedRecipesScreen' });
  return (
    <Stack>
      <Stack.Screen
        name={Screens.Index}
        options={{ header: () => <CustomHeader title={t('screenName')} /> }}
      />
    </Stack>
  );
};

export default RecipesLayout;
