import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';

const History: React.FC = () => {
  const brandBlue = '#052ce0';

  return (
    <div style={{ backgroundColor: '#EDF2F7', minHeight: '100vh', padding: '40px 10%', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Account Summary Section */}
      <div style={{ 
        backgroundColor: 'white', padding: '30px', borderRadius: '24px', 
        marginBottom: '40px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
      }}>
        <p style={{ color: '#718096', fontWeight: 600, fontSize: '0.9rem', marginBottom: '5px' }}>Available Balance</p>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1A202C' }}>R 45,670.89</h2>
      </div>

      {/* Transactions Section */}
      <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '25px 30px', borderBottom: '1px solid #F7FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: 800 }}>Recent Transactions</h3>
          
          {/* Pagination/Filters Section */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button style={{ background: '#F7FAFC', border: '1px solid #E2E8F0', padding: '8px 15px', borderRadius: '8px', fontSize: '0.85rem' }}>Last 30 Days</button>
            <button style={{ background: '#F7FAFC', border: '1px solid #E2E8F0', padding: '8px 15px', borderRadius: '8px', fontSize: '0.85rem' }}>
              <Filter size={14} style={{ marginRight: '5px' }} /> Filters
            </button>
          </div>
        </div>

        {/* Transaction Items */}
        {[
          { desc: 'Salary Deposit', amt: '+ R 32,000.00', date: '12 April 2026', type: 'in' },
          { desc: 'Rent Payment', amt: '- R 8,500.00', date: '01 April 2026', type: 'out' },
          { desc: 'Grocery Store', amt: '- R 1,200.00', date: '28 March 2026', type: 'out' },
        ].map((item, i) => (
          <div key={i} style={{ 
            display: 'flex', justifyContent: 'space-between', padding: '20px 30px', 
            borderBottom: '1px solid #F7FAFC', alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div style={{ backgroundColor: item.type === 'in' ? '#E6FFFA' : '#FFF5F5', padding: '10px', borderRadius: '12px' }}>
                {item.type === 'in' ? <ArrowDownLeft color="#38B2AC" /> : <ArrowUpRight color="#E53E3E" />}
              </div>
              <div>
                <p style={{ fontWeight: 700, margin: 0 }}>{item.desc}</p>
                <p style={{ fontSize: '0.8rem', color: '#A0AEC0', margin: 0 }}>{item.date}</p>
              </div>
            </div>
            <p style={{ fontWeight: 800, color: item.type === 'in' ? '#38B2AC' : '#1A202C' }}>{item.amt}</p>
          </div>
        ))}

        {/* "Show More" Button */}
        <button style={{ 
          width: '100%', padding: '20px', background: 'none', border: 'none', 
          color: brandBlue, fontWeight: 700, cursor: 'pointer', textAlign: 'center'
        }}>
          Show more
        </button>
      </div>
    </div>
  );
};

export default History;