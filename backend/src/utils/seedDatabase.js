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









// // File: ./backend/src/utils/seedDatabase.js  (MODIFIED)
// // Changes from original:
// //   1. Added User model import
// //   2. Added Cart, Address model imports for cleanup on re-seed
// //   3. Seeds a default admin user and a test customer user
// //   4. clearDatabase() now also clears Users, Carts, Addresses
// //   5. All original collection/product/blog seed logic is preserved as-is

// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const path = require('path');

// dotenv.config({ path: path.join(__dirname, '../../.env') });

// const connectDB = require('../config/database');

// // Models
// const Collection = require('../models/Collection');
// const Product = require('../models/Product');
// const Blog = require('../models/Blog');
// const Order = require('../models/Order');
// const User = require('../models/User');     // NEW
// const Cart = require('../models/Cart');     // NEW
// const Address = require('../models/Address'); // NEW

// // ─── Seed Data ────────────────────────────────────────────────────────────────

// const collectionsData = [
//   {
//     name: 'Formal Wear',
//     slug: 'formal-wear',
//     description: 'Elegant formal wear for corporate professionals',
//     thumbnail: '/uploads/collections/formal-wear.jpg',
//     featured: true,
//     order: 1
//   },
//   {
//     name: 'Casual Wear',
//     slug: 'casual-wear',
//     description: 'Comfortable and stylish casual clothing',
//     thumbnail: '/uploads/collections/casual-wear.jpg',
//     featured: true,
//     order: 2
//   },
//   {
//     name: 'Traditional Wear',
//     slug: 'traditional-wear',
//     description: 'Beautiful traditional Indian attire',
//     thumbnail: '/uploads/collections/traditional-wear.jpg',
//     featured: true,
//     order: 3
//   }
// ];

// const blogsData = [
//   {
//     title: 'Top 10 Corporate Fashion Trends for 2024',
//     slug: 'top-10-corporate-fashion-trends-2024',
//     excerpt: 'Discover the latest trends in corporate fashion that are dominating the workplace in 2024.',
//     content: `<p>Corporate fashion is evolving rapidly. Here are the top trends you need to know about...</p>
//     <h2>1. Sustainable Fabrics</h2>
//     <p>More companies are embracing sustainable materials...</p>
//     <h2>2. Smart Casual Revolution</h2>
//     <p>The line between formal and casual continues to blur...</p>`,
//     featuredImage: '/uploads/blogs/corporate-trends-2024.jpg',
//     tags: ['fashion', 'corporate', 'trends', '2024'],
//     published: true
//   },
//   {
//     title: 'How to Dress for Success in the Modern Workplace',
//     slug: 'dress-for-success-modern-workplace',
//     excerpt: 'Your guide to making the right impression with your professional wardrobe.',
//     content: `<p>First impressions matter, especially in the workplace...</p>
//     <h2>Understanding Your Company Culture</h2>
//     <p>Before choosing your outfit, understand the culture...</p>`,
//     featuredImage: '/uploads/blogs/dress-for-success.jpg',
//     tags: ['fashion', 'workplace', 'tips'],
//     published: true
//   }
// ];

