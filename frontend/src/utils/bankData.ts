// src/utils/bankData.ts

export interface Transaction {
  id: number;
  date: string;
  desc: string;
  amount: number;
  type: 'income' | 'expense';
}

export const transactions: Transaction[] = [
  { id: 1, date: '12 April 2026', desc: 'Salary Deposit', amount: 32000, type: 'income' },
  { id: 2, date: '01 April 2026', desc: 'Rent Payment', amount: -8500, type: 'expense' },
  { id: 3, date: '28 March 2026', desc: 'Grocery Store', amount: -1200, type: 'expense' },
  { id: 4, date: '25 March 2026', desc: 'Electricity Purchase', amount: -500, type: 'expense' },
  { id: 5, date: '20 March 2026', desc: 'Netflix Subscription', amount: -199, type: 'expense' },
];

export const calculateTotalBalance = (): number => {
  return transactions.reduce((acc, curr) => acc + curr.amount, 0);
};