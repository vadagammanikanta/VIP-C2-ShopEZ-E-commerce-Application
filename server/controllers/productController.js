const Product = require('../models/Product');

// @desc    Get all products (with optional search, category filter, sorting, and pagination)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;

    let query = {};

    // Full text search
    if (keyword) {
      query.$or = [
        { $text: { $search: keyword } },
        { name: { $regex: keyword, $options: 'i' } },
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Category filter (case-insensitive)
    if (category) {
      query.category = { $regex: `^${category}$`, $options: 'i' };
    }

    // Price range filters
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'priceAsc') sortOption = { price: 1 };
    else if (sort === 'priceDesc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'discount') sortOption = { discount: -1 };

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  const {
    name, title, description, price, category, stock,
    images, mainImg, carousel, sizes, gender, discount,
  } = req.body;

  try {
    const productName = name || title;
    if (!productName || !description || price === undefined || !category) {
      res.status(400);
      throw new Error('Required fields: name (or title), description, price, category');
    }

    const product = new Product({
      name: productName,
      title: productName,
      description,
      price: Number(price),
      category,
      stock: stock !== undefined ? Number(stock) : 100,
      images: images || (mainImg ? [mainImg] : []),
      mainImg: mainImg || (images && images[0]) || '',
      carousel: carousel || [],
      sizes: sizes || [],
      gender: gender || 'Unisex',
      discount: discount !== undefined ? Number(discount) : 0,
      rating: 0,
      numReviews: 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  const {
    name, title, description, price, category, stock,
    images, mainImg, carousel, sizes, gender, discount,
  } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const newName = name || title || product.name || product.title;
      product.name = newName;
      product.title = newName;
      product.description = description || product.description;
      product.price = price !== undefined ? Number(price) : product.price;
      product.category = category || product.category;
      product.stock = stock !== undefined ? Number(stock) : product.stock;
      product.sizes = sizes || product.sizes;
      product.gender = gender || product.gender;
      product.discount = discount !== undefined ? Number(discount) : product.discount;

      if (mainImg) {
        product.mainImg = mainImg;
        product.images = [mainImg, ...(carousel || product.carousel || [])];
      } else if (images) {
        product.images = images;
        product.mainImg = images[0] || product.mainImg;
      }
      if (carousel !== undefined) {
        product.carousel = carousel;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
};
