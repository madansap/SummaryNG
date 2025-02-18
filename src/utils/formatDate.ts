import { format } from 'date-fns';

export const formatDate = (date: Date) => {
  try {
    return format(new Date(date), 'MM/dd/yyyy');
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
}; 