const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Shop = require('./models/Shop');
const Beneficiary = require('./models/Beneficiary');
const Transaction = require('./models/Transaction');
const Conflict = require('./models/Conflict');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB Connected for Seeding');
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing
    await User.deleteMany();
    await Shop.deleteMany();
    await Beneficiary.deleteMany();
    await Transaction.deleteMany();
    await Conflict.deleteMany();

    console.log('Existing Data Cleared');

    // 1. Create Shops
    const shops = await Shop.insertMany([
      {
        shopId: 'SHOP-MH-001',
        name: 'Wardha Road Ration Shop',
        village: 'Pulgaon',
        district: 'Wardha',
        state: 'Maharashtra',
      },
      {
        shopId: 'SHOP-MH-002',
        name: 'Hinganghat Ration Shop',
        village: 'Hinganghat',
        district: 'Wardha',
        state: 'Maharashtra',
      }
    ]);

    // 2. Create Users with hashed passwords
    const hashedPassword = await bcrypt.hash('123', 10);
    
    const users = await User.insertMany([
      {
        name: 'System Admin',
        email: '1@gmail.com',
        password: hashedPassword,
        role: 'admin',
      },
      {
        name: 'Ramesh Patil',
        email: '2@gmail.com',
        password: hashedPassword,
        role: 'supervisor',
      },
      {
        name: 'Suresh Kumar',
        email: '3@gmail.com',
        password: hashedPassword,
        role: 'officer',
        shopId: shops[0]._id, // Use MongoDB _id
      },
      {
        name: 'Priya Nair',
        email: '4@gmail.com',
        password: hashedPassword,
        role: 'officer',
        shopId: shops[1]._id, // Use MongoDB _id
      }
    ]);

    // Update shops with their assigned officers
    await Shop.findOneAndUpdate({ shopId: 'SHOP-MH-001' }, { assignedOfficer: users[2]._id });
    await Shop.findOneAndUpdate({ shopId: 'SHOP-MH-002' }, { assignedOfficer: users[3]._id });

    // 3. Create Beneficiaries (30 total)
    const beneficiaries = [];
    const quotas = {
      AAY: { rice: 35, wheat: 0, sugar: 1, oil: 1 },
      BPL: { rice: 10, wheat: 15, sugar: 0.5, oil: 0.5 },
      APL: { rice: 5, wheat: 10, sugar: 0, oil: 0 }
    };

    // 10 APL to Shop 1
    for (let i = 1; i <= 10; i++) {
      let idStr = i.toString().padStart(3, '0');
      beneficiaries.push({
        cardId: `RC-MH-${idStr}`,
        name: `APL Family ${i}`,
        village: 'Pulgaon',
        district: 'Wardha',
        state: 'Maharashtra',
        category: 'APL',
        monthlyQuota: quotas['APL'],
        assignedShopId: 'SHOP-MH-001'
      });
    }

    // 10 BPL to Shop 1
    for (let i = 11; i <= 20; i++) {
      let idStr = i.toString().padStart(3, '0');
      beneficiaries.push({
        cardId: `RC-MH-${idStr}`,
        name: `BPL Family ${i}`,
        village: 'Pulgaon',
        district: 'Wardha',
        state: 'Maharashtra',
        category: 'BPL',
        monthlyQuota: quotas['BPL'],
        assignedShopId: 'SHOP-MH-001'
      });
    }

    // 10 AAY to Shop 2
    for (let i = 21; i <= 30; i++) {
      let idStr = i.toString().padStart(3, '0');
      beneficiaries.push({
        cardId: `RC-MH-${idStr}`,
        name: `AAY Family ${i}`,
        village: 'Hinganghat',
        district: 'Wardha',
        state: 'Maharashtra',
        category: 'AAY',
        monthlyQuota: quotas['AAY'],
        assignedShopId: 'SHOP-MH-002'
      });
    }

    await Beneficiary.insertMany(beneficiaries);

    // 4. Sample Transactions
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const txns = [];

    // Create 10 normal synced transactions for Shop 1
    for (let i = 1; i <= 10; i++) {
      let idStr = i.toString().padStart(3, '0');
      txns.push({
        txnId: `TXN-OK-${idStr}`,
        cardId: `RC-MH-${idStr}`,
        beneficiaryName: `APL Family ${i}`,
        shopId: 'SHOP-MH-001',
        month: currentMonth,
        itemsDistributed: quotas['APL'],
        status: 'synced',
        recordedAt: new Date(),
        syncedAt: new Date()
      });
    }

    await Transaction.insertMany(txns);

    // Create a conflict (Same card, two shops)
    const conflictCardId = 'RC-MH-025'; // From AAY in Shop 2
    const t1 = await Transaction.create({
      txnId: `TXN-CON-1`,
      cardId: conflictCardId,
      beneficiaryName: 'AAY Family 25',
      shopId: 'SHOP-MH-001',
      month: currentMonth,
      itemsDistributed: quotas['AAY'],
      status: 'conflict',
      recordedAt: new Date(),
      syncedAt: new Date()
    });

    const t2 = await Transaction.create({
      txnId: `TXN-CON-2`,
      cardId: conflictCardId,
      beneficiaryName: 'AAY Family 25',
      shopId: 'SHOP-MH-002',
      month: currentMonth,
      itemsDistributed: quotas['AAY'],
      status: 'conflict',
      recordedAt: new Date(),
      syncedAt: new Date()
    });

    await Conflict.create({
      conflictId: `CON-MH-${Date.now()}`,
      cardId: conflictCardId,
      beneficiaryName: 'AAY Family 25',
      month: currentMonth,
      transactions: [t1._id, t2._id],
      shops: ['SHOP-MH-001', 'SHOP-MH-002'],
      status: 'pending'
    });

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with data import', error);
    process.exit(1);
  }
};

seedData();