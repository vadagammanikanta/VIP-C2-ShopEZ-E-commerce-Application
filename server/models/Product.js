const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, default: 0 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  // Primary name field — supports both 'name' and 'title' for legacy data
  name: { type: String },
  title: { type: String },

  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  category: { type: String, required: true, index: true },

  // Stock management
  stock: { type: Number, required: true, default: 100 },

  // Image fields — supports both 'images[]' and 'mainImg'+'carousel'
  images: [{ type: String }],
  mainImg: { type: String },
  carousel: [{ type: String }],

  // Additional product metadata
  sizes: [{ type: String }],
  gender: { type: String, default: 'Unisex' },
  discount: { type: Number, default: 0 },

  // Rating & reviews
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
}, {
  timestamps: true,
  // Virtual field: returns name || title for compatibility
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual: unified display name
productSchema.virtual('displayName').get(function () {
  return this.name || this.title || 'Unnamed Product';
});

// Virtual: unified primary image
productSchema.virtual('primaryImage').get(function () {
  return this.mainImg || (this.images && this.images[0]) || '';
});

// Pre-save hook: keep name and title in sync
productSchema.pre('save', function (next) {
  if (this.name && !this.title) this.title = this.name;
  if (this.title && !this.name) this.name = this.title;
  if (this.mainImg && (!this.images || this.images.length === 0)) {
    this.images = [this.mainImg, ...(this.carousel || [])];
  }
  if (this.images && this.images.length > 0 && !this.mainImg) {
    this.mainImg = this.images[0];
  }
  next();
});

// Text index for full-text search
productSchema.index({ name: 'text', title: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
