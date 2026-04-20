import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;

      try {
        // Ensure this points to your active backend port (5000)
        const res = await axios.get('http://localhost:5000/api/transactions', {
          headers: { 'x-user-id': userId }
        });
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchHistory();
  }, [userId]);

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>Please log in to view your history.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
      <div className="space-y-4">
        {transactions.length > 0 ? (
          transactions.map((tx: any) => (
            <div key={tx._id} className="p-4 bg-slate-800 rounded-2xl flex justify-between">
              <span>{tx.description}</span>
              <span className={tx.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                {tx.type === 'income' ? '+' : '-'} R {tx.amount}
              </span>
            </div>
          ))
        ) : (
          <p className="text-slate-400">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

// CRITICAL: This line fixes the "No default export" error
export default History;