const mongoose = require('mongoose');

// Simple transaction schema
const transactionSchema = new mongoose.Schema({
  beneficiaryName: String,
  amount: Number,
  reference: String,
  type: String,
  category: String,
  status: String,
  date: Date
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Sample data
const sampleTransactions = [
  {
    beneficiaryName: 'Salary Deposit',
    amount: 25000,
    reference: 'Monthly salary',
    type: 'Deposit',
    category: 'Income',
    status: 'completed',
    date: new Date('2024-01-15')
  },
  {
    beneficiaryName: 'Checkers Groceries',
    amount: 3500,
    reference: 'Weekly shopping',
    type: 'Payment',
    category: 'Food',
    status: 'completed',
    date: new Date('2024-01-16')
  },
  {
    beneficiaryName: 'Eskom',
    amount: 1200,
    reference: 'Electricity bill',
    type: 'Payment',
    category: 'Utilities',
    status: 'completed',
    date: new Date('2024-01-17')
  },
  {
    beneficiaryName: 'Freelance Work',
    amount: 5000,
    reference: 'Web development project',
    type: 'Deposit',
    category: 'Income',
    status: 'completed',
    date: new Date('2024-01-18')
  },
  {
    beneficiaryName: 'MTN Airtime',
    amount: 299,
    reference: 'Monthly data bundle',
    type: 'Purchase',
    category: 'Mobile',
    status: 'completed',
    date: new Date('2024-01-19')
  }
];

async function seedDatabase() {
  try {
    console.log('📡 Connecting to MongoDB...');
    
    await mongoose.connect('mongodb://localhost:27017/bluemarble');
    
    console.log('✅ Connected to database');
    
    // Clear existing
    const deleted = await Transaction.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.deletedCount} old transactions`);
    
    // Insert new data
    const inserted = await Transaction.insertMany(sampleTransactions);
    console.log(`✅ Inserted ${inserted.length} new transactions`);
    
    console.log('\n📊 Transactions added:');
    inserted.forEach(t => {
      console.log(`   - ${t.type}: ${t.beneficiaryName} - R${t.amount}`);
    });
    
    await mongoose.disconnect();
    console.log('\n✨ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedDatabase();