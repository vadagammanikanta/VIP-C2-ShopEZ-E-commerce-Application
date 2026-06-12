import { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Star, Heart, Check } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`/products/${id}`);
        setProduct(data);
        // Default to first available size if array exists
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, selectedSize);
      setAddedMessage(true);
      setIsAdded(true);
      setTimeout(() => {
        setAddedMessage(false);
        setIsAdded(false);
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--danger-color)', marginBottom: '16px' }}>{error || 'Product not found'}</h2>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Products
        </Link>
      </div>
    );
  }

  const imageUrl = product.mainImg || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
  const defaultSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'];
  const productStock = 99; // Standard infinite stock

  return (
    <div className="detail-container" id="product-detail-page">
      <div>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back to Browse
        </Link>
        <img
          src={imageUrl}
          alt={product.title || product.name}
          className="detail-img"
          id="detail-main-img"
        />
      </div>

      <div className="detail-info">
        <span className="detail-category">{product.category}</span>
        <h1 className="detail-title" id="detail-product-title">{product.title || product.name}</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                fill={star <= Math.round(product.rating || 4) ? '#f59e0b' : 'none'}
                color="#f59e0b"
              />
            ))}
            <span style={{ fontWeight: '600', marginLeft: '6px', color: 'var(--text-dark)' }}>
              {product.rating?.toFixed(1) || '4.5'}
            </span>
          </div>
          <span>({product.numReviews || 12} customer reviews)</span>
        </div>

        <div className="detail-price-row">
          <span className="detail-price" id="detail-product-price">₹{product.price.toFixed(2)}</span>
          <span className="detail-stock in-stock">
            In Stock
          </span>
        </div>

        <p className="detail-desc">{product.description}</p>

        {productStock > 0 && (
          <>
            <div>
              <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Select Size</span>
              <div className="size-select-row" id="size-selectors">
                {defaultSizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Quantity</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <input
                  type="number"
                  min="1"
                  max={productStock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(productStock, Number(e.target.value))))}
                  className="input-field"
                  style={{ width: '80px' }}
                  id="detail-qty-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              <button
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: isAdded ? 'var(--success-color)' : 'var(--primary-color)',
                  transition: 'background-color 0.2s ease'
                }}
                id="detail-add-to-cart-btn"
              >
                {isAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
                {isAdded ? ' Added to Cart!' : ' Add to Cart'}
              </button>
              <button className="btn btn-secondary" style={{ padding: '14px' }}>
                <Heart size={18} />
              </button>
            </div>

            {addedMessage && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success-color)', padding: '12px', borderRadius: '8px', fontWeight: '500', textAlign: 'center' }}>
                Item added to your cart successfully!
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
