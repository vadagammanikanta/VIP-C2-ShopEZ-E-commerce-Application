const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');

const sampleProducts = [
  {
    name: 'iPhone 12',
    title: 'iPhone 12',
    description: 'Apple iPhone 12 with 8GB RAM and 128GB internal storage. Features advanced dual-camera system and A14 Bionic chip for blazing-fast performance.',
    mainImg: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80'],
    carousel: ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80'],
    sizes: ['128GB', '256GB'],
    category: 'mobiles',
    gender: 'Unisex',
    price: 79999,
    discount: 15,
    stock: 50,
    rating: 4.5,
    numReviews: 124,
  },
  {
    name: 'Realme Buds Air Pro',
    title: 'Realme Buds Air Pro',
    description: 'TWS earbuds with 10.2mm dynamic drivers, Active Noise Cancellation, and 28 hours total playback. Deep bass boost with crystal clear highs.',
    mainImg: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80'],
    carousel: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80'],
    sizes: ['Standard'],
    category: 'Electronics',
    gender: 'Unisex',
    price: 3999,
    discount: 35,
    stock: 120,
    rating: 4.2,
    numReviews: 89,
  },
  {
    name: 'Professional Cricket Ball',
    title: 'Professional Cricket Ball',
    description: 'High-quality red leather cricket ball for professional matches and practice sessions. Meets international standards for durability and bounce.',
    mainImg: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80'],
    carousel: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80'],
    sizes: ['Full Size'],
    category: 'Sports-Equipment',
    gender: 'Unisex',
    price: 1699,
    discount: 23,
    stock: 200,
    rating: 4.7,
    numReviews: 56,
  },
  {
    name: 'Premium Chess Board Set',
    title: 'Premium Chess Board Set',
    description: 'Premium quality chess board with beautifully hand-crafted pieces. Weighted pieces with a felted base for perfect grip. Ideal for beginners and pros.',
    mainImg: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?w=500&q=80'],
    carousel: ['https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?w=500&q=80'],
    sizes: ['Large'],
    category: 'Sports-Equipment',
    gender: 'Unisex',
    price: 1838,
    discount: 0,
    stock: 80,
    rating: 4.8,
    numReviews: 34,
  },
  {
    name: 'Unisex Cotton Hoodie',
    title: 'Unisex Cotton Hoodie',
    description: 'Ultra-soft 100% cotton blend fleece hoodie with adjustable drawstrings, kangaroo pocket, and ribbed cuffs. Timeless comfort for any season.',
    mainImg: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80'],
    carousel: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80'],
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'Fashion',
    gender: 'Unisex',
    price: 1999,
    discount: 10,
    stock: 150,
    rating: 4.4,
    numReviews: 211,
  },
  {
    name: 'Ceramic Coffee Mug Set',
    title: 'Ceramic Coffee Mug Set',
    description: 'A set of 4 minimalist matte-finish ceramic coffee mugs designed for modern kitchens. Microwave and dishwasher safe. 350ml capacity each.',
    mainImg: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80'],
    carousel: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80'],
    sizes: ['350ml'],
    category: 'Groceries',
    gender: 'Unisex',
    price: 999,
    discount: 5,
    stock: 300,
    rating: 4.3,
    numReviews: 67,
  },
  {
    name: 'Samsung Galaxy Tab A8',
    title: 'Samsung Galaxy Tab A8',
    description: 'Samsung Galaxy Tab A8 with 10.5-inch LCD display, Unisoc T618 processor, 4GB RAM, 64GB storage, and a 7040mAh battery. Perfect for work and entertainment.',
    mainImg: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80'],
    carousel: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80'],
    sizes: ['64GB', '128GB'],
    category: 'Electronics',
    gender: 'Unisex',
    price: 24999,
    discount: 12,
    stock: 45,
    rating: 4.1,
    numReviews: 98,
  },
  {
    name: "Men's Running Shoes",
    title: "Men's Running Shoes",
    description: 'Lightweight and breathable mesh running shoes with responsive foam cushioning and a non-slip rubber outsole. Perfect for daily training and casual wear.',
    mainImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'],
    carousel: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'],
    sizes: ['6', '7', '8', '9', '10', '11'],
    category: 'Fashion',
    gender: 'Men',
    price: 2499,
    discount: 20,
    stock: 90,
    rating: 4.6,
    numReviews: 188,
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert new products with proper unified schema
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${inserted.length} products successfully!`);

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@shopez.com' });
    if (!adminExists) {
      await User.create({
        name: 'ShopEZ Administrator',
        email: 'admin@shopez.com',
        password: 'adminpassword123',
        role: 'admin',
        phone: '9999999999',
      });
      console.log('✅ Admin user created: admin@shopez.com / adminpassword123');
    } else {
      console.log('ℹ️  Admin user already exists, skipping.');
    }

    console.log('🎉 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

seedDB();
