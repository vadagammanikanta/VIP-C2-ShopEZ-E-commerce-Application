import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, MapPin } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemsPrice,
    getTaxPrice,
    getShippingPrice,
    getTotalPrice,
  } = useContext(CartContext);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Checkout shipping states
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [orderError, setOrderError] = useState('');

  const handleCheckoutToggle = () => {
    if (!user) {
      navigate('/login?redirect=cart');
    } else {
      // Pre-fill addresses if profile contains address
      if (user.addresses && user.addresses.length > 0) {
        const addr = user.addresses[0];
        setStreet(addr.street);
        setCity(addr.city);
        setState(addr.state);
        setPostalCode(addr.postalCode);
        setCountry(addr.country);
      }
      setCheckoutMode(true);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacingOrder(true);
    setOrderError('');

    try {
      const orderPayload = {
        orderItems: cartItems,
        shippingAddress: { street, city, state, postalCode, country },
        paymentMethod,
        itemsPrice: getItemsPrice(),
        taxPrice: getTaxPrice(),
        shippingPrice: getShippingPrice(),
        totalPrice: getTotalPrice(),
      };

      const { data } = await axios.post('/orders', orderPayload);
      setPlacedOrderId(data._id);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
      setOrderError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <div style={{ padding: '80px 5%', textAlign: 'center' }}>
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <ShoppingBag size={36} />
        </div>
        <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Order Confirmed!</h1>
        <p style={{ maxWidth: '500px', margin: '0 auto 24px' }}>
          Thank you for shopping with ShopEZ. Your order ID is <strong>{placedOrderId}</strong>. We will notify you when it ships.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/profile" className="btn btn-primary">
            View My Orders
          </Link>
          <Link to="/" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '80px 5%', textAlign: 'center' }}>
        <ShoppingBag size={48} style={{ color: 'var(--text-color)', marginBottom: '16px' }} />
        <h2>Your Cart is Empty</h2>
        <p style={{ margin: '8px 0 24px' }}>Browse our catalog to add products.</p>
        <Link to="/" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container" id="cart-page-container">
      {/* Items list */}
      <div>
        <h2>Shopping Cart ({cartItems.length} items)</h2>
        <div className="cart-items-list" style={{ marginTop: '20px' }} id="cart-items-list">
          {cartItems.map((item) => (
            <div key={`${item.product}-${item.size}`} className="cart-item-row" id={`cart-item-${item.product}`}>
              <img
                src={item.mainImg || item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60'}
                alt={item.title || item.name}
                className="cart-item-img"
              />
              <div className="cart-item-info">
                <Link to={`/products/${item.product}`} className="cart-item-title">
                  {item.title || item.name}
                </Link>
                <div className="cart-item-meta">
                  Size: <strong>{item.size || 'M'}</strong> | Price: <strong>₹{item.price.toFixed(2)}</strong>
                </div>
              </div>
              <div className="cart-item-qty">
                <input
                  type="number"
                  min="1"
                  max={item.stock !== undefined ? item.stock : 99}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.product, Number(e.target.value), item.size)}
                  className="input-field"
                  id={`cart-item-qty-${item.product}`}
                />
                <button
                  onClick={() => removeFromCart(item.product, item.size)}
                  style={{ color: 'var(--danger-color)' }}
                  id={`cart-item-remove-${item.product}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {checkoutMode && (
          <div className="card" style={{ marginTop: '30px' }} id="checkout-form-container">
            <h3><MapPin size={18} style={{ verticalAlign: 'text-bottom', marginRight: '6px' }} /> Shipping Address</h3>
            <form onSubmit={handlePlaceOrder} className="auth-form" style={{ marginTop: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="123 Main St"
                  className="input-field"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  id="checkout-street"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>City</label>
                  <input
                    type="text"
                    required
                    placeholder="New York"
                    className="input-field"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    id="checkout-city"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>State / Region</label>
                  <input
                    type="text"
                    required
                    placeholder="NY"
                    className="input-field"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    id="checkout-state"
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Zip / Postal Code</label>
                  <input
                    type="text"
                    required
                    placeholder="10001"
                    className="input-field"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    id="checkout-zip"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Country</label>
                  <input
                    type="text"
                    required
                    placeholder="United States"
                    className="input-field"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    id="checkout-country"
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Payment Method</label>
                <select
                  className="input-field"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  id="checkout-payment-method"
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Credit Card">Credit Card / Debit Card</option>
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="PayPal">PayPal</option>
                </select>
              </div>

              {orderError && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--danger-color)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginTop: '10px'
                }} id="order-error-banner">
                  ⚠️ {orderError}
                </div>
              )}
              <button
                type="submit"
                disabled={placingOrder}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', marginTop: '10px' }}
                id="place-order-submit-btn"
              >
                {placingOrder ? 'Processing...' : 'Place Order & Complete Checkout'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Cart Summary Column */}
      <div className="cart-summary" id="cart-summary-sidebar">
        <h3>Order Summary</h3>
        <div style={{ marginTop: '20px' }}>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{getItemsPrice().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Estimated Tax (18% GST)</span>
            <span>₹{getTaxPrice().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>
              {getShippingPrice() === 0 ? 'FREE' : `₹${getShippingPrice().toFixed(2)}`}
            </span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span id="cart-total-price">₹{getTotalPrice().toFixed(2)}</span>
          </div>

          {!checkoutMode && (
            <button
              onClick={handleCheckoutToggle}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '24px', padding: '14px' }}
              id="checkout-proceed-btn"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
