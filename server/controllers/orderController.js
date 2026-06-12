const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  try {
    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items provided');
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      res.status(400);
      throw new Error('Complete shipping address is required');
    }

    // Normalize and validate each order item, verify stock
    const normalizedItems = [];
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Product not found with ID: ${item.product}`);
      }

      // Unified name: support both name and title fields
      const productName = product.name || product.title || 'Unknown Product';
      const productStock = product.stock !== undefined ? product.stock : 999;

      if (productStock < item.quantity) {
        res.status(400);
        throw new Error(
          `Insufficient stock for "${productName}". Available: ${productStock}, Requested: ${item.quantity}`
        );
      }

      // Normalize the order item to match the schema
      normalizedItems.push({
        product: product._id,
        name: productName,
        title: productName,
        quantity: item.quantity,
        price: item.price || product.price,
        size: item.size || '',
        image: item.image || item.mainImg || product.mainImg || (product.images && product.images[0]) || '',
        mainImg: item.mainImg || item.image || product.mainImg || (product.images && product.images[0]) || '',
      });
    }

    // Deduct stock for all items (after all validations pass)
    for (const item of normalizedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Create the order
    const order = new Order({
      user: req.user._id,
      orderItems: normalizedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      itemsPrice: itemsPrice || 0,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalPrice: totalPrice || 0,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (order) {
      // Allow only the owner or an admin to see this order
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to view this order');
      }
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status or mark as paid / delivered (Admin only)
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  const { orderStatus, isPaid, isDelivered } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (orderStatus) {
        order.orderStatus = orderStatus;
        if (orderStatus === 'Delivered') {
          order.isDelivered = true;
          order.deliveredAt = Date.now();
          // Auto-mark as paid on delivery
          order.isPaid = true;
          if (!order.paidAt) order.paidAt = Date.now();
        }
        if (orderStatus === 'Cancelled') {
          // Restore stock for cancelled orders
          for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { stock: item.quantity }
            });
          }
        }
      }

      if (isPaid !== undefined) {
        order.isPaid = isPaid;
        if (isPaid) {
          order.paidAt = Date.now();
        }
      }

      if (isDelivered !== undefined) {
        order.isDelivered = isDelivered;
        if (isDelivered) {
          order.deliveredAt = Date.now();
        }
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
