export const calculateDateRange = (label: string) => {
  const today = new Date();
  let startDate = new Date();

  switch (label) {
    case '1w':
      startDate.setDate(today.getDate() - 7);
      break;
    case '1m':
      startDate.setMonth(today.getMonth() - 1);
      break;
    case '3m':
      startDate.setMonth(today.getMonth() - 3);
      break;
    case '6m':
      startDate.setMonth(today.getMonth() - 6);
      break;
    case '1y':
      startDate.setFullYear(today.getFullYear() - 1);
      break;
    case 'max':
      startDate.setFullYear(today.getFullYear() - 10);
      break;
    default:
      throw new Error('Invalid label');
  }

  return {
    startDate: startDate.toISOString(),
    endDate: today.toISOString(),
  };
};
