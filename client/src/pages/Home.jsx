import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');

  // Extract query keyword from URL
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const keyword = searchParams.get('keyword') || '';

  // Standard category list for ShopEZ
  const categories = ['All', 'Electronics', 'Clothing', 'Shoes', 'Home & Kitchen', 'Books'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        let url = `/products?keyword=${encodeURIComponent(keyword)}`;
        if (selectedCategory && selectedCategory !== 'All') {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }
        if (minPrice) {
          url += `&minPrice=${minPrice}`;
        }
        if (maxPrice) {
          url += `&maxPrice=${maxPrice}`;
        }
        if (sort) {
          url += `&sort=${sort}`;
        }

        const { data } = await axios.get(url);
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, selectedCategory, minPrice, maxPrice, sort]);

  return (
    <div className="home-container" id="home-page-container">
      <header className="hero-banner" id="hero-banner">
        <h1>Welcome to ShopEZ</h1>
        <p>Your one-stop destination for effortless online shopping. Explore premium deals today.</p>
      </header>

      <div className="catalog-layout">
        {/* Sidebar Filters */}
        <aside className="filter-sidebar" id="filter-sidebar">
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="category-list">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-item ${selectedCategory === cat || (cat === 'All' && !selectedCategory) ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                className="input-field"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                id="min-price-input"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                className="input-field"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                id="max-price-input"
              />
            </div>
          </div>
        </aside>

        {/* Catalog Listings */}
        <main className="catalog-content">
          <div className="catalog-header">
            <h2>{keyword ? `Search Results for "${keyword}"` : 'Discover Products'}</h2>
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              id="sort-selector"
            >
              <option value="">Sort by: Newest</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div style={{ color: 'var(--danger-color)', padding: '20px', textAlign: 'center' }}>
              {error}
            </div>
          ) : products.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              No products found matching your criteria.
            </div>
          ) : (
            <div className="products-grid" id="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
