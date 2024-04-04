import uuid from 'react-native-uuid';

export const generateId = () => {
  const id = uuid.v4();
  return id as string;
};
