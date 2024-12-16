export const getDaysInMonth = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
};

export const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const format = (date: Date, formatStr: string): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const padZero = (num: number): string => num.toString().padStart(2, '0');

  return formatStr
    .replace('yyyy', date.getFullYear().toString())
    .replace('MM', padZero(date.getMonth() + 1))
    .replace('MMMM', months[date.getMonth()])
    .replace('d', date.getDate().toString())
    .replace('dd', padZero(date.getDate()));
};

export const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(date.getMonth() + months);
  return newDate;
};

export const subMonths = (date: Date, months: number): Date => {
  return addMonths(date, -months);
};