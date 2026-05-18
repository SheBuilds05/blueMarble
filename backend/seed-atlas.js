const mongoose = require('mongoose');
require('dotenv').config();

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

const sampleTransactions = [
  {
    beneficiaryName: 'Salary Deposit',
    amount: 25000,
    reference: 'Monthly salary',
    type: 'Deposit',
    category: 'Income',
    status: 'completed',
    date: new Date()
  },
  {
    beneficiaryName: 'Checkers Groceries',
    amount: 3500,
    reference: 'Weekly shopping',
    type: 'Payment',
    category: 'Food',
    status: 'completed',
    date: new Date()
  },
  {
    beneficiaryName: 'Eskom',
    amount: 1200,
    reference: 'Electricity bill',
    type: 'Payment',
    category: 'Utilities',
    status: 'completed',
    date: new Date()
  },
  {
    beneficiaryName: 'Freelance Work',
    amount: 5000,
    reference: 'Web project',
    type: 'Deposit',
    category: 'Income',
    status: 'completed',
    date: new Date()
  },
  {
    beneficiaryName: 'MTN Airtime',
    amount: 299,
    reference: 'Monthly data',
    type: 'Purchase',
    category: 'Mobile',
    status: 'completed',
    date: new Date()
  }
];

async function seedDatabase() {
  try {
    console.log('📡 Connecting to MongoDB Atlas...');
    console.log('Connection string:', process.env.MONGODB_URI?.substring(0, 50) + '...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    
    const deleted = await Transaction.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.deletedCount} old transactions`);
    
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