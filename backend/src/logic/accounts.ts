export const validateAccountType = (type: string) => {
  const allowedTypes = ['Savings', 'Cheque', 'Investment'];
  return allowedTypes.includes(type);
};