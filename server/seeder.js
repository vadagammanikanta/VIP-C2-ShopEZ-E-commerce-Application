const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  mainImg: { type: String, required: true },
  carousel: { type: Array, default: [] },
  sizes: { type: Array, default: [] },
  category: { type: String, required: true },
  gender: { type: String, default: 'Unisex' },
  price: { type: Number, required: true, default: 0 },
  discount: { type: Number, default: 0 }
});

const Product = mongoose.model('products', productSchema);

const sampleProducts = [
  {
    title: "Wireless Over-Ear Headphones",
    description: "High-fidelity wireless noise-cancelling headphones with comfortable memory foam ear cups and 30-hour battery life.",
    mainImg: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    carousel: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"],
    sizes: ["Standard"],
    category: "Electronics",
    gender: "Unisex",
    price: 199.99,
    discount: 15
  },
  {
    title: "Waterproof Sports Smartwatch",
    description: "Track your workouts, heart rate, sleep metrics, and sync notifications with this elegant waterproof smartwatch.",
    mainImg: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    carousel: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"],
    sizes: ["Standard"],
    category: "Electronics",
    gender: "Unisex",
    price: 129.99,
    discount: 5
  },
  {
    title: "Premium Cotton Hoodie",
    description: "Ultra-soft cotton blend fleece hoodie with adjustable double-lined hood and spacious front pouch pocket.",
    mainImg: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
    carousel: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80"],
    sizes: ["S", "M", "L", "XL"],
    category: "Clothing",
    gender: "Unisex",
    price: 49.99,
    discount: 0
  },
  {
    title: "Classic Denim Jacket",
    description: "A timeless button-front denim jacket styled from heavy-duty rigid cotton denim.",
    mainImg: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80",
    carousel: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80"],
    sizes: ["M", "L", "XL"],
    category: "Clothing",
    gender: "Unisex",
    price: 69.99,
    discount: 20
  },
  {
    title: "Minimalist Leather Sneakers",
    description: "Handcrafted premium leather sneakers featuring padded collars and solid flat rubber soles.",
    mainImg: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
    carousel: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80"],
    sizes: ["8", "9", "10", "11"],
    category: "Shoes",
    gender: "Unisex",
    price: 89.99,
    discount: 10
  },
  {
    title: "Matte Ceramic Coffee Mugs (Set of 4)",
    description: "A beautiful set of 4 minimalist matte-finish ceramic coffee mugs designed for elegant modern kitchens.",
    mainImg: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80",
    carousel: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80"],
    sizes: ["350ml"],
    category: "Home & Kitchen",
    gender: "Unisex",
    price: 24.99,
    discount: 0
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/shopez';
    console.log(`Connecting to database: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    // Delete existing products
    await Product.deleteMany();
    console.log('Cleared existing products');

    // Insert new products
    await Product.insertMany(sampleProducts);
    console.log('Successfully seeded database with products!');

    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
