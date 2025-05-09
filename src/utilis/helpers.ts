import { format, formatDistance } from 'date-fns';

export const formatDate = (date: Date | string | number) => {
  const dateObj = new Date(date);
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateTime = (date: Date | string | number) => {
  const dateObj = new Date(date);
  return format(dateObj, 'MMM dd, yyyy HH:mm');
};

export const timeAgo = (date: Date | string | number) => {
  const dateObj = new Date(date);
  return formatDistance(dateObj, new Date(), { addSuffix: true });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount);
};

export const generateProjectCode = () => {
  const prefix = 'PRJ';
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const timestamp = new Date().getTime().toString().slice(-4);
  return `${prefix}-${randomNum}-${timestamp}`;
};

export const getProjectStatus = (status: string) => {
  const statusMap: Record<string, { color: string; text: string }> = {
    planning: { color: 'yellow', text: 'Planning' },
    in_progress: { color: 'blue', text: 'In Progress' },
    completed: { color: 'green', text: 'Completed' },
    on_hold: { color: 'gray', text: 'On Hold' }
  };
  return statusMap[status] || { color: 'gray', text: status };
};