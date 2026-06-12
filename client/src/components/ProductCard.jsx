import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Check } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [isAdded, setIsAdded] = useState(false);

  const imageUrl = product.mainImg || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';

  const handleQuickAdd = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="product-card" id={`product-card-${product._id}`}>
      <Link to={`/products/${product._id}`}>
        <img
          src={imageUrl}
          alt={product.title || product.name}
          className="card-img"
          loading="lazy"
        />
        <div className="card-category">{product.category}</div>
        <h3 className="card-title">{product.title || product.name}</h3>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
        <Star size={14} fill="#f59e0b" color="#f59e0b" />
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)' }}>
          {product.rating?.toFixed(1) || '4.5'}
        </span>
        <span style={{ fontSize: '12px' }}>({product.numReviews || 12})</span>
      </div>

      <div className="card-footer">
        <span className="card-price" id={`product-price-${product._id}`}>
          ₹{product.price.toFixed(2)}
        </span>
        <button
          onClick={handleQuickAdd}
          className="card-add-btn"
          style={{
            backgroundColor: isAdded ? 'var(--success-color)' : 'var(--primary-color)',
            transition: 'background-color 0.2s ease'
          }}
          title={isAdded ? "Added!" : "Add to Cart"}
          id={`product-add-btn-${product._id}`}
        >
          {isAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
