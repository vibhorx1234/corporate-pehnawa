// File: ./backend/src/utils/seedDatabase.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Collection = require('../models/Collection');
const Product = require('../models/Product');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Import JSON data
const collectionsData = require('../../data/collections.json');
const productsData = require('../../data/products.json');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Clear existing data
const clearDatabase = async () => {
  try {
    await Collection.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing collections and products');
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    throw error;
  }
};

// Seed collections
const seedCollections = async () => {
  try {
    const collections = await Collection.insertMany(collectionsData);
    console.log(`✅ Seeded ${collections.length} collections`);
    return collections;
  } catch (error) {
    console.error('❌ Error seeding collections:', error.message);
    throw error;
  }
};

// Seed products with proper collection references
const seedProducts = async (collections) => {
  try {
    // Create a map of slug to ObjectId
    const collectionMap = {};
    collections.forEach(collection => {
      collectionMap[collection.slug] = collection._id;
    });

    // Transform products data to use ObjectId instead of slug
    const productsWithRefs = productsData.map(product => {
      const collectionId = collectionMap[product.collection];
      
      if (!collectionId) {
        console.warn(`⚠️  Warning: Collection "${product.collection}" not found for product "${product.name}"`);
        return null;
      }

      return {
        ...product,
        collection: collectionId // Replace slug with ObjectId
      };
    }).filter(product => product !== null); // Remove products with invalid collections

    const products = await Product.insertMany(productsWithRefs);
    console.log(`✅ Seeded ${products.length} products`);
    return products;
  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
    throw error;
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to database
    await connectDB();

    // Clear existing data
    await clearDatabase();

    // Seed collections first
    const collections = await seedCollections();

    // Seed products with collection references
    await seedProducts(collections);

    console.log('\n✨ Database seeding completed successfully!');
    
    // Display summary
    console.log('\n📊 Summary:');
    console.log(`   Collections: ${collections.length}`);
    collections.forEach(col => {
      const productCount = productsData.filter(p => p.collection === col.slug).length;
      console.log(`   - ${col.name}: ${productCount} products`);
    });

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;