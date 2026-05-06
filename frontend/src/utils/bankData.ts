export interface Transaction {
  _id: string;
  description: string;
  amount: number;
  date: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  category: string;
}

/**
 * Helper to calculate balance from any array of transactions 
 * (Works for both History and Full Statement pages)
 */
export const calculateBalanceFromData = (data: Transaction[]): number => {
  return data.reduce((acc, curr) => {
    return curr.type === 'deposit' ? acc + curr.amount : acc - curr.amount;
  }, 0);
};

/**
 * Reusable Fetch function to get live data
 */
export const fetchLiveTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch('http://localhost:5000/api/transactions/history');
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch live transactions:", error);
    return []; // Return empty array so the app doesn't crash
  }
};