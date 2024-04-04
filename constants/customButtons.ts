import { SortingDirections } from '@/enums/dbFields';
import { CustomButton } from '@/models/UI/customButton';

export const timeFilterButtons: CustomButton<SortingDirections>[] = [
  { id: 1, name: 'newest', value: SortingDirections.Descending },
  { id: 2, name: 'oldest', value: SortingDirections.Ascending }
];

export const rateFilterButtons: CustomButton<number>[] = [
  { id: 6, name: 'All', value: 6 },
  { id: 5, name: '5', value: 5 },
  { id: 4, name: '4', value: 4 },
  { id: 3, name: '3', value: 3 },
  { id: 2, name: '2', value: 2 },
  { id: 1, name: '1', value: 1 }
];

export const ratingButtons: CustomButton<number>[] = [
  { id: 1, name: '1', value: 1 },
  { id: 2, name: '2', value: 2 },
  { id: 3, name: '3', value: 3 },
  { id: 4, name: '4', value: 4 },
  { id: 5, name: '5', value: 5 }
];