// // NEW: Default users to seed
// const usersData = [
//   {
//     name: 'Admin User',
//     email: 'admin@corporatepehnawa.com',
//     password: 'Admin@123',
//     phone: '9876543210',
//     role: 'admin'
//   },
//   {
//     name: 'Test Customer',
//     email: 'customer@test.com',
//     password: 'Test@123',
//     phone: '9876543211',
//     role: 'customer'
//   }
// ];

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const clearDatabase = async () => {
//   console.log('🗑️  Clearing existing data...');
//   await Promise.all([
//     Collection.deleteMany({}),
//     Product.deleteMany({}),
//     Blog.deleteMany({}),
//     Order.deleteMany({}),
//     User.deleteMany({}),       // NEW
//     Cart.deleteMany({}),       // NEW
//     Address.deleteMany({})     // NEW
//   ]);
//   console.log('✅ Database cleared');
// };

// const seedCollections = async () => {
//   console.log('🌱 Seeding collections...');
//   const collections = await Collection.insertMany(collectionsData);
//   console.log(`✅ ${collections.length} collections seeded`);
//   return collections;
// };

// const seedProducts = async (collections) => {
//   console.log('🌱 Seeding products...');

//   const collectionMap = {};
//   collections.forEach(c => { collectionMap[c.slug] = c._id; });

//   const productsData = [
//     {
//       name: 'Classic White Formal Shirt',
//       slug: 'classic-white-formal-shirt',
//       description: 'A timeless white formal shirt crafted from premium cotton blend.',
//       price: 1299,
//       discountedPrice: 999,
//       images: ['/uploads/products/white-shirt-1.jpg', '/uploads/products/white-shirt-2.jpg'],
//       collection: collectionMap['formal-wear'],
//       featured: true,
//       inStock: true,
//       sizes: ['S', 'M', 'L', 'XL'],
//       fabric: '60% Cotton, 40% Polyester',
//       care: 'Machine wash cold, tumble dry low',
//       tags: ['formal', 'shirt', 'white', 'office'],
//       order: 1
//     },
//     {
//       name: 'Navy Blue Blazer',
//       slug: 'navy-blue-blazer',
//       description: 'A sophisticated navy blue blazer for the modern professional.',
//       price: 3499,
//       discountedPrice: 2799,
//       images: ['/uploads/products/navy-blazer-1.jpg', '/uploads/products/navy-blazer-2.jpg'],
//       collection: collectionMap['formal-wear'],
//       featured: true,
//       inStock: true,
//       sizes: ['S', 'M', 'L', 'XL'],
//       fabric: '100% Wool blend',
//       care: 'Dry clean only',
//       tags: ['formal', 'blazer', 'navy', 'office'],
//       order: 2
//     },
//     {
//       name: 'Casual Linen Kurta',
//       slug: 'casual-linen-kurta',
//       description: 'Breathable linen kurta perfect for everyday wear.',
//       price: 899,
//       discountedPrice: 699,
//       images: ['/uploads/products/linen-kurta-1.jpg'],
//       collection: collectionMap['casual-wear'],
//       featured: false,
//       inStock: true,
//       sizes: ['S', 'M', 'L', 'XL'],
//       fabric: '100% Linen',
//       care: 'Hand wash recommended',
//       tags: ['casual', 'kurta', 'linen'],
//       order: 3
//     },
//     {
//       name: 'Silk Saree - Royal Blue',
//       slug: 'silk-saree-royal-blue',
//       description: 'Exquisite royal blue silk saree with gold zari border.',
//       price: 5999,
//       discountedPrice: 4999,
//       images: ['/uploads/products/silk-saree-1.jpg', '/uploads/products/silk-saree-2.jpg'],
//       collection: collectionMap['traditional-wear'],
//       featured: true,
//       inStock: true,
//       sizes: ['S', 'M', 'L', 'XL'],
//       fabric: 'Pure Silk',
//       care: 'Dry clean only',
//       tags: ['traditional', 'saree', 'silk', 'festive'],
//       order: 4
//     }
//   ];

//   const products = await Product.insertMany(productsData);
//   console.log(`✅ ${products.length} products seeded`);
//   return products;
// };

// const seedBlogs = async () => {
//   console.log('🌱 Seeding blogs...');
//   const blogs = await Blog.insertMany(blogsData);
//   console.log(`✅ ${blogs.length} blogs seeded`);
// };

// // NEW: Seed users and create empty carts for customer accounts
// const seedUsers = async () => {
//   console.log('🌱 Seeding users...');
//   const createdUsers = [];

//   for (const userData of usersData) {
//     const user = new User(userData); // use new so pre-save bcrypt hook fires
//     await user.save();
//     createdUsers.push(user);

//     // Create an empty cart for each user
//     await Cart.create({ user: user._id, items: [] });
//   }

//   console.log(`✅ ${createdUsers.length} users seeded`);
//   console.log('');
//   console.log('🔑 Seeded Credentials:');
//   console.log('   Admin  → admin@corporatepehnawa.com  / Admin@123');
//   console.log('   Customer → customer@test.com         / Test@123');
//   console.log('');

//   return createdUsers;
// };

// // ─── Main ─────────────────────────────────────────────────────────────────────

// const seedDatabase = async () => {
//   try {
//     await connectDB();

//     console.log('');
//     console.log('🚀 Starting database seed...');
//     console.log('');

//     await clearDatabase();

//     const collections = await seedCollections();
//     await seedProducts(collections);
//     await seedBlogs();
//     await seedUsers(); // NEW

//     console.log('');
//     console.log('🎉 Database seeded successfully!');
//     console.log('');
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Error seeding database:', error);
//     process.exit(1);
//   }
// };

// seedDatabase();