const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Define schemas to match Mongoose models directly
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

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String }
});

// Hash password before saving for User model in seeder
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Product = mongoose.model('products', productSchema);
const User = mongoose.model('users', userSchema);

const sampleProducts = [
  {
    title: "Iphone 12",
    description: "Apple Iphone with 8GB ram and 128GB internal storage. Features advanced dual-camera system and A14 Bionic chip.",
    mainImg: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80",
    carousel: ["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80"],
    sizes: ["128GB", "256GB"],
    category: "mobiles",
    gender: "Unisex",
    price: 79999,
    discount: 15
  },
  {
    title: "Realme buds",
    description: "TWS buds with 10.2mm drivers offering deep bass boost and 28 hours total playback time.",
    mainImg: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80",
    carousel: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80"],
    sizes: ["Standard"],
    category: "Electronics",
    gender: "Unisex",
    price: 3999,
    discount: 35
  },
  {
    title: "Cricket Ball",
    description: "High-quality red leather cricket ball for professional matches and practice.",
    mainImg: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80",
    carousel: ["https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80"],
    sizes: ["Full Size"],
    category: "Sports-Equipment",
    gender: "Unisex",
    price: 1699,
    discount: 23
  },
  {
    title: "Chess Board",
    description: "Premium quality chess board with beautifully crafted pieces. Perfect for sharpening your strategic skills.",
    mainImg: "https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?w=500&q=80",
    carousel: ["https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?w=500&q=80"],
    sizes: ["Large"],
    category: "Sports-Equipment",
    gender: "Unisex",
    price: 1838,
    discount: 0
  },
  {
    title: "Unisex Cotton Hoodie",
    description: "Ultra-soft cotton blend fleece hoodie with adjustable drawstrings and spacious pockets.",
    mainImg: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
    carousel: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80"],
    sizes: ["S", "M", "L", "XL"],
    category: "Fashion",
    gender: "Unisex",
    price: 1999,
    discount: 10
  },
  {
    title: "Ceramic Coffee Mug Set",
    description: "A set of 4 minimalist matte-finish ceramic coffee mugs designed for modern kitchens.",
    mainImg: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80",
    carousel: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80"],
    sizes: ["350ml"],
    category: "Groceries",
    gender: "Unisex",
    price: 999,
    discount: 5
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

    // Check if admin user already exists, if not create one
    const adminExists = await User.findOne({ email: 'admin@shopez.com' });
    if (!adminExists) {
      await User.create({
        name: "ShopEZ Administrator",
        email: "admin@shopez.com",
        password: "adminpassword123", // Will be automatically hashed by pre-save hook
        role: "admin",
        phone: "9999999999"
      });
      console.log('Successfully seeded default admin user!');
    } else {
      console.log('Admin user admin@shopez.com already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
